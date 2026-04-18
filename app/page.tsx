import Link from 'next/link';
import { ArrowRight, Bot, Briefcase, Clock3, Layers3, ShieldAlert, Sparkles, Target, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-5 lg:grid-cols-[1.25fr_0.95fr]">
        <Card className="relative overflow-hidden space-y-6 p-6 md:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.15),transparent_30%),radial-gradient(circle_at_20%_20%,rgba(45,212,191,0.12),transparent_25%)]" />
          <div className="relative space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <p className="inline-flex w-fit items-center rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                SOFTEC 2026 Theme Prototype
              </p>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs text-zinc-300">
                <Sparkles className="h-3.5 w-3.5 text-cyan-300" /> Built for student opportunity discovery
              </span>
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              Pixel Pioneers turns inbox noise into ranked next steps.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-zinc-300 md:text-lg">
              Parse messy student inboxes, detect real opportunities, extract the fields that matter, and rank them by fit,
              urgency, and completeness. The result is a cleaner workflow, not just another AI summary.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/inbox">
                  Start Demo <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link href="/profile">Configure Profile</Link>
              </Button>
            </div>
          </div>

          <div className="relative grid gap-3 sm:grid-cols-3">
            {[
              ['Opportunity fit', 'Ranks by profile match and experience depth.', Target],
              ['Deadline urgency', 'Highlights items that need action fast.', Clock3],
              ['Spam filtering', 'Keeps fake or irrelevant content out of the way.', ShieldAlert],
            ].map(([title, description, Icon]) => (
              <div key={title as string} className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
                <Icon className="h-4 w-4 text-cyan-300" />
                <p className="mt-3 text-sm font-semibold text-zinc-100">{title as string}</p>
                <p className="mt-1 text-sm leading-6 text-zinc-400">{description as string}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-5 p-6 md:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Pipeline layers</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50">A two-pass flow that stays easy to trust.</h2>
          </div>
          <div className="space-y-3 text-sm text-zinc-300">
            <p className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/35 p-4"><Bot className="h-4 w-4 text-cyan-300" /> Analyzer extracts structured opportunities from inbox content.</p>
            <p className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/35 p-4"><Briefcase className="h-4 w-4 text-emerald-300" /> Ranker scores fit, urgency, and completeness with stable weights.</p>
            <p className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/35 p-4"><Layers3 className="h-4 w-4 text-indigo-300" /> Results remain consistent, explainable, and judge-friendly.</p>
            <p className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/35 p-4"><Zap className="h-4 w-4 text-amber-300" /> Relative deadlines are normalized into strict dates where possible.</p>
          </div>
          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-sm text-cyan-100/80">
            Best for demo flows where the user needs a fast visual story: profile, inbox, ranking, then action.
          </div>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="space-y-3 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">1. Profile Intelligence</p>
          <h3 className="text-base font-semibold text-zinc-50">Structured onboarding</h3>
          <p className="text-sm leading-6 text-zinc-300">Profile fields, financial need, and experience depth feed the ranking engine.</p>
        </Card>
        <Card className="space-y-3 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">2. Inbox Parsing</p>
          <h3 className="text-base font-semibold text-zinc-50">Batch extraction</h3>
          <p className="text-sm leading-6 text-zinc-300">Emails and screenshots are classified into opportunity and non-opportunity buckets.</p>
        </Card>
        <Card className="space-y-3 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">3. Personalized Ranking</p>
          <h3 className="text-base font-semibold text-zinc-50">Stable output</h3>
          <p className="text-sm leading-6 text-zinc-300">Weighted scoring and explanation blocks make the final list easier to trust.</p>
        </Card>
      </section>
    </div>
  );
}
