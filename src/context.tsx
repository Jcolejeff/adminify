import React, { useContext, useEffect, useState, ReactNode, createContext } from 'react';
import axiosInstance from 'services';
import io, { Socket } from 'socket.io-client';
import { useToast } from 'components/shadcn/ui/use-toast';
import Toast from 'react-hot-toast';
import { set } from 'date-fns';
import { processError } from 'helper/utils';

// Define an interface for the context
interface UserContextType {
  setUserTransactionRef: (transactionRef: string) => void;
  handleSetPaymentMethods: (methods: string[]) => void;
  user?: string | null;
  transactionRef: string | null;
  paymentDetails: PaymentDetails | null;
  paymentMethods: string[];
  isLoading: boolean;
  isError: boolean;
  possibleCardPaymentStates?: IpossibleCardPaymentStates;
  redirectFromCardHandler: boolean;
  fetchPaymentDetails: (paymentType?: string) => void;
  handleSetRedirectFromCardHandler: (value: boolean) => void;
}

interface UserProviderProps {
  children: ReactNode;
}
interface Business {
  name: string;
  logoUrl: string;
  apiKey: string;
  redirectUrl: string | null;
}

interface WalletBank {
  accountNumber: string;
  accountName: string;
  currency: string;
  bankName: string;
  expiryDate: string;
  walletId: string;
}
interface IpossibleCardPaymentStates {
  pin: 'pin';
  avs_noauth: 'avs_noauth';
  otp: 'otp';
  redirect: 'redirect';
  success: 'success';
  pending: 'pending';
  failure: 'failure';
}

interface PaymentDetails {
  id: string;
  status: string;
  amount: string;
  businessCommission: string;
  serviceCharge: string;
  chargesIsInclusive: boolean;
  chargeType: string;
  completed: boolean;
  referenceKey: string;
  statusReason: string | null;
  redirectUrl: string;
  business: Business;
  walletBank: WalletBank;
}
const UserContext = createContext<UserContextType | undefined>(undefined);
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { toast } = useToast();
  const [user, setUser] = useState<string | null>('jeff');
  const [transactionRef, setTransactionRef] = useState<string | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<string[]>(['Bank Transfer']);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [redirectFromCardHandler, setRedirectFromCardHandler] = useState<boolean>(false);
  const possibleCardPaymentStates: IpossibleCardPaymentStates = {
    pin: 'pin',
    avs_noauth: 'avs_noauth',
    otp: 'otp',
    redirect: 'redirect',
    success: 'success',
    pending: 'pending',
    failure: 'failure',
  };

  const baseUrl = import.meta.env.VITE_API_URL;
  const setUserTransactionRef = (transactionRef: string) => {
    setTransactionRef(transactionRef);
    setUser('kela');
  };

  const handleSetPaymentMethods = (methods: string[]) => {
    setPaymentMethods(methods);
  };
  const handleSetRedirectFromCardHandler = (value: boolean) => {
    setRedirectFromCardHandler(value);
  };
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const redirectTo = async (
    url: string,
    defaultUrl: string,
    transactionRef: string,
    referenceKey: string,
  ) => {
    if (!url) {
      try {
        const { data } = await axiosInstance.get(
          `/payment/business/card-auth-url?transactionRef=${transactionRef}&redirectUrl=${defaultUrl}`,
        );
        window.location.href = data?.result;
      } catch (error) {
        processError(error);
      }
    } else {
      window.location.href = url;
    }
  };
  const fetchPaymentDetails = async (paymentType = 'bank_transfer') => {
    setIsLoading(true);

    if (redirectFromCardHandler) {
      await delay(10000); // This will introduce a delay of 10 seconds
    }

    try {
      const { data } = await axiosInstance.get(
        `/payment/business/charge?transactionRef=${transactionRef}&paymentType=${paymentType}`,
      );
      const { result } = data;

      setPaymentDetails(result);

      if (result?.completed || result?.status === 'success') {
        setTimeout(() => {
          const redirectUrl = new URL(result?.business?.redirectUrl || result?.redirectUrl);
          redirectUrl.searchParams.set('transactionRef', transactionRef || '');
          redirectUrl.searchParams.set('referenceKey', result?.referenceKey);
          window.location.href = redirectUrl.href;
        }, 5000);
      }

      if (
        paymentType === 'card' &&
        !result?.cardAuthInHouse &&
        !(result?.completed || result?.status === 'success')
      ) {
        const newUrl = new URL('https://dtu039g57sbfd.cloudfront.net');
        newUrl.searchParams.set('methods', 'card');
        newUrl.searchParams.set('transactionRef', transactionRef ?? '');
        newUrl.searchParams.set('referenceKey', result?.referenceKey ?? '');
        await redirectTo(
          result?.cardAuthUrl,
          newUrl.href,
          transactionRef ?? '',
          result?.referenceKey,
        );
        return;
      }

      setIsLoading(false);
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
      setPaymentDetails(null);
      processError(error);
    }
  };

  console.log('paymentDetails', paymentDetails);

  useEffect(() => {
    if (transactionRef) {
      fetchPaymentDetails();
    }
  }, [transactionRef]);
  useEffect(() => {
    let socket: Socket | null = null;

    if (transactionRef && paymentDetails) {
      socket = io(baseUrl, {
        extraHeaders: {
          'x-api-key': `PublicKey`,
        },
        query: { transactionRef },
      });

      socket.on('connect', () => {
        console.log('Connected to socket server');
      });

      socket.on('payment.received', (data: any) => {
        Toast.success('Payment was successful!, You will be redirected shortly in 5 seconds', {
          duration: 5000,
        });
        const redirectUrl = new URL(
          paymentDetails?.business?.redirectUrl || paymentDetails?.redirectUrl || '',
        );
        redirectUrl.searchParams.set('transactionRef', transactionRef || '');
        redirectUrl.searchParams.set('referenceKey', paymentDetails?.referenceKey || '');

        setTimeout(() => {
          window.location.href = redirectUrl.href;
        }, 5000);
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from socket server');
      });

      socket.on('error', (error: any) => {
        console.error('Error:', error);
      });
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, [transactionRef, paymentDetails]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUserTransactionRef,
        transactionRef,
        paymentDetails,
        paymentMethods,
        handleSetPaymentMethods,
        isLoading,
        isError,
        possibleCardPaymentStates,
        redirectFromCardHandler,
        fetchPaymentDetails,
        handleSetRedirectFromCardHandler,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for using the user context
export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
