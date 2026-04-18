import { format } from 'date-fns';
import { CalendarClock, Clock3, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { RankedOpportunity } from '@/types/opportunity';

export function DeadlineTimeline({ ranked }: { ranked: RankedOpportunity[] }) {
  const withDate = ranked
    .filter((item) => item.strictDateISO)
    .sort((a, b) => (a.strictDateISO ?? '').localeCompare(b.strictDateISO ?? ''));

  function urgencyTone(item: RankedOpportunity) {
    if (item.urgencyLevel === 'expired') return 'border-zinc-700 bg-zinc-900/60 text-zinc-300';
    if (item.urgencyLevel === 'high') return 'border-rose-500/30 bg-rose-500/10 text-rose-200';
    if (item.urgencyLevel === 'medium') return 'border-amber-500/30 bg-amber-500/10 text-amber-200';
    if (item.urgencyLevel === 'low') return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200';
    return 'border-sky-500/30 bg-sky-500/10 text-sky-200';
  }

  return (
    <Card className="space-y-4 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-zinc-400">
            <Clock3 className="h-4 w-4 text-cyan-300" /> Deadline Timeline
          </p>
          <h3 className="mt-2 text-base font-semibold text-zinc-100">Fastest-approaching items first</h3>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-200">
          <Sparkles className="h-3.5 w-3.5" /> Sorted by strict date
        </span>
      </div>

      <div className="space-y-3">
        {withDate.slice(0, 8).map((item) => (
          <div key={item.id} className={`flex items-start gap-3 rounded-2xl border p-4 ${urgencyTone(item)}`}>
            <CalendarClock className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="truncate text-sm font-medium text-zinc-100">{item.title}</p>
                <span className="rounded-full border border-white/10 bg-black/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide">
                  {item.urgencyBadge}
                </span>
              </div>
              <p className="mt-1 text-xs text-zinc-400">{item.organization}</p>
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
