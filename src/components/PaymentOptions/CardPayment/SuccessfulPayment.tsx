import { TabsContent } from 'components/shadcn/ui/tabs';
import React from 'react';
import img from 'assets/svg/bigSmile.svg';

interface Iprops {
  switchTab: (tab: string) => void;
  handleComplete: (tab: string) => void;
  setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setCompleted?: React.Dispatch<React.SetStateAction<string[]>>;

  data: string[];
}

const SuccessfulPayment = ({ switchTab, data: tabData, handleComplete }: Iprops) => {
  return (
    <TabsContent value={tabData[3]} className=''>
      <div className=' flex flex-col items-center justify-center w-full gap-6 '>
        <img src={img} className='w-[50px] md:w-[90px]' />
        <h2 className='text-base max-w-md font-semibold text-center'>
          Your payment was successful!
        </h2>
        <h3 className='text-gray-500 text-xs max-w-lg text-center'>
          You will be redirected to the merchant’s website in 5 seconds
        </h3>
        <div className='flex  items-center justify-center w-full gap-4'>
          {/* <button
            type='button'
            className='px-10 py-2 bg-primary-1 rounded-[6px] flex items-center justify-center gap-2 group hover:opacity-90 transition-all duration-300 ease-in-out'
          >
            <span className='font-[500] text-xs  leading-[24px] tracking-[0.4px] text-white'>
              Yes Continue
            </span>
          </button> */}
        </div>
      </div>
    </TabsContent>
  );
};

export default SuccessfulPayment;
