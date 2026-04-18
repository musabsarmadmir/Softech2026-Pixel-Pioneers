import { addDays, differenceInCalendarDays, isValid, parseISO } from 'date-fns';
import type {
  OpportunityItem,
  RankedOpportunity,
  StudentProfile,
  TechExperience,
} from '@/types/opportunity';

export const SCORE_WEIGHTS = {
  profileFit: 0.4,
  urgency: 0.3,
  completeness: 0.3,
} as const;

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

function normalizeTokens(values: string[]): string[] {
  return values
    .map((value) => value.trim().toLowerCase())
    .filter((value) => value.length > 0);
}

function overlapRatio(needles: string[], haystack: string[]): number {
  const left = new Set(normalizeTokens(needles));
  const right = new Set(normalizeTokens(haystack));
  if (left.size === 0 || right.size === 0) return 0;

  let hits = 0;
  for (const token of left) {
    if (right.has(token)) hits += 1;
  }
  return hits / left.size;
}

function parseRelativeDeadline(deadlineText: string | null): string | null {
  if (!deadlineText) return null;
  const text = deadlineText.toLowerCase().trim();
  const now = new Date();

  if (text.includes('tomorrow')) return addDays(now, 1).toISOString();
  if (text.includes('within 48 hours') || text.includes('48 hours'))
    return addDays(now, 2).toISOString();
  if (text.includes('next week')) return addDays(now, 7).toISOString();

  const nextDayMatch = text.match(/next\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/);
  if (nextDayMatch) {
    const dayMap: Record<string, number> = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
    };
    const targetDay = dayMap[nextDayMatch[1]];
    const today = now.getDay();
    let delta = targetDay - today;
    if (delta <= 0) delta += 7;
    return addDays(now, delta).toISOString();
  }

  return null;
}

function resolveDeadline(item: OpportunityItem): Date | null {
  if (item.strictDateISO) {
    const parsed = parseISO(item.strictDateISO);
    if (isValid(parsed)) return parsed;
  }

  const relativeIso = parseRelativeDeadline(item.deadlineText);
  if (relativeIso) {
    const parsed = parseISO(relativeIso);
    if (isValid(parsed)) return parsed;
  }
  return null;
}

function scoreUrgency(item: OpportunityItem): {
  score: number;
  badge: RankedOpportunity['urgencyBadge'];
  level: RankedOpportunity['urgencyLevel'];
  daysLeft: number | null;
} {
  const deadline = resolveDeadline(item);
  if (!deadline) {
    return { score: 45, badge: 'No deadline', level: 'neutral', daysLeft: null };
  }

  const daysLeft = differenceInCalendarDays(deadline, new Date());
  if (daysLeft <= 0) return { score: 20, badge: 'Expired', level: 'expired', daysLeft };
  if (daysLeft <= 2) return { score: 100, badge: 'Critical', level: 'high', daysLeft };
  if (daysLeft <= 7) return { score: 88, badge: 'Urgent', level: 'high', daysLeft };
  if (daysLeft <= 14) return { score: 74, badge: 'Soon', level: 'medium', daysLeft };
  if (daysLeft <= 30) return { score: 60, badge: 'Upcoming', level: 'medium', daysLeft };
  return { score: 44, badge: 'Long-window', level: 'low', daysLeft };
}

function scoreTechExperienceFit(
  profileTech: TechExperience[],
  requiredTech: TechExperience[],
): number {
  if (requiredTech.length === 0) return 1;
  const normalizedProfile = profileTech.map((item) => ({
    technology: item.technology.toLowerCase(),
    years: Number(item.years || 0),
  }));

  let total = 0;
  for (const req of requiredTech) {
    const reqYears = Number(req.years || 0);
    const found = normalizedProfile.find(
      (item) => item.technology === req.technology.toLowerCase(),
    );
    if (!found) continue;
    if (reqYears <= 0) {
      total += 1;
    } else {
      total += clamp((found.years / reqYears) * 100, 0, 120) / 100;
    }
  }

  return clamp((total / requiredTech.length) * 100, 0, 100) / 100;
}

