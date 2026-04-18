import Link from 'next/link';
import { ArrowRight, Bot, Briefcase, Clock3, Layers3, ShieldAlert, Sparkles, Target, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Status Pill */}
      <div className="flex justify-center">
        <p className="inline-flex w-fit items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary">
          Made for FAST Softec AI Hackathon
        </p>
      </div>

      {/* Hero Section - Centered */}
      <section className="mx-auto max-w-4xl text-center space-y-8">
        <div className="space-y-6">
          <h1 className="text-5xl font-black leading-tight tracking-tight md:text-6xl lg:text-7xl">
            Pixel Pioneers turns inbox noise into ranked next steps.
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-foreground md:text-xl">
            Parse student inboxes, detect real opportunities, and turn them into a ranked action list.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/inbox">
                Start Demo <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link href="/profile">Configure Profile</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ['Opportunity fit', 'Ranks by profile match and experience depth.', Target],
            ['Deadline urgency', 'Highlights items that need action fast.', Clock3],
            ['Spam filtering', 'Keeps fake or irrelevant content out of the way.', ShieldAlert],
          ].map(([title, description, Icon]) => (
            <div key={title as string} className="rounded-xl border border-border bg-card p-6 shadow-lg shadow-black/5">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <p className="font-semibold text-card-foreground">{title as string}</p>
              <p className="mt-2 text-sm leading-relaxed text-card-foreground">{description as string}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pipeline Section */}
      <section className="mx-auto max-w-5xl">
        <Card className="space-y-6 p-8">
          <div className="text-center space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground">Pipeline layers</p>
            <h2 className="text-3xl font-bold tracking-tight text-card-foreground">A two-pass flow that stays easy to trust.</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-card-foreground">Analyzer extracts structured opportunities from inbox content.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-card-foreground">Ranker scores fit, urgency, and completeness with stable weights.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Layers3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-card-foreground">Results remain consistent, explainable, and judge-friendly.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-card-foreground">Relative deadlines are normalized into strict dates where possible.</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 text-sm text-primary/80">
            Best for demo flows where the user needs a fast visual story: profile, inbox, ranking, then action.
          </div>
        </Card>
      </section>

      {/* Process Steps */}
      <section className="grid gap-6 md:grid-cols-3">
        <Card className="space-y-4 p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground">1. Profile Intelligence</p>
          <h3 className="text-xl font-bold text-card-foreground">Structured onboarding</h3>
          <p className="text-sm leading-relaxed text-foreground">Profile fields, financial need, and experience depth feed the ranking engine.</p>
        </Card>
        <Card className="space-y-4 p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground">2. Inbox Parsing</p>
          <h3 className="text-xl font-bold text-card-foreground">Batch extraction</h3>
          <p className="text-sm leading-relaxed text-foreground">Emails and screenshots are classified into opportunity and non-opportunity buckets.</p>
        </Card>
        <Card className="space-y-4 p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground">3. Personalized Ranking</p>
          <h3 className="text-xl font-bold text-card-foreground">Stable output</h3>
          <p className="text-sm leading-relaxed text-foreground">Weighted scoring and explanation blocks make the final list easier to trust.</p>
        </Card>
      </section>
    </div>
  );
}
