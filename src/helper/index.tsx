export function formatToNaira(amount: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(amount / 100);
}

export const ensureIsNumber = (i: any) => {
  return isNaN(i) || !i ? 0 : parseInt(`${i}`);
};

export const undefinedNumberChecker = (i?: number) => {
  if (i) {
    return i;
  } else {
    return 0;
  }
};

export const shortNumber = (i: string, withDecimal?: boolean) => {
  if (i) {
    const num = parseFloat?.(i);
    if (num >= 1000000) {
      return withDecimal ? `${(num / 1000000).toFixed(2)}M` : `${num / 1000000}M`;
    } else if (num >= 1000) {
      return withDecimal ? `${(num / 1000).toFixed(2)}K` : `${num / 1000}K`;
    } else {
      return withDecimal ? num.toFixed(2) : num;
    }
  }
};

export const checkIfEmail = (str: string) => {
  const regexExp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;

  return regexExp.test(str);
};
