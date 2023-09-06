import { Tabs, TabsList, TabsTrigger } from 'components/shadcn/ui/tabs';
import StepOneCardDetails from './StepOneCardDetails';
import { useState } from 'react';
import StepTwoPin from './StepTwoCardPin';
import StepThreeOTP from './StepThreeOTP';
import SuccessfulPayment from './SuccessfulPayment';

interface Iprop {
  title?: string;
}

const CardPaymentSteps = ({ title }: Iprop) => {
  const [activeTab, setActiveTab] = useState<string>('Card Details');
  const [completed, setCompleted] = useState<string[]>([]);
  const [data] = useState<string[]>(['Card Details', 'Pin', 'OTP', 'Successful Payment']);
  const [userInfo, setUserInfo] = useState<any>({
    number: '',
    verification: '',
    expMonth: '',
    expYear: '',
    transactionRef: '',
    redirectUrl: '',
  });
  // change to the right type
  const switchTab = (tab: string) => {
    setActiveTab(tab);
  };
  const handleComplete = (tab: string) => {
    setCompleted([...completed, tab]);
  };
  const handleUserInfo = (info: any) => {
    setUserInfo({ ...userInfo, ...info });
  };

  return (
    <div className=' w-full justify-self-center self-end'>
      <Tabs defaultValue={data[0]} value={activeTab} className=''>
        <StepOneCardDetails
          switchTab={switchTab}
          data={data}
          handleComplete={handleComplete}
          userInfo={userInfo}
          handleUserInfo={handleUserInfo}
        />
        <StepTwoPin
          switchTab={switchTab}
          data={data}
          handleComplete={handleComplete}
          userInfo={userInfo}
          handleUserInfo={handleUserInfo}
        />
        <StepThreeOTP
          switchTab={switchTab}
          data={data}
          handleComplete={handleComplete}
          setCompleted={setCompleted}
        />
        <SuccessfulPayment switchTab={switchTab} data={data} handleComplete={handleComplete} />
      </Tabs>
    </div>
  );
};

export default CardPaymentSteps;
