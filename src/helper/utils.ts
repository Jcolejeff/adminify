import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AxiosError } from 'axios';
import Toast from 'react-hot-toast';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const processError = (err: any) => {
  const error = err as AxiosError<any>;
  if (error?.response?.data?.error?.message) {
    Toast.error(error?.response?.data?.error?.message);
  } else {
    Toast.error(error?.message || `An error occurred`);
  }
};
