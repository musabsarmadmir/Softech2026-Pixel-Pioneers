'use client';

import { useState } from 'react';
import { FileText, Mail, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { urgencyColor, scoreColor } from '@/utils/scoringEngine';
import type { RankedOpportunity } from '@/types/opportunity';
import { generateDraftEmailOrSop } from '@/services/llmOrchestrator';
import { useAppState } from '@/components/shared/app-state-provider';
import { ScorePieChart } from '@/components/cards/score-pie-chart';

export function OpportunityCard({ item }: { item: RankedOpportunity }) {
  const { profile } = useAppState();
  const [draft, setDraft] = useState<string>('');
  const [loading, setLoading] = useState(false);

  async function generateDraft(tone: 'formal' | 'concise') {
    setLoading(true);
    try {
      const result = await generateDraftEmailOrSop({
        studentProfile: profile as unknown as Record<string, unknown>,
        opportunity: item as unknown as Record<string, unknown>,
        tone,
      });

      if (result.ok) {
        setDraft(`${result.data.subject}\n\n${result.data.body}`);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-zinc-100">{item.title}</h3>
          <p className="text-sm text-zinc-400">{item.organization}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={`border ${urgencyColor(item.urgencyLevel)}`}>{item.urgencyBadge}</Badge>
          <Badge variant="secondary" className={scoreColor(item.score)}>
            Score {item.score}
          </Badge>
        </div>
      </div>

      <p className="text-sm text-zinc-300">{item.summary}</p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
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
        <ScorePieChart
          profileFit={item.weightedBreakdown.profileFit}
          urgency={item.weightedBreakdown.urgency}
          completeness={item.weightedBreakdown.completeness}
        />
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">Evidence-backed reasons</p>
        <ul className="space-y-1 text-sm text-zinc-300">
          {item.evidence.map((evidence) => (
            <li key={evidence}>- {evidence}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">Action checklist</p>
        <ul className="space-y-1 text-sm text-zinc-300">
          {item.actionChecklist.map((step) => (
            <li key={step}>- {step}</li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" onClick={() => generateDraft('formal')} disabled={loading}>
          <Mail className="mr-1 h-4 w-4" /> Draft Email (Formal)
        </Button>
        <Button type="button" size="sm" variant="secondary" onClick={() => generateDraft('concise')} disabled={loading}>
          <FileText className="mr-1 h-4 w-4" /> Draft SOP (Concise)
        </Button>
      </div>

      {draft ? (
        <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-3">
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-cyan-200">
            <Sparkles className="h-4 w-4" /> Generated Draft
          </p>
          <pre className="whitespace-pre-wrap text-sm text-cyan-100">{draft}</pre>
        </div>
      ) : null}
    </Card>
  );
}
