import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'components/shadcn/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'components/shadcn/ui/select';

const FormSchema = z.object({
  type: z.string(),
});
interface Iprops {
  switchTab: (tab: string) => void;
  paymentMethods: string[];
}

export default function MoblieNav({ switchTab, paymentMethods }: Iprops) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: paymentMethods[0],
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log('');
  }

  return (
    <div className=' md:hidden'>
      <h2 className='text-center my-4'>Select Card/Bank/Phone:</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='w-[100%] space-y-6 px-8  md:hidden'>
          <FormField
            control={form.control}
            name='type'
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    switchTab(value);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className='capitalize'>
                      <SelectValue placeholder='Select Payment Method' className='capitalize' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {paymentMethods.map((item) => (
                      <SelectItem key={item} value={item} className='capitalize'>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
