import { TabsContent } from 'components/shadcn/ui/tabs';
import { Button } from 'components/shadcn/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from 'components/shadcn/ui/form';
import { Input } from 'components/shadcn/input';
import { formatToNaira } from 'helper';
import { useUserContext } from 'context';
import { formatCreditCardNumber, formatCVC, formatExpirationDate, clearNumber } from 'utils';
import React from 'react';
import axiosInstance from 'services';
import masterCard from 'assets/svg/mastercard.svg';
import verve from 'assets/svg/verve.svg';
import visa from 'assets/svg/visa.svg';
import noCard from 'assets/svg/nocard.svg';
import Toast from 'react-hot-toast';
import { processError } from 'helper/utils';
import { cn } from 'helper/utils';

interface Iprops {
  switchTab: (tab: string) => void;
  handleComplete: (tab: string) => void;
  data: string[];
  userInfo?: any; // change to the right type
  handleUserInfo: (info: any) => void; // change to the right type
}
const FormSchema = z.object({
  number: z.string().min(2, {
    message: 'Please enter a valid card Number.',
  }),
  expiry: z.string().min(2, {
    message: 'Please enter a valid expiry date.',
  }),
  cvv: z
    .string({
      required_error: 'Please enter a valid cvv.',
    })
    .max(3, { message: 'cvv invalid' }),
});
const StepOneCardDetails = ({
  switchTab,
  data: tabData,
  handleComplete,

  handleUserInfo,
}: Iprops) => {
  const { transactionRef, paymentDetails, possibleCardPaymentStates, isLoading } = useUserContext();

  const [issuer, setIssuer] = React.useState<string | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    // switchTab(tabData[1]);
    // handleComplete(tabData[0]);
    // const redirectUrl = new URL('https://dtu039g57sbfd.cloudfront.net');
    const redirectUrl = new URL('https://dtu039g57sbfd.cloudfront.net');
    // const redirectUrl = new URL(import.meta.env.VITE_APP_URL);

    redirectUrl.searchParams.set('methods', 'card');
    redirectUrl.searchParams.set('transactionRef', transactionRef ?? '');
    redirectUrl.searchParams.set('referenceKey', paymentDetails?.referenceKey ?? '');
    const userInfo = {
      number: clearNumber(data.number),
      verification: data.cvv,
      expMonth: data.expiry.split('/')[0],
      expYear: data.expiry.split('/')[1],
      transactionRef: transactionRef ?? '',
      redirectUrl: redirectUrl.href,
    };
    handleUserInfo(userInfo);

    try {
      const { data } = await axiosInstance.post(
        '/payment/business/validate-card-payment',
        userInfo,
        {
          headers: {
            'x-api-key': 'PublicKey',
          },
        },
      );
      if (data.isError) {
        Toast.success(data?.error?.message);

        return;
      }
      if (data.result.state === possibleCardPaymentStates?.success) {
        switchTab(tabData[3]);
        const redirectUrl = new URL(
          paymentDetails?.business?.redirectUrl || paymentDetails?.redirectUrl || '',
        );
        redirectUrl.searchParams.set('transactionRef', transactionRef || '');
        redirectUrl.searchParams.set('referenceKey', paymentDetails?.referenceKey || '');

        setTimeout(() => {
          window.location.href = redirectUrl.href;
        }, 5000);
      }
      if (data.result.state === possibleCardPaymentStates?.pending) {
        Toast.success('please wait while we process your payment');
      }
      if (data.result.state === possibleCardPaymentStates?.failure) {
        Toast.success('something went wrong, please try again');
      }
      if (data.result.state === possibleCardPaymentStates?.avs_noauth) {
        Toast.success('something went wrong, please try again');
      }
      if (data.result.state === possibleCardPaymentStates?.redirect) {
        window.location.href = data?.result?.data?.redirect;
      }
      if (data.result.state === possibleCardPaymentStates?.pin) {
        Toast.success('please enter your pin to continue', {
          duration: 5000,
        });
        switchTab(tabData[1]);
      }
    } catch (error) {
      processError(error);
    }
  }
  let amount: string | undefined = '';

  if (paymentDetails?.chargesIsInclusive) {
    amount = paymentDetails?.amount || '0';
  } else {
    const serviceCharge = paymentDetails?.serviceCharge || '0';
    const businessCommission = paymentDetails?.businessCommission || '0';
    amount = (
      Number(serviceCharge) +
      Number(businessCommission) +
      Number(paymentDetails?.amount || '0')
    ).toString();
  }
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = event;
    if (target.name === 'number') {
      const newValue = formatCreditCardNumber(target.value);
      setIssuer(newValue.issuer);
      form.setValue('number', newValue.value);
    } else if (target.name === 'expiry') {
      target.value = formatExpirationDate(target.value);
      form.setValue('expiry', target.value);
    } else if (target.name === 'cvv') {
      target.value = formatCVC(target.value);
      form.setValue('cvv', target.value);
    }
  };
  const CheckCardType = () => {
    if (!issuer) {
      return <img src={noCard} alt='' className='w-5  md:w-8' />;
    }
    if (issuer === 'visa') {
      return <img src={visa} alt='' className='w-5  md:w-8' />;
    }
    if (issuer === 'mastercard') {
      return (
        <img
          src={masterCard}
          alt=''
          className='w-5  md:w-8 animate-in transition-all ease-in duration-200'
        />
      );
    } else {
      return <img src={verve} alt='' className='w-5  md:w-8' />;
    }
  };

  return (
    <TabsContent value={tabData[0]} className=' '>
      <div className=' flex flex-col  gap-4   h-full '>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-3 md:space-y-6'>
            <FormField
              control={form.control}
              name='number'
              render={({ field }) => (
                <FormItem>
                  <div className='relative'>
                    <label className='absolute top-[-13%] md:top-[-20%] left-2 bg-white rounded-full font-extralight text-secondary-1 text-xs px-1'>
                      Card Number
                    </label>
                    <FormControl>
                      <div className='flex flex-col md:flex-row md:items-center items-end gap-1 md:gap-4'>
                        <Input
                          className='placeholder:text-secondary-1/50 py-6 placeholder:text-xs text-secondary-3'
                          placeholder='1234 0000 1234 0000'
                          {...field}
                          type='tel'
                          name='number'
                          pattern='[0-9 ]{16,22}'
                          maxLength={22}
                          autoComplete='off'
                          required
                          value={field.value}
                          onChange={handleInputChange}
                        />
                        <CheckCardType />
                      </div>
                    </FormControl>
                  </div>
                  <FormMessage className='text-xs mt-1' />
                </FormItem>
              )}
            />
            <section className=' grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-6  '>
              <FormField
                control={form.control}
                name='expiry'
                render={({ field }) => (
                  <FormItem>
                    <div className='relative'>
                      <label className='absolute top-[-20%] left-2 bg-white rounded-full font-extralight text-secondary-1 text-xs px-1'>
                        Expiry Date
                      </label>
                      <FormControl>
                        <Input
                          className='placeholder:text-secondary-1/50 py-6 placeholder:text-xs text-secondary-3'
                          {...field}
                          type='tel'
                          name='expiry'
                          autoComplete='off'
                          placeholder='MM/YY'
                          pattern='\d\d/\d\d'
                          required
                          value={field.value}
                          onChange={handleInputChange}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className='text-xs mt-1' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='cvv'
                render={({ field }) => (
                  <FormItem>
                    <div className='relative'>
                      <label className='absolute top-[-20%] left-2 bg-white rounded-full font-extralight text-secondary-1 text-xs px-1'>
                        CVV
                      </label>
                      <FormControl>
                        <Input
                          maxLength={3}
                          className='placeholder:text-secondary-1/50 py-6 placeholder:text-xs text-secondary-3'
                          {...field}
                          type='tel'
                          name='cvv'
                          autoComplete='off'
                          placeholder='123'
                          pattern='\d{3}'
                          required
                          value={field.value}
                          onChange={handleInputChange}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className='text-xs mt-1' />
                  </FormItem>
                )}
              />
            </section>

            <div className='flex items-center justify-center w-full gap-4'>
              <button
                type='submit'
                className={cn(
                  `px-12 py-2 bg-primary-1 rounded-full flex items-center justify-center gap-2 group hover:opacity-90 transition-all duration-300 ease-in-out ${
                    form.formState.isSubmitting
                      ? 'cursor-not-allowed bg-gray-500 font-[700]'
                      : 'cursor-pointer'
                  } `,
                )}
                disabled={form.formState.isSubmitting || isLoading}
              >
                {form.formState.isSubmitting ? (
                  <div className='px-5 py-1'>
                    <div className='w-4 h-4 border-t-4  border-white rounded-full animate-spin'></div>
                  </div>
                ) : (
                  <span className='font-[300] text-sm  leading-[24px] tracking-[0.4px] text-white'>
                    {formatToNaira(Number(amount) || 0)}
                  </span>
                )}
              </button>
            </div>
          </form>
        </Form>
      </div>
    </TabsContent>
  );
};

export default StepOneCardDetails;
