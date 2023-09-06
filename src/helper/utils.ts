import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { IAuthUser } from 'types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function firstCharsOfWords(str: string) {
  const words = str.split(' ');

  if (words.length === 1 && words[0].length > 1) {
    const word = words[0];
    return word[0] + word[word.length - 1];
  }

  return words.map((word) => word[0]).join('');
}

export const addUserToLocalStorage = (user: IAuthUser) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

export const removeUserFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
  }
};

export const getUserFromLocalStorage = () => {
  let user;
  if (typeof window !== 'undefined') {
    const result = localStorage.getItem('user');
    user = result ? JSON.parse(result) : null;
  }

  return user;
};
