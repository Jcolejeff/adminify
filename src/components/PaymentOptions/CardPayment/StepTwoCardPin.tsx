import { TabsContent } from 'components/shadcn/ui/tabs';
import { Button } from 'components/shadcn/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
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
  userInfo?: any; // change to the right type
  handleUserInfo: (info: any) => void; // change to the right type

  data: string[];
}
const FormSchema = z.object({
  Pin: z
    .string()
    .min(2, {
      message: 'Please enter a valid pin',
    })
    .max(4, { message: 'pin is too long' }),
});
const StepTwoCardPin = ({
  switchTab,
  data: tabData,
  handleComplete,
  userInfo,
  handleUserInfo,
}: Iprops) => {
  const { transactionRef, paymentDetails, possibleCardPaymentStates } = useUserContext();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    // switchTab(tabData[2]);
    // handleComplete(tabData[1]);

    try {
      const response = await axiosInstance.post(
        '/payment/business/validate-card-payment',
        {
          ...userInfo,
          authorization: {
            mode: 'pin',
            pin: data.Pin,
          },
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
      if (response?.data.result.state === possibleCardPaymentStates?.redirect) {
        window.location.href = response?.data?.result?.data?.redirect;
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
    <TabsContent value={tabData[1]} className=''>
      <div className=' flex flex-col '>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-6'>
            <section className='   '>
              <FormField
                control={form.control}
                name='Pin'
                render={({ field }) => (
                  <FormItem>
                    <div className='relative'>
                      <label className='absolute top-[-20%] left-2 bg-white rounded-full font-extralight text-secondary-1 text-xs px-1'>
                        Card Pin
                      </label>
                      <FormControl>
                        <Input
                          type='password'
                          autoComplete='off'
                          className='py-6 text-secondary-3 placeholder:text-secondary-1 placeholder:text-xs'
                          placeholder='please enter your card pin'
                          {...field}
                          maxLength={4}
                          required
                          pattern='\d{4}'
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
                  switchTab(tabData[0]);
                }}
                type='button'
                className='w-max px-8 md:px-12 py-2 shadow-9 bg-white rounded-full flex items-center justify-center gap-2 group hover:opacity-90 transition-all duration-300 ease-in-out'
              >
                <span className='font-[400] text-xs leading-[24px] tracking-[0.4px] text-primary-1 whitespace-nowrap'>
                  {`Back`}
                </span>
              </button>
              <button
                type='submit'
                className={cn(
                  `px-6 md:px-12 py-2 bg-primary-1 rounded-full flex items-center justify-center gap-2 group hover:opacity-90 transition-all duration-300 ease-in-out ${
                    form.formState.isSubmitting
                      ? 'cursor-not-allowed bg-gray-500 font-[700]'
                      : 'cursor-pointer'
                  } `,
                )}
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <div className='px-5 py-1'>
                    <div className='w-4 h-4 border-t-4  border-white rounded-full animate-spin'></div>
                  </div>
                ) : (
                  <span className='font-[300] text-sm  leading-[24px] tracking-[0.4px] text-white'>
                    {`Continue`}
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

export default StepTwoCardPin;
