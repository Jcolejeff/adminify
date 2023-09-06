import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger } from 'components/shadcn/ui/tabs';
import CardPayment from './CardPayment';
import BankTransferPayment from './BankTransfer/BankTransferPayment';
import PhoneNumberPayment from './PhoneNumberPayment';
import MobileNav from 'components/mobileNav';
import { useLocation, useNavigate } from 'react-router-dom';
import CloseTransactionModal from 'components/CloseTransactionModal';
import { useUserContext } from 'context';
const PaymentOptions = () => {
  const { paymentMethods: acceptedPaymentMethods, fetchPaymentDetails } = useUserContext();

  const [paymentMethods, setPaymentMethods] = useState<string[]>(['Bank Transfer']);

  useEffect(() => {
    let methods = ['Bank Transfer'];

    if (acceptedPaymentMethods?.length >= 2) {
      const otherMethods = acceptedPaymentMethods.slice(1).map((item) => `${item} Payment`);
      methods = [...methods, ...otherMethods];
    }

    setPaymentMethods(methods);
  }, [acceptedPaymentMethods]);
  const [activeTab, setActiveTab] = useState<string>(paymentMethods[0]);

  const switchTab = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <section className=' w-full h-full overflow-x-hidden flex items-center  px-8 xxs:px-4 md:px-2  py-12 xxs:py-8  bg-black    overflow-auto'>
      <div className='w-full container max-w-2xl rounded-md h-full  md:max-h-[600px] max-h-[670px]  border  relative bg-white  '>
        <CloseTransactionModal />
        <Tabs
          orientation='vertical'
          defaultValue='account'
          activationMode='manual'
          value={activeTab}
          className=' grid grid-cols-[1fr] md:grid-cols-[1fr_2fr]  h-full border  '
        >
          <TabsList className=' hidden  pt-8   md:flex flex-col justify-start w-full   bg-slate-100 px-1'>
            <h3 className='text-black self-start px-4  text-[0.65rem] mb-2 font-light leading-[24px] tracking-[0.4px]'>
              SELECT A PAYMENT OPTION
            </h3>
            {paymentMethods.map((item, index) => (
              <TabsTrigger
                key={index}
                value={item}
                onClick={() => {
                  switchTab(item);
                  if (item === 'Bank Transfer') {
                    fetchPaymentDetails('bank_transfer');
                  } else if (item === 'card Payment') {
                    fetchPaymentDetails('card');
                    console.log('item', item);
                  } else if (item === 'Phone Number Payment') {
                    fetchPaymentDetails('phone_number');
                  }
                }}
                className={`justify-start w-full    pl-0 ${
                  activeTab === item &&
                  `border-l-[5px] border-primary-1 shadow-9 rounded-full bg-white text-primary-1`
                }`}
              >
                <div className='flex flex-col gap-1 justify-start items-start px-4 py-1   '>
                  <h3 className='text-[0.8rem] capitalize text-black font-light text-inherit'>
                    {item}
                  </h3>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
          <section className='w-full h-full'>
            <MobileNav paymentMethods={paymentMethods} switchTab={switchTab} />
            <CardPayment paymentMethods={paymentMethods} />
            <BankTransferPayment paymentMethods={paymentMethods} />
            <PhoneNumberPayment paymentMethods={paymentMethods} />
          </section>
        </Tabs>
      </div>
    </section>
  );
};

export default PaymentOptions;
