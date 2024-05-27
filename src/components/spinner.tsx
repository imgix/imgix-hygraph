import { cn } from '@/util';

export const Spinner = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        'h-4 w-4 animate-spin rounded-full border-2 border-current border-b-transparent border-l-transparent duration-500',
        className
      )}
    />
  );
};
