import Payment from 'payment';

export function clearNumber(value = ''): string {
  return value.replace(/\D+/g, '');
}
interface IFormatCreditCardNumber {
  value: string;
  issuer: string | null;
}

export function formatCreditCardNumber(value: string): IFormatCreditCardNumber {
  if (!value) {
    return { value: '', issuer: null };
  }

  const issuer: string | null = Payment.fns.cardType(value);
  const clearValue: string = clearNumber(value);
  let nextValue: string;

  switch (issuer) {
    case 'amex':
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(4, 10)} ${clearValue.slice(
        10,
        15,
      )}`;
      break;
    case 'dinersclub':
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(4, 10)} ${clearValue.slice(
        10,
        14,
      )}`;
      break;
    default:
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(4, 8)} ${clearValue.slice(
        8,
        12,
      )} ${clearValue.slice(12, 19)} `;
      break;
  }

  return { value: nextValue.trim(), issuer };
}

export function formatCVC(
  value: string,
  prevValue = '',
  allValues: { [key: string]: any } = {},
): string {
  const clearValue: string = clearNumber(value);
  const maxLength = 3;

  if (allValues.number) {
    const issuer: string | null = Payment.fns.cardType(allValues.number);
  }

  return clearValue.slice(0, maxLength);
}

export function formatExpirationDate(value: string): string {
  const clearValue: string = clearNumber(value);

  if (clearValue.length >= 3) {
    return `${clearValue.slice(0, 2)}/${clearValue.slice(2, 4)}`;
  }

  return clearValue;
}
