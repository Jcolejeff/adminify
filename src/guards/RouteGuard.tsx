import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useUserContext } from 'helper/hooks/useUserContext';

const RouteGuard = ({ children }: any) => {
  const { user } = useUserContext();

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
