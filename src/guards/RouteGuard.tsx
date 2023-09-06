import { Navigate } from 'react-router-dom';
import { useUserContext } from 'helper/hooks/useUserContext';

const RouteGuard = ({ children }: any) => {
  const { user } = useUserContext();

  if (!user) {
    return <Navigate to='/' />;
  }

  return children;
};

export default RouteGuard;
