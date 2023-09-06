import { useContext } from 'react';
import { UserContext } from 'context';
import { IUserContextType } from 'types';
// Custom hook for using the user context
export const useUserContext = (): IUserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