function scoreProfileFit(profile: StudentProfile, item: OpportunityItem): number {
  const skillFit = overlapRatio(item.requiredSkills, profile.skills);
  const typeFit = profile.preferredOpportunityTypes.includes(item.opportunityType) ? 1 : 0.3;

  const yearsRequired = Number(item.yearsExperienceRequired || 0);
  const overallYearsFit =
    yearsRequired <= 0
      ? 1
      : clamp((profile.overallExperienceYears / yearsRequired) * 100, 0, 120) / 100;

  const techYearsFit = scoreTechExperienceFit(
    profile.technologyExperience,
    item.technologyExperienceRequired,
  );

  const profileScore =
    skillFit * 0.4 + typeFit * 0.2 + overallYearsFit * 0.2 + techYearsFit * 0.2;
  return clamp(profileScore * 100);
}

function scoreCompleteness(item: OpportunityItem): number {
  const checks = [
    Boolean(item.title),
    Boolean(item.organization),
    Boolean(item.summary),
    Boolean(item.strictDateISO || item.deadlineText),
    item.requiredDocuments.length > 0,
    item.eligibility.length > 0,
    item.applicationLinks.length > 0 || item.contactInfo.length > 0,
    item.requiredSkills.length > 0,
  ];
  const present = checks.filter(Boolean).length;
  return clamp((present / checks.length) * 100);
}

export function rankDeterministically(
  profile: StudentProfile,
  items: OpportunityItem[],
): RankedOpportunity[] {
  const opportunities = items.filter((item) => item.isOpportunity);

  const ranked = opportunities.map((item) => {
    const profileFit = scoreProfileFit(profile, item);
    const urgencyMeta = scoreUrgency(item);
    const completeness = scoreCompleteness(item);

    const finalScore = Math.round(
      profileFit * SCORE_WEIGHTS.profileFit +
        urgencyMeta.score * SCORE_WEIGHTS.urgency +
        completeness * SCORE_WEIGHTS.completeness,
    );

    const evidence: string[] = [
      `Profile fit ${Math.round(profileFit)} based on skills and experience alignment.`,
      `Urgency ${Math.round(urgencyMeta.score)} from deadline context (${urgencyMeta.badge}).`,
      `Completeness ${Math.round(completeness)} from extracted required fields.`,
    ];

    const actionChecklist = [
      'Validate eligibility criteria line by line.',
      'Gather required documents and proofread.',
      'Submit before deadline buffer of 24 hours.',
    ];

    return {
      ...item,
      score: finalScore,
      urgencyBadge: urgencyMeta.badge,
      urgencyLevel: urgencyMeta.level,
      daysLeft: urgencyMeta.daysLeft,
      weightedBreakdown: {
        profileFit: Math.round(profileFit),
        urgency: Math.round(urgencyMeta.score),
        completeness: Math.round(completeness),
        profileFitWeight: SCORE_WEIGHTS.profileFit,
        urgencyWeight: SCORE_WEIGHTS.urgency,
        completenessWeight: SCORE_WEIGHTS.completeness,
      },
      evidence,
      actionChecklist,
    } satisfies RankedOpportunity;
  });

  return ranked.sort((a, b) => b.score - a.score);
}

export function urgencyColor(level: RankedOpportunity['urgencyLevel']): string {
  if (level === 'high') return 'text-red-700 bg-red-500/10 border-red-500/20';
  if (level === 'medium') return 'text-amber-700 bg-amber-500/10 border-amber-500/20';
  if (level === 'low') return 'text-emerald-700 bg-emerald-500/10 border-emerald-500/20';
  if (level === 'expired') return 'text-muted-foreground bg-muted border-border';
  return 'text-primary bg-primary/10 border-primary/20';
}

export function scoreColor(score: number): string {
  if (score >= 85) return 'text-emerald-700';
  if (score >= 70) return 'text-cyan-700';
  if (score >= 55) return 'text-amber-700';
  return 'text-rose-700';
}
