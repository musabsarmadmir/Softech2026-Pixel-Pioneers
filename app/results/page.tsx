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
        <Card className="space-y-6 p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">Ranked Opportunities</p>
              <h1 className="text-4xl font-bold tracking-tight text-foreground">Priority list with clear next actions.</h1>
              <p className="max-w-2xl text-foreground leading-relaxed">
                Sorted by deterministic score: 40% fit, 30% urgency, 30% completeness.
              </p>
            </div>
            <Button type="button" variant="outline" onClick={saveCurrentAnalysis}>
              <Save className="mr-2 h-4 w-4" /> Save Analysis
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground">Total ranked</p>
              <p className="mt-2 text-3xl font-bold text-foreground">{ranked.length}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground">Strict deadlines</p>
              <p className="mt-2 text-3xl font-bold text-foreground">{deadlineCount}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground">Highest score</p>
              <p className="mt-2 text-3xl font-bold text-primary">{topScore}</p>
            </div>
          </div>
        </Card>

        <Card className="space-y-5 p-6 md:p-7">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1.5">
              <h2 className="text-lg font-bold tracking-tight text-card-foreground">Ranking pulse</h2>
              <p className="max-w-sm text-sm leading-6 text-muted-foreground">A quick read on urgency before you open individual cards.</p>
            </div>
            <span className="rounded-full border border-blue-300 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-400/40 dark:bg-blue-500/10 dark:text-blue-200">
              {urgentCount} urgent
            </span>
          </div>
          <div className="rounded-2xl border border-border bg-muted/70 p-4 text-sm text-foreground">
            Open the top items first, then use the checklist and draft actions to move from ranking to execution.
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-blue-300 bg-blue-50/80 p-4 dark:border-blue-400/30 dark:bg-blue-500/10">
              <p className="text-xs uppercase tracking-wide text-blue-700 dark:text-blue-200">Best-fit focus</p>
              <p className="mt-1 text-sm text-blue-900/80 dark:text-blue-100">Strongest match between profile, skills, and opportunity type.</p>
            </div>
            <div className="rounded-2xl border border-border bg-secondary/85 p-4 dark:bg-secondary/60">
              <p className="text-xs uppercase tracking-wide text-card-foreground">Deadline pressure</p>
              <p className="mt-1 text-sm text-foreground">Items with shorter deadlines rise automatically to the top.</p>
            </div>
          </div>
        </Card>
      </section>

      <Card className="space-y-2 p-6" ref={exportRef}>
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground">Digest Snapshot</h3>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {ranked.slice(0, 6).map((item, index) => (
            <div key={item.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <p className="text-xs text-foreground">Rank #{index + 1}</p>
              <p className="mt-1 text-sm font-semibold text-card-foreground">{item.title}</p>
              <p className="mt-2 text-xs text-foreground">Score {item.score}</p>
              <p className="mt-1 text-xs text-foreground">{item.organization}</p>
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
