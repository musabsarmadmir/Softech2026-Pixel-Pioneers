import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium', {
  variants: {
    variant: {
      default: 'border-transparent bg-primary/20 text-primary',
      secondary: 'border-border bg-secondary/70 text-zinc-200',
      outline: 'border-border text-zinc-200',
      destructive: 'border-red-500/50 bg-red-500/20 text-red-300',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export function Badge({ className, variant, ...props }: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
