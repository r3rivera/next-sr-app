import { cn } from '@/app/lib/utils';
import ButtonProps from './buttonProps';

export function PrimaryBtn({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={cn(
        'flex h-10 items-center rounded-lg bg-yellow-500 px-4 text-sm font-medium text-white transition-colors hover:bg-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500 active:bg-yellow-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
        className,
      )}
    >
      {children}
    </button>
  );
}
