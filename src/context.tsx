import React, { useState, createContext } from 'react';
import { getUserFromLocalStorage } from 'helper/utils';
import { IAuthUser, IUserContextType, IUserProviderProps } from 'types';
export const UserContext = createContext<IUserContextType | undefined>(undefined);
export const UserProvider: React.FC<IUserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IAuthUser | null>(getUserFromLocalStorage());
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
