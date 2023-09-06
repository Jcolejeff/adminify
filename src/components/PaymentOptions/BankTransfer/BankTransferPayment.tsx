import { TabsContent } from 'components/shadcn/ui/tabs';
import FunkyPagesHero from 'components/general/FunkyPagesHero';
import { Table, TableBody, TableCell, TableRow } from 'components/shadcn/ui/table';
import { formatToNaira } from 'helper';
import { useUserContext } from 'context';
import CheckPaymentStatus from 'components/CheckPaymentStatus';
import { useToast } from 'components/shadcn/ui/use-toast';
import Toast from 'react-hot-toast';
import ContentLoader from 'components/general/ContentLoader';
import img from 'assets/svg/not-found.svg';
import logo from 'assets/logo-full.png';
import bigSmile from 'assets/svg/bigSmile.svg';

import { useNavigate } from 'react-router-dom';
interface Iprop {
  // defined already
  paymentMethods: string[];
}

const BankTransferPayment = ({ paymentMethods }: Iprop) => {
  const navigate = useNavigate();
  const { transactionRef, paymentDetails, isError, isLoading } = useUserContext();

  let amount: string | undefined = '';

  if (paymentDetails?.chargesIsInclusive) {
    amount = paymentDetails?.amount || '0';
  } else {
    const serviceCharge = paymentDetails?.serviceCharge || '0';
    const businessCommission = paymentDetails?.businessCommission || '0';
    amount = (
      Number(serviceCharge) +
      Number(businessCommission) +
      Number(paymentDetails?.amount || '0')
    ).toString();
  }

  const tableData = [
    {
      name: 'Account Name:',
      value: paymentDetails?.walletBank?.accountName,
    },
    {
      name: 'Account Number:',
      value: paymentDetails?.walletBank?.accountNumber,
    },
    {
      name: 'Bank Name: ',
      value: paymentDetails?.walletBank?.bankName,
    },

    {
      name: 'Total Amount:',
      value: formatToNaira(Number(amount) || 0),
    },
  ];

  if (isError) {
    return (
      <TabsContent value={paymentMethods[0]} className=''>
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
      <TabsContent value={paymentMethods[0]} className='h-full'>
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
      <TabsContent value={paymentMethods[0]} className=''>
        <div className=''>
          <img src={logo} alt='' className='w-[11rem] my-8  mx-auto md:w-[14rem] lg:w-[16rem]' />

          <ContentLoader isLoading={isLoading}>
            <div className='flex flex-col justify-center items-center rounded-lg px-4 md:px-8'>
              <h2 className='text-sm mb-4 text-black font-semibold'>ACCOUNT DETAILS</h2>

              <Table>
                <TableBody>
                  {tableData.map((account) => (
                    <TableRow key={account.name} className='border-no'>
                      <TableCell className='p-0 py-3 md:py-4 px-2 '>{account.name}</TableCell>
                      <TableCell className='text-end p-0'>
                        {account.value}
                        {account.name === 'Account Number:' && (
                          <button
                            className='text-primary-1 ml-2 font-bold text-xs border px-2  rounded-full'
                            onClick={() =>
                              navigator.clipboard
                                .writeText(account?.value || ' ')
                                .then(() => {
                                  Toast.success('Account number copied', {
                                    duration: 5000,
                                  });
                                })
                                .catch(() => {
                                  Toast.error('Error , please try again', {
                                    duration: 5000,
                                  });
                                })
                            }
                          >
                            copy
                          </button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <p className=' mt-4  text-muted-foreground text-xs text-center justify-self-center md:text-sm md:max-w-[70%]'>
                *Please make a transfer to the account details above.
              </p>
              <CheckPaymentStatus />
            </div>
          </ContentLoader>
        </div>
      </TabsContent>
    </>
  );
};

export default BankTransferPayment;
