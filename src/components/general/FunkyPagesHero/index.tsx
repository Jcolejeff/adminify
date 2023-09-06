import img from 'assets/logo-full.png';

const FunkyPagesHero = () => {
  return (
    <div className='w-full min-h-[6rem] md:min-h-[10rem] h-full rounded-[16px] flex flex-col justify-center items-center relative overflow-hidden'>
      {/* <div className={`absolute w-full h-full bg-primary- ${customBgClass ? customBgClass : ``}`}>
        <Icon name='funkyPagesHero' />
      </div> */}
      <div className=' flex justify-center items-center  flex-col w-full h-full px-2'>
        <img src={img} alt='' className='w-[11rem] md:w-[14rem] lg:w-[16rem]' />

        {/* <p className=' text-primary-10 font-[300] text-[14px] leading-[21px] text-center'>
          {description}
        </p> */}
      </div>
    </div>
  );
};

export default FunkyPagesHero;
