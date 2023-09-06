import { ReactNode } from 'react';

export interface IAuthUser {
  id: string;
  email: string;
  password: string;
}
export interface IUserContextType {
  user?: IAuthUser | null;
  handleSetUser: (user: IAuthUser | null) => void;
}

export interface IUserProviderProps {
  children: ReactNode;
}
