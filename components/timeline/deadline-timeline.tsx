import { format } from 'date-fns';
import { CalendarClock, Clock3, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { RankedOpportunity } from '@/types/opportunity';

export function DeadlineTimeline({ ranked }: { ranked: RankedOpportunity[] }) {
  const withDate = ranked
    .filter((item) => item.strictDateISO)
    .sort((a, b) => (a.strictDateISO ?? '').localeCompare(b.strictDateISO ?? ''));

  function urgencyTone(item: RankedOpportunity) {
    if (item.urgencyLevel === 'expired') return 'border-zinc-300 bg-zinc-50 text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-300';
    if (item.urgencyLevel === 'high') return 'border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-500/40 dark:bg-rose-500/12 dark:text-rose-200';
    if (item.urgencyLevel === 'medium') return 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/12 dark:text-amber-200';
    if (item.urgencyLevel === 'low') return 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/12 dark:text-emerald-200';
    return 'border-sky-300 bg-sky-50 text-sky-800 dark:border-sky-500/40 dark:bg-sky-500/12 dark:text-sky-200';
  }

  return (
    <Card className="space-y-4 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <Clock3 className="h-4 w-4 text-cyan-600 dark:text-cyan-300" /> Deadline Timeline
          </p>
          <h3 className="mt-2 text-base font-semibold text-card-foreground">Fastest-approaching items first</h3>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300 bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-700 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-200">
          <Sparkles className="h-3.5 w-3.5" /> Sorted by strict date
        </span>
      </div>

      <div className="space-y-3">
        {withDate.slice(0, 8).map((item) => (
          <div key={item.id} className={`flex items-start gap-3 rounded-2xl border p-4 ${urgencyTone(item)}`}>
            <CalendarClock className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="truncate text-sm font-semibold text-current">{item.title}</p>
                <span className="rounded-full border border-current/20 bg-white/60 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide dark:bg-black/20">
                  {item.urgencyBadge}
                </span>
              </div>
              <p className="mt-1 text-xs text-current/80">{item.organization}</p>
              <p className="mt-2 text-xs text-current/90">
                {item.strictDateISO ? format(new Date(item.strictDateISO), 'dd MMM yyyy') : 'No strict date'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
