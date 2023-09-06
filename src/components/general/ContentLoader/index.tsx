import { Skeleton } from 'components/shadcn/skeleton';
import { cn } from 'helper/utils';

interface IContentLoader {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
  blocksClassName?: string;
  numberOfBlocks?: number;
}

const ContentLoader = ({
  isLoading,
  blocksClassName,
  className,
  children,
  numberOfBlocks = 1,
}: IContentLoader) => {
  return isLoading ? (
    <div
      className={cn(
        'w-10/12  flex justify-center  mx-auto   gap-x-[1.5rem] gap-y-[3.875rem]',
        className,
      )}
    >
      {[...Array(numberOfBlocks)]?.map((_, idx) => (
        <div key={idx} className={cn('w-full flex flex-col items-center gap-4', blocksClassName)}>
          <Skeleton className='w-[100%] h-[2rem]' />
          <Skeleton className='w-full h-[2rem]' />
          <Skeleton className='w-full h-[5rem]' />
          <Skeleton className='w-full h-[2rem]' />
          <Skeleton className='w-full h-[2rem]' />
        </div>
      ))}
    </div>
  ) : (
    <>{children}</>
  );
};

export default ContentLoader;
