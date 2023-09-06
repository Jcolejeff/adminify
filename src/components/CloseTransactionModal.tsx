import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from 'components/shadcn/ui/alert-dialog';
import { Button } from 'components/shadcn/ui/button';
import { useUserContext } from 'context';
import { tr } from 'date-fns/locale';

export default function CloseTransactionModal() {
  const { paymentDetails, transactionRef } = useUserContext();
  const redirectUrl = new URL(
    paymentDetails?.business?.redirectUrl ||
      paymentDetails?.redirectUrl ||
      'https://www.google.com',
  );

  if (transactionRef) {
    redirectUrl.searchParams.set('transactionRef', transactionRef);
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant='outline'
          className='text-xl  top-[-3%] right-[-12%] xxs:right-[-3%] focus:border-none active:border-none rounded-full p-4 w-[3.1rem] font-light h-[3.15rem] shadow-md absolute bg-white'
        >
          x
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className='bg-white'>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure you want Cancel? </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.You would lose all progress and be redirected back
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='md:px-8'>No</AlertDialogCancel>
          <AlertDialogAction
            className='bg-primary-1'
            onClick={() => {
              setTimeout(() => {
                window.location.href = redirectUrl.href;
              }, 500);
            }}
          >
            Yes Cancel
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
