'use client';

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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
    <Card className="space-y-4">
      <div>
        <CardTitle>Structured Student Profile</CardTitle>
        <CardDescription>
          Form-based profile for deterministic matching. Use commas for lists and tech years as React:1.5.
        </CardDescription>
      </div>

      <form className="grid gap-3 md:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
        <Input placeholder="Full name" {...form.register('fullName')} />
        <Input placeholder="Degree / Program" {...form.register('degreeProgram')} />
        <Input type="number" step="1" placeholder="Semester" {...form.register('semester')} />
        <Input type="number" step="0.01" placeholder="CGPA" {...form.register('cgpa')} />
        <Input className="md:col-span-2" placeholder="Skills (comma separated)" {...form.register('skills')} />
        <Input className="md:col-span-2" placeholder="Interests (comma separated)" {...form.register('interests')} />
        <Input
          className="md:col-span-2"
          placeholder="Preferred types (internship, scholarship, competition, job, research, exchange)"
          {...form.register('preferredOpportunityTypes')}
        />
        <select
          className="h-10 rounded-xl border border-border bg-zinc-900/60 px-3 text-sm text-zinc-100"
          {...form.register('financialNeed')}
        >
          <option value="necessary">Necessary</option>
          <option value="important">Important</option>
          <option value="not-needed">Not needed</option>
        </select>
        <Input placeholder="Location preference" {...form.register('locationPreference')} />
        <Input
          type="number"
          step="0.1"
          placeholder="Overall experience years"
          {...form.register('overallExperienceYears')}
        />
        <Input
          className="md:col-span-2"
          placeholder="Technology experience (React:1.8, Python:2.0, Node.js:1.2)"
          {...form.register('technologyExperience')}
        />
        <div className="md:col-span-2">
          <Button type="submit">Save Profile</Button>
        </div>
      </form>
    </Card>
  );
}
