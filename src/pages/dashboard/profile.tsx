import React from 'react';
import LoginForm from 'components/general/loginForm';
import logo from 'assets/svg/logo.svg';
import earn from 'assets/svg/login/earn.svg';
import staff from 'assets/svg/login/staff.svg';
import business from 'assets/svg/login/business.svg';
import tick from 'assets/svg/login/tick-circle.png';

const LoginPage = () => {
  return (
    <main className='w-full overflow-hidden h-full '>
      <section className='w-full grid border-b '>
        <div className='pt-6 pb-4 container px-container-base lg:px-container-lg xl:px-container-xl  relative max-w-[1700px]'>
          <img src={logo} alt='' className='-m-4' />
        </div>
      </section>

      <section className='w-full container px-container-base pb-[8rem] pt-6 lg:px-container-lg xl:px-container-xl  relative max-w-[1700px]  h-full '>
        <div className='grid grid-cols-[2.3fr_1fr] gap-8   h-full'>
          <div className='w-full border rounded-lg'>
            <h1 className='font-bold text-[2rem]'>Hi there, see what’s new</h1>
          </div>
          <div className='w-full bg-primary-3 rounded-lg'>
            <h1 className='font-bold text-[2rem] '>Hi there, see what’s new</h1>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
