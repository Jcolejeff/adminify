import React, { useContext, useEffect, useState, ReactNode, createContext } from 'react';
import axiosInstance from 'services';
import Toast from 'react-hot-toast';
import { processError } from 'helper/utils';
import { IAuthUser, IUserContextType, IUserProviderProps } from 'types';
export const UserContext = createContext<IUserContextType | undefined>(undefined);
export const UserProvider: React.FC<IUserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IAuthUser | null>(null);

  return (
    <UserContext.Provider
      value={{
        user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
