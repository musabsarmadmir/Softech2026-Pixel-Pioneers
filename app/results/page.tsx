'use client';

import { Save } from 'lucide-react';
import { useRef } from 'react';
import { OpportunityCard } from '@/components/cards/opportunity-card';
import { DeadlineTimeline } from '@/components/timeline/deadline-timeline';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAppState } from '@/components/shared/app-state-provider';

export default function ResultsPage() {
  const { ranked, saveCurrentAnalysis } = useAppState();
  const exportRef = useRef<HTMLDivElement>(null);

  const topScore = ranked[0]?.score ?? 0;
  const deadlineCount = ranked.filter((item) => item.strictDateISO).length;
  const urgentCount = ranked.filter((item) => item.urgencyLevel === 'high').length;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="space-y-5 p-6 md:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-blue-200/80">Ranked Opportunities</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Priority list with clear next actions.</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-300 md:text-base">
                Sorted by deterministic score: 40% fit, 30% urgency, 30% completeness.
              </p>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={saveCurrentAnalysis}>
                <Save className="mr-1 h-4 w-4" /> Save Analysis
              </Button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/35 p-4">
              <p className="text-xs uppercase tracking-wide text-zinc-400">Total ranked</p>
              <p className="mt-1 text-2xl font-semibold text-zinc-100">{ranked.length}</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/35 p-4">
              <p className="text-xs uppercase tracking-wide text-zinc-400">Strict deadlines</p>
              <p className="mt-1 text-2xl font-semibold text-zinc-100">{deadlineCount}</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/35 p-4">
              <p className="text-xs uppercase tracking-wide text-zinc-400">Highest score</p>
              <p className="mt-1 text-2xl font-semibold text-blue-200">{topScore}</p>
            </div>
          </div>
        </Card>

        <Card className="space-y-4 p-6 md:p-7">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-zinc-100">Ranking pulse</h2>
              <p className="mt-1 text-sm text-zinc-400">A quick read on urgency before you open individual cards.</p>
            </div>
            <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-200">
              {urgentCount} urgent
            </span>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/30 p-4 text-sm text-zinc-300">
            Open the top items first, then use the checklist and draft actions to move from ranking to execution.
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4">
              <p className="text-xs uppercase tracking-wide text-blue-200/80">Best-fit focus</p>
              <p className="mt-1 text-sm text-blue-50">Strongest match between profile, skills, and opportunity type.</p>
            </div>
            <div className="rounded-2xl border border-zinc-700/70 bg-zinc-900/35 p-4">
              <p className="text-xs uppercase tracking-wide text-zinc-300">Deadline pressure</p>
              <p className="mt-1 text-sm text-zinc-200">Items with shorter deadlines rise automatically to the top.</p>
            </div>
          </div>
        </Card>
      </section>

      <Card className="space-y-2 p-6" ref={exportRef}>
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-300">Digest Snapshot</h3>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {ranked.slice(0, 6).map((item, index) => (
            <div key={item.id} className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4">
              <p className="text-xs text-zinc-400">Rank #{index + 1}</p>
              <p className="mt-1 text-sm font-semibold text-zinc-100">{item.title}</p>
              <p className="mt-2 text-xs text-zinc-300">Score {item.score}</p>
              <p className="mt-1 text-xs text-zinc-500">{item.organization}</p>
            </div>
          ))}
        </div>
      </Card>

      <DeadlineTimeline ranked={ranked} />

      <div className="grid gap-4">
        {ranked.map((item) => (
          <OpportunityCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
