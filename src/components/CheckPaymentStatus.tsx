import React, { useState, useEffect } from 'react';
import { useUserContext } from 'context';
import axiosInstance from 'services';
import { useToast } from './shadcn/ui/use-toast';
import { cn } from 'helper/utils';
import Toast from 'react-hot-toast';
import { processError } from 'helper/utils';

const CheckPaymentStatus: React.FC = () => {
  const { toast } = useToast();
  const [countdownValue, setCountdownValue] = useState<number>(10);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [startChecking, setStartChecking] = useState<boolean>(false);

  const { transactionRef, paymentDetails } = useUserContext();

  const checkPaymentStatus = async () => {
    try {
      const response = await axiosInstance.get(
        `/payment/business/charge?transactionRef=${transactionRef}`,
      );

      if (!response.data.isError && response.data.result.status !== 'pending' && transactionRef) {
        setShowSuccess(true);
        setStartChecking(false);
        Toast.success('Payment was successful!, You will be redirected shortly in 5 seconds', {
          duration: 5000,
        });
        setTimeout(() => {
          const redirectUrl = new URL(
            response.data.result?.business?.redirectUrl || response.data.result?.redirectUrl,
          );
          redirectUrl.searchParams.set('transactionRef', transactionRef);
          redirectUrl.searchParams.set('referenceKey', response.data.result?.referenceKey);

          window.location.href = redirectUrl.href;
        }, 5000);
        clearInterval(checkStatusInterval); // Stop checking payment status if it's no longer pending
      }
    } catch (error) {
      processError(error);
    }
  };

  let checkStatusInterval: number;

  const startCheckingPaymentStatus = () => {
    if (transactionRef) {
      setStartChecking(true);
      // Start polling to check the status of the transaction immediately, and then every 10 seconds
      checkPaymentStatus().then(() => null);
      checkStatusInterval = setInterval(checkPaymentStatus, 10000);
    }
  };

  useEffect(() => {
    return () => {
      if (checkStatusInterval) {
        clearInterval(checkStatusInterval);
      }
    };
  }, []);

  return (
    <div className=' flex justify-center items-center'>
      <button
        className={cn(
          `bg-primary-1 mt-4 md:mt-6 text-sm text-white py-3 px-8 rounded-full ${
            startChecking ? 'cursor-not-allowed bg-gray-500 font-[700]' : 'cursor-pointer'
          } `,
        )}
        onClick={startCheckingPaymentStatus}
        disabled={startChecking || showSuccess}
      >
        {startChecking ? (
          <div className='flex gap-3'>
            <p>Checking Payment Status...</p>
            <div className='w-4 h-4 border-t-4 border-white rounded-full animate-spin'></div>
          </div>
        ) : showSuccess ? (
          'Payment Successful'
        ) : (
          `I've sent the money`
        )}
      </button>
    </div>
  );
};

export default CheckPaymentStatus;
