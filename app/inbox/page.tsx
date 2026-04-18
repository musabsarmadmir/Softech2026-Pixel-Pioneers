'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BrainCircuit } from 'lucide-react';
import { InboxBatchInput } from '@/components/forms/inbox-batch-input';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppState } from '@/components/shared/app-state-provider';
import { generateReasonedRanking } from '@/services/llmOrchestrator';

export default function InboxPage() {
  const router = useRouter();
  const { profile, extractedItems, runDeterministicRanking, setExtractedItems } = useAppState();
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState('Analyze inbox, then trigger ranking pipeline.');

  const opportunities = extractedItems.filter((item) => item.isOpportunity);
  const spamItems = extractedItems.filter((item) => !item.isOpportunity);

  async function runRanking() {
    setRunning(true);
    setStatus('Running ranker and deterministic scoring...');

    try {
      const llmRank = await generateReasonedRanking({
        studentProfile: profile as unknown as Record<string, unknown>,
        extractedOpportunities: extractedItems as unknown as Record<string, unknown>[],
      });

      if (llmRank.ok && Array.isArray(llmRank.data.ranked)) {
        const lookup = new Map(llmRank.data.ranked.map((item) => [String(item.id), item]));
        setExtractedItems(
          extractedItems.map((entry) => {
            const found = lookup.get(entry.id) as
              | { evidence?: string[]; actionChecklist?: string[] }
              | undefined;
            return {
              ...entry,
              // These fields are mapped later by deterministic engine component.
              summary: entry.summary,
              // Store additional hints in summary if needed without exposing model trace.
              ...(found?.evidence ? { eligibility: [...entry.eligibility, ...found.evidence.slice(0, 1)] } : {}),
            };
          }),
        );
      }

      runDeterministicRanking();
      setStatus('Ranking complete. Redirecting to results.');
      router.push('/results');
    } catch {
      runDeterministicRanking();
      setStatus('Ranker fallback used. Deterministic ranking completed.');
      router.push('/results');
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Inbox Processing</h1>
        <p className="text-sm text-zinc-300">Paste emails, add screenshots, classify opportunities, then rank by priority.</p>
      </div>
      <InboxBatchInput />
      <Card className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-300">Inbox Classification Snapshot</h3>
        <p className="text-sm text-zinc-300">
          Opportunities: <span className="font-semibold text-emerald-300">{opportunities.length}</span> | Spam/Non-opportunity:{' '}
          <span className="font-semibold text-rose-300">{spamItems.length}</span>
        </p>
        {spamItems.length > 0 ? (
          <div className="grid gap-2 md:grid-cols-2">
            {spamItems.slice(0, 6).map((item) => (
              <div key={item.id} className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-3">
                <p className="text-sm font-medium text-rose-200">{item.sourceEmailSubject}</p>
                <p className="text-xs text-rose-100/80">{item.spamReason ?? 'Detected as non-opportunity content.'}</p>
              </div>
            ))}
          </div>
        ) : null}
      </Card>
      <Card className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-200">{status}</p>
          <p className="text-xs text-zinc-400">Model trace is intentionally hidden in user-facing mode.</p>
        </div>
        <Button type="button" onClick={runRanking} disabled={running}>
          <BrainCircuit className="mr-1 h-4 w-4" /> {running ? 'Processing...' : 'Run Ranker + Deterministic Engine'}
        </Button>
      </Card>
    </div>
  );
}
