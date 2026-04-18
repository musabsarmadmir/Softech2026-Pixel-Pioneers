import * as React from 'react';
import { cn } from '@/lib/utils';

export function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn('relative h-2 w-full overflow-hidden rounded-full bg-zinc-800', className)}>
      <div className="h-full bg-cyan-400 transition-all" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}
