'use client';

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppState } from '@/components/shared/app-state-provider';
import type { FinancialNeedLevel, OpportunityType, StudentProfile } from '@/types/opportunity';

const schema = z.object({
  fullName: z.string().min(2),
  degreeProgram: z.string().min(2),
  semester: z.coerce.number().min(1).max(12),
  cgpa: z.coerce.number().min(0).max(4),
  skills: z.string().min(1),
  interests: z.string().min(1),
  preferredOpportunityTypes: z.string().min(1),
  financialNeed: z.enum(['necessary', 'important', 'not-needed']),
  locationPreference: z.string().min(2),
  overallExperienceYears: z.coerce.number().min(0).max(20),
  technologyExperience: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

const opportunityOptions: OpportunityType[] = ['internship', 'scholarship', 'competition', 'job', 'research', 'exchange'];

function FieldLabel({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-wider text-foreground">{title}</p>
      {hint ? <p className="text-xs leading-relaxed text-foreground">{hint}</p> : null}
    </div>
  );
}

export function ProfileForm() {
  const { profile, setProfile } = useAppState();

  const defaults = useMemo<FormValues>(
    () => ({
      fullName: profile.fullName,
      degreeProgram: profile.degreeProgram,
      semester: profile.semester,
      cgpa: profile.cgpa,
      skills: profile.skills.join(', '),
      interests: profile.interests.join(', '),
      preferredOpportunityTypes: profile.preferredOpportunityTypes.join(', '),
      financialNeed: profile.financialNeed,
      locationPreference: profile.locationPreference,
      overallExperienceYears: profile.overallExperienceYears,
      technologyExperience: profile.technologyExperience
        .map((item) => `${item.technology}:${item.years}`)
        .join(', '),
    }),
    [profile],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  });

  useEffect(() => {
    form.reset(defaults);
  }, [defaults, form]);

  function onSubmit(values: FormValues) {
    const payload: StudentProfile = {
      fullName: values.fullName,
      degreeProgram: values.degreeProgram,
      semester: values.semester,
      cgpa: values.cgpa,
      skills: values.skills.split(',').map((item) => item.trim()).filter(Boolean),
      interests: values.interests.split(',').map((item) => item.trim()).filter(Boolean),
      preferredOpportunityTypes: values.preferredOpportunityTypes
        .split(',')
        .map((item) => item.trim().toLowerCase() as OpportunityType)
        .filter(Boolean),
      financialNeed: values.financialNeed as FinancialNeedLevel,
      locationPreference: values.locationPreference,
      overallExperienceYears: values.overallExperienceYears,
      technologyExperience: values.technologyExperience
        .split(',')
        .map((entry) => {
          const [technology, years] = entry.split(':').map((segment) => segment.trim());
          return {
            technology,
            years: Number(years || 0),
          };
        })
        .filter((item) => item.technology),
    };

    setProfile(payload);
  }

  return (
    <Card className="space-y-5 p-6 md:p-7">
      <div className="space-y-2">
        <CardTitle className="text-xl">Structured Student Profile</CardTitle>
        <CardDescription>
          Build a profile the ranker can actually use. Commas work for lists, and tech experience should use the
          format React:1.5.
        </CardDescription>
      </div>

      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <FieldLabel title="Identity" hint="Keep the degree name precise so matching stays accurate." />
            <Input placeholder="Full name" {...form.register('fullName')} />
          </div>
          <div className="space-y-2">
            <FieldLabel title="Program" hint="Include the department or major if it matters for matching." />
            <Input placeholder="Degree / Program" {...form.register('degreeProgram')} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <FieldLabel title="Semester" hint="Used to filter student-only programs and eligibility." />
            <Input type="number" step="1" placeholder="Semester" {...form.register('semester')} />
          </div>
          <div className="space-y-2">
            <FieldLabel title="CGPA" hint="Supports merit-based and scholarship-oriented filtering." />
            <Input type="number" step="0.01" placeholder="CGPA" {...form.register('cgpa')} />
          </div>
          <div className="space-y-2">
            <FieldLabel title="Financial need" hint="Lets the ranker prioritize need-based opportunities." />
            <select
              className="h-10 rounded-xl border border-border bg-zinc-900/60 px-3 text-sm text-zinc-100 outline-none transition focus:border-cyan-400/60"
              {...form.register('financialNeed')}
            >
              <option value="necessary">Necessary</option>
              <option value="important">Important</option>
              <option value="not-needed">Not needed</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_0.95fr]">
          <div className="space-y-4 rounded-2xl border border-zinc-700 bg-zinc-900/50 p-4">
            <div className="space-y-2">
              <FieldLabel title="Skills" hint="Add relevant tools, technologies, and strengths separated by commas." />
              <Input placeholder="Skills (comma separated)" {...form.register('skills')} />
            </div>
            <div className="space-y-2">
              <FieldLabel title="Interests" hint="These help signal direction when multiple opportunities fit equally well." />
              <Input placeholder="Interests (comma separated)" {...form.register('interests')} />
            </div>
            <div className="space-y-2">
              <FieldLabel title="Preferred opportunity types" hint="Only include the categories you want surfaced most often." />
              <Input
                placeholder="Preferred types (internship, scholarship, competition, job, research, exchange)"
                {...form.register('preferredOpportunityTypes')}
              />
            </div>
            <div className="space-y-2">
              <FieldLabel title="Location preference" hint="Useful for remote, hybrid, city-specific, or international matching." />
              <Input placeholder="Location preference" {...form.register('locationPreference')} />
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-zinc-700 bg-zinc-900/50 p-4">
            <div className="space-y-2">
              <FieldLabel title="Experience" hint="Use total years across internships, projects, freelance, or work." />
              <Input
                type="number"
                step="0.1"
                placeholder="Overall experience years"
                {...form.register('overallExperienceYears')}
              />
            </div>
            <div className="space-y-2">
              <FieldLabel title="Technology experience" hint="Example: React:1.8, Python:2.0, Node.js:1.2" />
              <Input
                placeholder="Technology experience (React:1.8, Python:2.0, Node.js:1.2)"
                {...form.register('technologyExperience')}
              />
            </div>

            <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">Preferred types supported</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {opportunityOptions.map((type) => (
                  <Badge key={type} variant="outline" className="border-zinc-600 text-foreground">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-700 bg-zinc-900/50 p-4">
          <div>
            <p className="text-sm font-medium text-zinc-50">Ready when your profile is complete.</p>
            <p className="mt-1 text-xs text-zinc-100">The profile is saved locally and reused across inbox analysis and ranking.</p>
          </div>
          <Button type="submit">Save Profile</Button>
        </div>
      </form>
    </Card>
  );
}
