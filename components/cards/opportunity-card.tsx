'use client';

import { CalendarClock, CheckCircle2, Link2, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { urgencyColor, scoreColor } from '@/utils/scoringEngine';
import type { RankedOpportunity } from '@/types/opportunity';
import { ScorePieChart } from '@/components/cards/score-pie-chart';

export function OpportunityCard({ item }: { item: RankedOpportunity }) {

  return (
    <Card className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={`border ${urgencyColor(item.urgencyLevel)}`}>{item.urgencyBadge}</Badge>
            <Badge variant="secondary" className={scoreColor(item.score)}>
              Score {item.score}
            </Badge>
            {item.strictDateISO ? (
              <Badge variant="outline" className="border-zinc-700 text-zinc-300">
                <CalendarClock className="mr-1 h-3.5 w-3.5" /> Deadline set
              </Badge>
            ) : null}
          </div>
          <h3 className="mt-3 text-xl font-semibold tracking-tight text-zinc-50">{item.title}</h3>
          <p className="mt-1 text-sm text-zinc-400">{item.organization}</p>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-300">{item.summary}</p>
        </div>

        <div className="grid min-w-[180px] gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4 text-center sm:min-w-[210px]">
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-400">Profile fit</p>
            <p className="mt-1 text-3xl font-semibold text-emerald-300">{item.weightedBreakdown.profileFit}%</p>
          </div>
          <div className="grid gap-2">
            <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
              {item.weightedBreakdown.urgency}% urgency
            </div>
            <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">
              {item.weightedBreakdown.completeness}% completeness
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-950/35 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
            <Target className="h-4 w-4 text-cyan-300" /> Match breakdown
          </div>
          <div>
            <p className="mb-1 text-xs text-zinc-400">Profile Fit</p>
            <Progress value={item.weightedBreakdown.profileFit} />
          </div>
          <div>
            <p className="mb-1 text-xs text-zinc-400">Urgency</p>
            <Progress value={item.weightedBreakdown.urgency} />
          </div>
          <div>
            <p className="mb-1 text-xs text-zinc-400">Completeness</p>
            <Progress value={item.weightedBreakdown.completeness} />
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/35 p-4">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
            <CheckCircle2 className="h-4 w-4 text-emerald-300" /> Score composition
          </div>
          <ScorePieChart
            profileFit={item.weightedBreakdown.profileFit}
            urgency={item.weightedBreakdown.urgency}
            completeness={item.weightedBreakdown.completeness}
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/35 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Evidence-backed reasons</p>
          <ul className="space-y-2 text-sm leading-6 text-zinc-300">
            {item.evidence.map((evidence) => (
              <li key={evidence} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-cyan-300" />
                <span>{evidence}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/35 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Action checklist</p>
          <ul className="space-y-2 text-sm leading-6 text-zinc-300">
            {item.actionChecklist.map((step) => (
              <li key={step} className="flex gap-2">
                <span className="mt-1.5 h-5 w-5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-center text-[10px] leading-5 text-emerald-200">✓</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-zinc-400">
        {item.contactInfo.slice(0, 2).map((contact) => (
          <span key={contact} className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/60 px-3 py-1 text-zinc-300">
            <Link2 className="h-3.5 w-3.5 text-cyan-300" /> {contact}
          </span>
        ))}
      </div>
    </Card>
  );
}
