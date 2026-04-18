'use client';

import { Download, Save } from 'lucide-react';
import { toPng } from 'html-to-image';
import { useRef } from 'react';
import { OpportunityCard } from '@/components/cards/opportunity-card';
import { DeadlineTimeline } from '@/components/timeline/deadline-timeline';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAppState } from '@/components/shared/app-state-provider';

export default function ResultsPage() {
  const { ranked, saveCurrentAnalysis } = useAppState();
  const exportRef = useRef<HTMLDivElement>(null);

  async function exportDigestPng() {
    if (!exportRef.current) return;
    const dataUrl = await toPng(exportRef.current, {
      backgroundColor: '#020617',
      pixelRatio: 2,
    });
    const anchor = document.createElement('a');
    anchor.download = `oppucopilot-digest-${Date.now()}.png`;
    anchor.href = dataUrl;
    anchor.click();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Ranked Opportunities</h1>
          <p className="text-sm text-zinc-300">Sorted by deterministic score: 40% fit, 30% urgency, 30% completeness.</p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={saveCurrentAnalysis}>
            <Save className="mr-1 h-4 w-4" /> Save Analysis
          </Button>
          <Button type="button" onClick={exportDigestPng}>
            <Download className="mr-1 h-4 w-4" /> Export PNG Digest
          </Button>
        </div>
      </div>

      <Card className="space-y-2" ref={exportRef}>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-300">Digest Snapshot</h3>
        <div className="grid gap-2 md:grid-cols-2">
          {ranked.slice(0, 6).map((item, index) => (
            <div key={item.id} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
              <p className="text-xs text-zinc-400">Rank #{index + 1}</p>
              <p className="text-sm font-semibold text-zinc-100">{item.title}</p>
              <p className="text-xs text-zinc-300">Score {item.score}</p>
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
