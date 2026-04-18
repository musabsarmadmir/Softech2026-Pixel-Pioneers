import { format } from 'date-fns';
import { CalendarClock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { RankedOpportunity } from '@/types/opportunity';

export function DeadlineTimeline({ ranked }: { ranked: RankedOpportunity[] }) {
  const withDate = ranked
    .filter((item) => item.strictDateISO)
    .sort((a, b) => (a.strictDateISO ?? '').localeCompare(b.strictDateISO ?? ''));

  return (
    <Card>
      <h3 className="mb-3 text-sm font-semibold text-zinc-100">Deadline Timeline</h3>
      <div className="space-y-3">
        {withDate.slice(0, 8).map((item) => (
          <div key={item.id} className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
            <CalendarClock className="mt-0.5 h-4 w-4 text-cyan-300" />
            <div>
              <p className="text-sm font-medium text-zinc-100">{item.title}</p>
              <p className="text-xs text-zinc-400">
                {item.strictDateISO ? format(new Date(item.strictDateISO), 'dd MMM yyyy') : 'No strict date'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
