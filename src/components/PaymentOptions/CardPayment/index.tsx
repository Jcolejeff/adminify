import FunkyPagesHero from 'components/general/FunkyPagesHero';
import CardPaymentSteps from './CardPaymentSteps';
import { TabsContent } from 'components/shadcn/ui/tabs';
import { useUserContext } from 'context';
import { useNavigate } from 'react-router-dom';
import img from 'assets/svg/not-found.svg';
import bigSmile from 'assets/svg/bigSmile.svg';
import ContentLoader from 'components/general/ContentLoader';

interface Iprop {
  paymentMethods: string[];
}

const CardPayment = ({ paymentMethods }: Iprop) => {
  const navigate = useNavigate();

  const { transactionRef, paymentDetails, isError, isLoading } = useUserContext();
  if (isError) {
    return (
      <TabsContent value={paymentMethods[1]} className=''>
        <div className=''>
          <FunkyPagesHero />
          <div className='flex flex-col justify-center gap-4 items-center px-8'>
            <img src={img} alt='not found' className='w-[8rem] ' />

            <p className='text-danger-1 text-center text-xs md:text-sm font-semibold'>
              An error occured while trying to fetch your payment details
            </p>
            <button
              className='bg-primary-1 mt-4 md:mt-6 text-xs md:text-sm text-white py-2 px-4 md:px-6 md:py-2 rounded-full'
              onClick={() => navigate(-1)}
            >
              Go back
            </button>
          </div>
        </div>
      </TabsContent>
    );
  }
  if (paymentDetails?.completed || paymentDetails?.status === 'success') {
    return (
      <TabsContent value={paymentMethods[1]} className='h-full'>
        <div className='  h-full flex flex-col items-center justify-center w-full gap-6 '>
          <img src={bigSmile} className='w-[50px] md:w-[90px]' />
          <h2 className='text-base max-w-md font-semibold text-center'>
            Your payment was successful!
          </h2>
          <h3 className='text-gray-500 text-xs max-w-lg text-center'>
            You will be redirected to the merchant’s website in 5 seconds
          </h3>
          <div className='flex  items-center justify-center w-full gap-4'></div>
        </div>
      </TabsContent>
    );
  }
  return (
    <>
      <TabsContent value={paymentMethods[1]} className=' '>
        <div className=' flex flex-col    items-center rounded-lg px-8'>
          <FunkyPagesHero />
          <ContentLoader isLoading={isLoading}>
            <CardPaymentSteps />
          </ContentLoader>
        </div>
      </TabsContent>
    </>
  );
};

export default CardPayment;
