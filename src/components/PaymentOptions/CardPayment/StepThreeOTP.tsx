import { TabsContent } from 'components/shadcn/ui/tabs';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { cn } from 'helper/utils';
import { Form, FormControl, FormField, FormItem, FormMessage } from 'components/shadcn/ui/form';
import { Input } from 'components/shadcn/input';
import Toast from 'react-hot-toast';
import { processError } from 'helper/utils';
import axiosInstance from 'services';
import { useUserContext } from 'context';

interface Iprops {
  switchTab: (tab: string) => void;
  handleComplete: (tab: string) => void;
  setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setCompleted?: React.Dispatch<React.SetStateAction<string[]>>;

  data: string[];
}
const FormSchema = z.object({
  OTP: z
    .string()
    .min(4, {
      message: 'Please enter a valid OTP',
    })
    .max(10, { message: 'OTP invalid' }),
});
const StepThreeOTP = ({
  switchTab,
  data: tabData,
  handleComplete,
  setModalOpen,
  setCompleted,
}: Iprops) => {
  const { transactionRef, paymentDetails, possibleCardPaymentStates } = useUserContext();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    // if (setModalOpen) {
    //   setModalOpen(false);
    // }
    // switchTab(tabData[0]);
    // handleComplete(tabData[2]);

    // if (setCompleted) {
    //   setCompleted([]); //would consider taking this line out
    // }
    try {
      const response = await axiosInstance.post(
        '/payment/business/validate-card-otp',
        {
          transactionRef,
          otp: data.OTP,
        },
        {
          headers: {
            'x-api-key': 'PublicKey',
          },
        },
      );
      if (response.data.isError) {
        Toast.success(response.data?.error?.message);
        return;
      }
      if (response.data.result.state === possibleCardPaymentStates?.success) {
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
      if (response.data.result.state === possibleCardPaymentStates?.pending) {
        Toast.success('please wait while we process your payment');
      }

      if (response.data?.result?.state === possibleCardPaymentStates?.failure) {
        Toast.success('something went wrong, please try again');
      }
      if (response?.data.result.state === possibleCardPaymentStates?.avs_noauth) {
        Toast.success('something went wrong, please try again');
      }

      if (response.data.result.state === possibleCardPaymentStates?.otp) {
        Toast.success(response.data?.result?.data?.message, {
          duration: 10000,
        });
        switchTab(tabData[2]);
      }
    } catch (error) {
      processError(error);
    }
  }
  return (
    <TabsContent value={tabData[2]} className=''>
      <div className='flex-col flex  '>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-6'>
            <section className='   grid grid-cols-1  gap-6 '>
              <FormField
                control={form.control}
                name='OTP'
                render={({ field }) => (
                  <FormItem>
                    <div className='relative'>
                      <label className='absolute top-[-20%] left-2 bg-white rounded-full font-extralight text-secondary-1 text-xs px-1'>
                        OTP
                      </label>
                      <FormControl>
                        <Input
                          type='tel'
                          className='py-6 placeholder:text-secondary-1 text-secondary-3 placeholder:text-xs'
                          placeholder='please enter OTP'
                          {...field}
                          maxLength={10}
                          autoComplete='off'
                          pattern='\d{4,10}'
                          required
                        />
                      </FormControl>
                    </div>
                    <FormMessage className='text-xs mt-1' />
                  </FormItem>
                )}
              />
            </section>

            <div className='flex items-center justify-between w-full gap-4'>
              <button
                onClick={() => {
                  switchTab(tabData[1]);
                }}
                type='button'
                className='w-max px-8 md:px-12  py-2 shadow-9 bg-white rounded-full flex items-center justify-center gap-2 group hover:opacity-90 transition-all duration-300 ease-in-out'
              >
                <span className='font-[400] text-xs leading-[24px] tracking-[0.4px] text-primary-1 whitespace-nowrap'>
                  {`back`}
                </span>
              </button>

              <button
                type='submit'
                className={cn(
                  ` px-4 md:px-12 py-2 bg-primary-1 rounded-full flex items-center justify-center gap-2 group hover:opacity-90 transition-all duration-300 ease-in-out ${
                    form.formState.isSubmitting
                      ? 'cursor-not-allowed bg-gray-500 font-[700]'
                      : 'cursor-pointer'
                  } `,
                )}
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <div className='px-10 py-1'>
                    <div className='w-4 h-4 border-t-4  border-white rounded-full animate-spin'></div>
                  </div>
                ) : (
                  <span className='font-[300] text-sm  leading-[24px] tracking-[0.4px] text-white'>
                    {`Proceed to pay`}
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

export default StepThreeOTP;
