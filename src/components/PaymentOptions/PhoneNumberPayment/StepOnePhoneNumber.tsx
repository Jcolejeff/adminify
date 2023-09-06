import { TabsContent } from 'components/shadcn/ui/tabs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from 'components/shadcn/ui/form';
import { Input } from 'components/shadcn/input';
import { toast } from 'components/shadcn/ui/use-toast';
import { useUserContext } from 'context';
import { formatToNaira } from 'helper';

interface Iprops {
  switchTab: (tab: string) => void;
  handleComplete: (tab: string) => void;

  data: string[];
}
const FormSchema = z.object({
  phone: z.string().min(2, {
    message: 'Please enter a valid phone number',
  }),
});
const PhoneNumberForm = ({ switchTab, data: tabData, handleComplete }: Iprops) => {
  const { transactionRef, paymentDetails } = useUserContext();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    switchTab(tabData[1]);
    handleComplete(tabData[0]);
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

  return (
    <TabsContent value={tabData[0]} className=''>
      <div className=' flex flex-col  h-full  '>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-6'>
            <section className='   '>
              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <div className='relative'>
                      <label className='absolute top-[-20%] left-2 bg-white rounded-full font-extralight text-secondary-1 text-xs px-1'>
                        Phone Number
                      </label>
                      <FormControl>
                        <Input
                          type='number'
                          className='py-6 text-secondary-3 placeholder:text-secondary-1 placeholder:text-xs'
                          placeholder='please enter your phone number'
                          {...field}
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
                className='px-12 py-2 bg-primary-1 rounded-full flex items-center justify-center gap-2 group hover:opacity-90 transition-all duration-300 ease-in-out'
              >
                <span className='font-[300] text-sm  leading-[24px] tracking-[0.4px] text-white'>
                  {formatToNaira(Number(amount) || 0)}
                </span>
              </button>
            </div>
          </form>
        </Form>
      </div>
    </TabsContent>
  );
};

export default PhoneNumberForm;
