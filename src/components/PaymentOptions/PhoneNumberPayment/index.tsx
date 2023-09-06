import FunkyPagesHero from 'components/general/FunkyPagesHero';
import PhoneNumberPaymentSteps from './PhoneNumberPaymentSteps';
import { TabsContent } from 'components/shadcn/ui/tabs';
interface Iprop {
  // defined already
  paymentMethods: string[];
}

const PhoneNumberPayment = ({ paymentMethods }: Iprop) => {
  return (
    <>
      <TabsContent value={paymentMethods[2]} className=''>
        <div className=' flex flex-col justify-center items-center rounded-lg px-8 '>
          <FunkyPagesHero />
          <PhoneNumberPaymentSteps />
        </div>
      </TabsContent>
    </>
  );
};

export default PhoneNumberPayment;
