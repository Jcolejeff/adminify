import React, { useContext, useEffect, useState, ReactNode, createContext } from 'react';
import axiosInstance from 'services';
import Toast from 'react-hot-toast';
import { processError } from 'helper/utils';
import { IAuthUser, IUserContextType, IUserProviderProps } from 'types';
export const UserContext = createContext<IUserContextType | undefined>(undefined);
export const UserProvider: React.FC<IUserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IAuthUser | null>({
    id: '838393939',
    password: 'a random password',
    email: 'ikwuh@gmail.com',
  });
  const handleSetUser = (user: IAuthUser | null) => {
    setUser(user);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        handleSetUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
