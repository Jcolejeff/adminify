import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useUserContext } from 'context';
import { set } from 'date-fns';
import { useEffect } from 'react';

const RouteGuard = ({ children }: any) => {
  const { setUserTransactionRef, handleSetPaymentMethods, handleSetRedirectFromCardHandler } =
    useUserContext();

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const transactionRef = searchParams.get('transactionRef');
  const paymentMethods = searchParams.get('methods');
  const responseFromRedirect = searchParams.get('response');
  const secondResponseFromRedirect = searchParams.get('tx_ref');

  useEffect(() => {
    if (transactionRef) {
      setUserTransactionRef(transactionRef);
    }
    if (secondResponseFromRedirect) {
      handleSetRedirectFromCardHandler(true);
      setUserTransactionRef(secondResponseFromRedirect);
      handleSetPaymentMethods(['bank_transfer', 'card']);
      return;
    }
    if (responseFromRedirect) {
      const currentURL = window.location.href;
      const decodedURL = decodeURIComponent(currentURL);
      const responseIndex = decodedURL.indexOf('response=');
      if (responseIndex !== -1) {
        const responseStartIndex = responseIndex + 'response='.length;
        const responseEncoded = decodedURL.substring(responseStartIndex);
        const responseDecoded = decodeURIComponent(responseEncoded);

        try {
          const responseJSON = JSON.parse(responseDecoded);
          const txRef = responseJSON.txRef;

          if (txRef) {
            handleSetRedirectFromCardHandler(true);
            setUserTransactionRef(txRef);
            handleSetPaymentMethods(['bank_transfer', 'card']);
          }
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      } else {
        console.error('response parameter not found in URL');
      }
    }

    if (paymentMethods) {
      handleSetPaymentMethods(paymentMethods?.split(','));
    }
  }, []);
  if (!transactionRef && !responseFromRedirect && !secondResponseFromRedirect) {
    return <Navigate to='/invalid' replace />;
  }

  return children;
};

export default RouteGuard;
