'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, BrainCircuit, ShieldAlert, Sparkles, WandSparkles } from 'lucide-react';
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

  const progressStage = extractedItems.length === 0 ? 1 : 2;

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
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.25fr_0.85fr]">
        <Card className="space-y-5 p-6 md:p-7">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
              <Sparkles className="h-3.5 w-3.5" /> Inbox Workflow
            </span>
            <span className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs text-foreground">
              Step {progressStage} of 2
            </span>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Inbox Processing</h1>
            <p className="max-w-2xl text-sm leading-6 text-foreground md:text-base">
              Paste emails, attach screenshots, classify what matters, then move the strongest opportunities into a ranked action list.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-secondary/70 p-4">
              <p className="text-xs uppercase tracking-wide text-foreground">Opportunities</p>
              <p className="mt-1 text-2xl font-semibold text-card-foreground">{opportunities.length}</p>
            </div>
            <div className="rounded-2xl border border-border bg-secondary/70 p-4">
              <p className="text-xs uppercase tracking-wide text-foreground">Spam filtered</p>
              <p className="mt-1 text-2xl font-semibold text-rose-600">{spamItems.length}</p>
            </div>
            <div className="rounded-2xl border border-border bg-secondary/70 p-4">
              <p className="text-xs uppercase tracking-wide text-foreground">Pipeline</p>
              <p className="mt-1 text-sm font-medium text-card-foreground">Extract, score, rank</p>
            </div>
          </div>
        </Card>

        <Card className="space-y-4 p-6 md:p-7">
          <div className="flex items-center gap-2">
            <WandSparkles className="h-4 w-4 text-blue-300" />
            <h2 className="text-base font-semibold text-zinc-100">What happens next</h2>
          </div>
          <div className="space-y-3 text-sm text-card-foreground">
            <p className="flex items-start gap-3 rounded-xl border border-border bg-secondary/70 p-3">
              <span className="mt-0.5 rounded-full bg-blue-500/15 px-2 py-0.5 text-xs font-semibold text-blue-200">1</span>
              Extract structured opportunities from batched emails and screenshots.
            </p>
            <p className="flex items-start gap-3 rounded-xl border border-border bg-secondary/70 p-3">
              <span className="mt-0.5 rounded-full bg-blue-500/15 px-2 py-0.5 text-xs font-semibold text-blue-200">2</span>
              Push the clean results through the deterministic ranker.
            </p>
            <p className="flex items-start gap-3 rounded-xl border border-border bg-secondary/70 p-3">
              <span className="mt-0.5 rounded-full bg-blue-500/15 px-2 py-0.5 text-xs font-semibold text-blue-200">3</span>
              Review the final cards, deadlines, and task list.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-secondary/70 p-4 text-xs text-foreground">
            Model trace stays hidden in user-facing mode so the UI only shows the final ranking outcome.
          </div>
        </Card>
      </section>

      <InboxBatchInput />

      <section className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <Card className="space-y-4 p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground">Inbox Classification Snapshot</h3>
              <p className="mt-1 text-sm text-foreground">Spam stays visible, but it is visually secondary to the real opportunities.</p>
            </div>
            <ShieldAlert className="h-5 w-5 text-rose-300" />
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-foreground">
            <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-blue-200">{opportunities.length} opportunities</span>
            <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-rose-200">{spamItems.length} filtered items</span>
          </div>
          {spamItems.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {spamItems.slice(0, 6).map((item) => (
                <div key={item.id} className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
                  <p className="text-sm font-medium text-rose-800">{item.sourceEmailSubject}</p>
                  <p className="mt-1 text-xs leading-5 text-rose-700/90">{item.spamReason ?? 'Detected as non-opportunity content.'}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-secondary/70 p-4 text-sm text-foreground">
              No spam was detected in the current batch.
            </div>
          )}
        </Card>

        <Card className="space-y-4 p-6">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground">Ranking Control</h3>
            <p className="mt-1 text-sm text-foreground">Trigger the ranker after extraction to generate the final prioritized list.</p>
          </div>
          <div className="rounded-2xl border border-border bg-secondary/70 p-4">
            <p className="text-sm text-card-foreground">{status}</p>
            <p className="mt-1 text-xs text-foreground">The app uses the model output, then applies deterministic ranking for stable results.</p>
          </div>
          <Button type="button" onClick={runRanking} disabled={running} className="w-full">
            <BrainCircuit className="mr-1 h-4 w-4" />
            {running ? 'Processing...' : 'Run Ranker + Deterministic Engine'}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Card>
      </section>
    </div>
  );
}
