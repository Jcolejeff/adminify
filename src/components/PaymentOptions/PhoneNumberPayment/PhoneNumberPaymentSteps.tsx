import { Tabs } from 'components/shadcn/ui/tabs';
import { useState } from 'react';
import StepOnePhoneNumber from './StepOnePhoneNumber';
import StepTwoOTp from './StepTwoOTP';

interface Iprop {
  title?: string;
}

const PhoneNumberPayment = ({ title }: Iprop) => {
  const [activeTab, setActiveTab] = useState<string>('Phone');
  const [completed, setCompleted] = useState<string[]>([]);
  const [data] = useState<string[]>(['Phone', 'OTPcode']);
  const switchTab = (tab: string) => {
    setActiveTab(tab);
  };
  const handleComplete = (tab: string) => {
    setCompleted([...completed, tab]);
  };

  return (
    <div className=' w-full '>
      <Tabs defaultValue={data[0]} value={activeTab} className=''>
        <StepOnePhoneNumber switchTab={switchTab} data={data} handleComplete={handleComplete} />
        <StepTwoOTp
          switchTab={switchTab}
          data={data}
          handleComplete={handleComplete}
          setCompleted={setCompleted}
        />
      </Tabs>
    </div>
  );
};

export default PhoneNumberPayment;
