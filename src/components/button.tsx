import { cn } from '@/util';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Spinner } from '@/components/spinner';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded text-m ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-brand-500 text-white hover:bg-brand-700',
        secondary: 'text-neutral-500 hover:bg-neutral-100',
        ghost: 'text-brand-500 hover:bg-brand-100',
        ghostSecondary: 'text-neutral-500 hover:bg-neutral-100',
        dashed: 'text-brand-500 bg-neutral-50 hover:bg-brand-100 border border-dashed border-neutral-200'
      },
      size: {
        default: 'h-10 px-5 py-2',
        medium: 'h-32 px-3 py-2',
        small: 'h-24 px-2 py-1 text-xs',
        icon: 'h-32 w-32'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  loadingText?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, loading, loadingText, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? <Spinner className="mr-8" /> : null}
        {loading ? loadingText : children}
      </button>
    );
  }
);
Button.displayName = 'Button';
