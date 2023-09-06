import { TabsContent } from 'components/shadcn/ui/tabs';
import { Button } from 'components/shadcn/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { cn } from 'helper/utils';
import { Form, FormControl, FormField, FormItem, FormMessage } from 'components/shadcn/ui/form';
import { Input } from 'components/shadcn/input';
import { toast } from 'components/shadcn/ui/use-toast';

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
    .max(8, { message: 'OTP invalid' }),
});
const EducationTab = ({
  switchTab,
  data: tabData,
  handleComplete,
  setModalOpen,
  setCompleted,
}: Iprops) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // const newData = {
    //   ...data,
    //   startDate: format(data.startDate, 'yyyy-MM-dd'),
    //   endDate: format(data.endDate, 'yyyy-MM-dd'),
    // };
    if (setModalOpen) {
      setModalOpen(false);
    }
    switchTab(tabData[0]);
    handleComplete(tabData[1]);
    if (setCompleted) {
      setCompleted([]); //would consider taking this line out
    }
  }
  return (
    <TabsContent value={tabData[1]} className=''>
      <div className='flex-col flex  h-full  '>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-6'>
            <section className='   grid grid-cols-1 gap-6 '>
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
                          type='number'
                          className='py-6 placeholder:text-secondary-1 text-secondary-3 placeholder:text-xs'
                          placeholder='please enter your OTP'
                          {...field}
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
                className='w-max px-12 py-2 shadow-9 bg-white rounded-full flex items-center justify-center gap-2 group hover:opacity-90 transition-all duration-300 ease-in-out'
              >
                <span className='font-[400] text-xs leading-[24px] tracking-[0.4px] text-primary-1 whitespace-nowrap'>
                  {`back`}
                </span>
              </button>
              <button
                type='submit'
                className=' px-4 md:px-12 py-2 bg-primary-1 rounded-full flex items-center justify-center gap-2 group hover:opacity-90 transition-all duration-300 ease-in-out'
              >
                <span className='font-[300] text-sm  leading-[24px] tracking-[0.4px] text-white'>
                  {`Proceed to pay`}
                </span>
              </button>
            </div>
          </form>
        </Form>
      </div>
    </TabsContent>
  );
};

export default EducationTab;
