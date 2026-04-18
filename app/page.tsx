import Link from 'next/link';
import { ArrowRight, Bot, Briefcase, Clock3, ShieldAlert } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <Card className="space-y-4 p-6">
          <p className="inline-flex w-fit items-center rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-200">
            SOFTEC 2026 Theme Prototype
          </p>
          <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
            Opportunity Inbox Copilot with dual-LLM intelligence and deterministic ranking.
          </h1>
          <p className="max-w-2xl text-zinc-300">
            Parse messy student inboxes, detect real opportunities, extract critical fields, rank by fit/urgency/completeness,
            and output practical action plans.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/inbox">
                Start Demo <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/profile">Configure Profile</Link>
            </Button>
          </div>
        </Card>

        <Card className="space-y-4 p-6">
          <h2 className="text-lg font-semibold">Pipeline Layers</h2>
          <div className="space-y-3 text-sm text-zinc-300">
            <p className="flex items-center gap-2"><Bot className="h-4 w-4 text-cyan-300" /> LLM1 Analyzer/Extractor</p>
            <p className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-emerald-300" /> LLM2 Ranker/Scorer</p>
            <p className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-amber-300" /> Relative + strict deadline support</p>
            <p className="flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-rose-300" /> Fake opportunities filtered as spam</p>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <h3 className="text-base font-semibold">1. Profile Intelligence</h3>
          <p className="mt-1 text-sm text-zinc-300">Structured form + PDF resume parsing with financial need and experience depth.</p>
        </Card>
        <Card>
          <h3 className="text-base font-semibold">2. Inbox Parsing</h3>
          <p className="mt-1 text-sm text-zinc-300">Batch emails and screenshots classified and extracted into machine-readable data.</p>
        </Card>
        <Card>
          <h3 className="text-base font-semibold">3. Personalized Ranking</h3>
          <p className="mt-1 text-sm text-zinc-300">Deterministic 40/30/30 weighted engine with judge-friendly explanations.</p>
        </Card>
      </section>
    </div>
  );
}
