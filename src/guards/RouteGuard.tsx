import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useUserContext } from 'context';
import { set } from 'date-fns';
import { useEffect } from 'react';

const RouteGuard = ({ children }: any) => {
  const { setUserTransactionRef, handleSetPaymentMethods, handleSetRedirectFromCardHandler } =
    useUserContext();
  const user = true;

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('hi');
  }, []);
  if (!user) {
    return <Navigate to='/' />;
  }

  return children;
};

export default RouteGuard;
