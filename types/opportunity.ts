export type OpportunityType =
  | 'internship'
  | 'scholarship'
  | 'competition'
  | 'job'
  | 'research'
  | 'exchange'
  | 'other';

export type FinancialNeedLevel = 'necessary' | 'important' | 'not-needed';

export type TechExperience = {
  technology: string;
  years: number;
};

export type StudentProfile = {
  fullName: string;
  degreeProgram: string;
  semester: number;
  cgpa: number;
  skills: string[];
  interests: string[];
  preferredOpportunityTypes: OpportunityType[];
  financialNeed: FinancialNeedLevel;
  locationPreference: string;
  overallExperienceYears: number;
  technologyExperience: TechExperience[];
};

export type OpportunityItem = {
  id: string;
  isOpportunity: boolean;
  spamReason: string | null;
  sourceEmailSubject: string;
  sourceEmailSender: string;
  opportunityType: OpportunityType;
  title: string;
  organization: string;
  summary: string;
  deadlineText: string | null;
  strictDateISO: string | null;
  eligibility: string[];
  requiredDocuments: string[];
  requiredSkills: string[];
  yearsExperienceRequired: number | null;
  technologyExperienceRequired: TechExperience[];
  applicationLinks: string[];
  contactInfo: string[];
  location: string | null;
  confidence: number;
};

export type RankedOpportunity = OpportunityItem & {
  score: number;
  urgencyBadge: 'Critical' | 'Urgent' | 'Soon' | 'Upcoming' | 'Long-window' | 'Expired' | 'No deadline';
  urgencyLevel: 'high' | 'medium' | 'low' | 'expired' | 'neutral';
  daysLeft: number | null;
  weightedBreakdown: {
    profileFit: number;
    urgency: number;
    completeness: number;
    profileFitWeight: number;
    urgencyWeight: number;
    completenessWeight: number;
  };
  evidence: string[];
  actionChecklist: string[];
};

export type AnalysisSession = {
  id: string;
  createdAtISO: string;
  profileSnapshot: StudentProfile;
  ranked: RankedOpportunity[];
  inboxItemsCount: number;
};
