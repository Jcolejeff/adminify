import React from 'react';
import Notification from 'assets/svg/profile/icon.svg';
import logo from 'assets/svg/logo.svg';
import img1 from 'assets/svg/profile/noti1.svg';
import img2 from 'assets/svg/profile/noti2.svg';
import img3 from 'assets/svg/profile/noti3.svg';
import comingSoon from 'assets/svg/profile/coming.svg';

const ProfilePage = () => {
  function firstCharsOfWords(str: string) {
    const words = str.split(' ');

    if (words.length === 1 && words[0].length > 1) {
      const word = words[0];
      return word[0] + word[word.length - 1];
    }

    return words.map((word) => word[0]).join('');
  }
  return (
    <main className='w-full overflow-hidden h-full '>
      <section className='w-full grid border-b '>
        <div className='pt-6 pb-4 container px-container-base lg:px-container-lg xl:px-container-xl  relative max-w-[1700px]'>
          <a href='/'>
            <img src={logo} alt='' className='-m-4' />
          </a>
        </div>
      </section>

      <section className='w-full container px-container-base pb-[8rem] pt-6 lg:px-container-lg xl:px-container-xl  relative max-w-[1700px]  h-full 2xl:max-h-[900px]  '>
        <div className='grid grid-cols-[2.3fr_1fr] gap-8   h-full'>
          {/*  */}
          <div className='w-full border flex flex-col gap-8 rounded-lg px-[8rem] py-[4rem]'>
            <aside className='flex gap-4 items-center '>
              <div
                style={{ outline: '#f1aaa7 solid 1px' }}
                className='bg-red-100/60  outline-offset-[3px] rounded-[50%]  p-4 flex items-center justify-center'
              >
                <p className='text-2xl font-bold uppercase text-primary-1'>
                  {firstCharsOfWords('spaceX')}
                </p>
              </div>
              <h1 className='font-bold text-[1.7rem]'>COMPANY NAME</h1>
            </aside>
            <aside className='flex flex-col gap-4'>
              <div>
                <p className='text-lg text text-gray-400'>Ceo</p>
                <h4 className='text-xl'>Ceo Name</h4>
              </div>
              <div>
                <p className='text-lg text text-gray-400'>Ceo</p>
                <h4 className='text-xl'>Ceo Name</h4>
              </div>
            </aside>
          </div>

          {/*  */}
          <div className='w-full flex flex-col justify-center py-[4rem]  px-6 bg-primary-3 rounded-lg'>
            <div className='bg-red-100/60 px-3 mb-12 py-1 rounded-full w-fit'>
              <img src={comingSoon} alt='' />
            </div>
            <div className='p-6 flex flex-col gap-4 mb-6 bg-white'>
              <img src={img1} alt='' />
              <img src={img2} alt='' />
              <img src={img3} alt='' />
            </div>
            <div className='flex flex-col items-center gap-4'>
              <img src={Notification} alt='' />

              <p className='text-lg text-center lg:max-w-[80%] text-gray-500'>
                Receive notifcations about your rider performance, efficiency reviews and a lot more
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProfilePage;
