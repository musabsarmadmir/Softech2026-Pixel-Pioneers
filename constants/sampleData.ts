import type { OpportunityItem, StudentProfile } from '@/types/opportunity';

export const backupProfile: StudentProfile = {
  fullName: 'Talal Bin Musab',
  degreeProgram: 'BS Fintech',
  semester: 6,
  cgpa: 3.41,
  skills: ['React', 'TypeScript', 'Python', 'Node.js', 'SQL', 'UI/UX'],
  interests: ['AI', 'Product', 'Research', 'Web Engineering'],
  preferredOpportunityTypes: [
    'internship',
    'scholarship',
  ],
  financialNeed: 'important',
  locationPreference: 'Remote or Lahore',
  overallExperienceYears: 1.8,
  technologyExperience: [
    { technology: 'React', years: 1.8 },
    { technology: 'TypeScript', years: 1.5 },
    { technology: 'Python', years: 2.3 },
    { technology: 'Node.js', years: 1.2 },
  ],
};

export const sampleResumeDescriptions: string[] = [
  'Resume A: BSFT student with React + Python projects, campus tech society lead, one startup internship.',
  'Resume B: Final year financial technology student, strong problem solving, hackathon finalist, full-stack focus.',
  'Resume C: Data + AI focused undergrad with NLP mini-projects and research assistant exposure.',
];

export const sampleInboxRawText = `
Subject: Summer 2026 Frontend Internship - Apply by next Friday
From: careers@alphagrid.io
We are hiring frontend interns. Requirements: React, TypeScript, basic testing. Send CV + transcript to apply@alphagrid.io.
---
Subject: Scholarship Announcement: Merit x Need Support 2026
From: aid@uni-foundation.org
Eligible students with CGPA 3.0+ may apply. Required docs: transcript, CNIC, recommendation letter. Deadline: 30 April 2026.
---
Subject: Win a free iPhone now click this link
From: offers@fast-prize-bot.net
You have won guaranteed gift. Pay processing fee.
---
Subject: AI Research Internship (Remote)
From: labs@northbridge.ai
Students with Python + NLP background preferred. Submit CV + statement of purpose within 48 hours.
---
Subject: Career Fair Parking Notice
From: admin@campus.edu
Parking slots changed due to event logistics.
---
Subject: National Software Competition 2026
From: no-reply@nsc.pk
Team registration open. Required: project abstract, team profiles. Deadline tomorrow.
---
Subject: Exchange Program - Semester Abroad
From: mobility@globaluni.org
Eligibility: Semester 5+ and CGPA 3.2+. Documents: passport copy, transcript, personal statement. Deadline: 20 May 2026.
---
Subject: Junior Web Developer Part-time
From: hr@pixelbyte.co
Need 1+ year React/Node experience. Apply with CV and portfolio by 05 May 2026.
---
Subject: Webinar Invite - Productivity Tips
From: events@studyhub.com
Join our webinar this Saturday.
---
Subject: Entrepreneurship Grant Challenge
From: grants@innovatepk.org
University teams can pitch startup ideas. Required docs: proposal deck + budget. Deadline next Monday.
---
Subject: Data Analyst Internship - FinTech
From: talent@cashflowlabs.com
Skills required: SQL, Python, dashboarding. Deadline: 28 April 2026. Apply at careers.cashflowlabs.com.
---
Subject: Fake Internship Guaranteed Placement
From: internships@instantjobzzz.biz
Pay registration fee to confirm your seat.`.trim();

export const sampleOpportunities: OpportunityItem[] = [
  {
    id: 'opp-1',
    isOpportunity: true,
    spamReason: null,
    sourceEmailSubject: 'Summer 2026 Frontend Internship - Apply by next Friday',
    sourceEmailSender: 'careers@alphagrid.io',
    opportunityType: 'internship',
    title: 'Frontend Engineering Internship',
    organization: 'AlphaGrid',
    summary: 'Build production UI workflows with React and TypeScript under mentor guidance.',
    deadlineText: 'next Friday',
    strictDateISO: null,
    eligibility: ['Undergraduate CS/SE student', 'Semester 4 or above'],
    requiredDocuments: ['CV', 'Transcript'],
    requiredSkills: ['React', 'TypeScript', 'Testing'],
    yearsExperienceRequired: 0,
    technologyExperienceRequired: [
      { technology: 'React', years: 1 },
      { technology: 'TypeScript', years: 0.5 },
    ],
    applicationLinks: [],
    contactInfo: ['apply@alphagrid.io'],
    location: 'Lahore / Hybrid',
    confidence: 0.95,
  },
  {
    id: 'opp-2',
    isOpportunity: true,
    spamReason: null,
    sourceEmailSubject: 'Scholarship Announcement: Merit x Need Support 2026',
    sourceEmailSender: 'aid@uni-foundation.org',
    opportunityType: 'scholarship',
    title: 'Merit x Need Scholarship 2026',
    organization: 'University Foundation',
    summary: 'Financial support scholarship for high-performing students with documented need.',
    deadlineText: '30 April 2026',
    strictDateISO: '2026-04-30T23:59:00.000Z',
    eligibility: ['CGPA 3.0+', 'Enrolled student'],
    requiredDocuments: ['Transcript', 'CNIC', 'Recommendation letter'],
    requiredSkills: [],
    yearsExperienceRequired: null,
    technologyExperienceRequired: [],
    applicationLinks: ['https://uni-foundation.org/scholarship'],
    contactInfo: ['aid@uni-foundation.org'],
    location: 'Pakistan',
    confidence: 0.97,
  },
  {
    id: 'opp-3',
    isOpportunity: false,
    spamReason: 'Scam-like language and fee request',
    sourceEmailSubject: 'Win a free iPhone now click this link',
    sourceEmailSender: 'offers@fast-prize-bot.net',
    opportunityType: 'other',
    title: 'Suspicious Reward Message',
    organization: 'Unknown',
    summary: 'Likely phishing/spam content with payment request.',
    deadlineText: null,
    strictDateISO: null,
    eligibility: [],
    requiredDocuments: [],
    requiredSkills: [],
    yearsExperienceRequired: null,
    technologyExperienceRequired: [],
    applicationLinks: [],
    contactInfo: [],
    location: null,
    confidence: 0.12,
  },
  {
    id: 'opp-4',
    isOpportunity: true,
    spamReason: null,
    sourceEmailSubject: 'AI Research Internship (Remote)',
    sourceEmailSender: 'labs@northbridge.ai',
    opportunityType: 'research',
    title: 'Remote AI Research Internship',
    organization: 'Northbridge AI Labs',
    summary: 'Research internship focused on NLP pipelines and model evaluation.',
    deadlineText: 'within 48 hours',
    strictDateISO: null,
    eligibility: ['NLP or ML exposure', 'Strong Python'],
    requiredDocuments: ['CV', 'Statement of Purpose'],
    requiredSkills: ['Python', 'NLP', 'Git'],
    yearsExperienceRequired: 1,
    technologyExperienceRequired: [
      { technology: 'Python', years: 1 },
      { technology: 'NLP', years: 0.5 },
    ],
    applicationLinks: ['https://northbridge.ai/internships'],
    contactInfo: ['labs@northbridge.ai'],
    location: 'Remote',
    confidence: 0.93,
  },
  {
    id: 'opp-5',
    isOpportunity: false,
    spamReason: 'Administrative notice only',
    sourceEmailSubject: 'Career Fair Parking Notice',
    sourceEmailSender: 'admin@campus.edu',
    opportunityType: 'other',
    title: 'Parking Logistics',
    organization: 'Campus Admin',
    summary: 'Informational notice unrelated to opportunity.',
    deadlineText: null,
    strictDateISO: null,
    eligibility: [],
    requiredDocuments: [],
    requiredSkills: [],
    yearsExperienceRequired: null,
    technologyExperienceRequired: [],
    applicationLinks: [],
    contactInfo: [],
    location: null,
    confidence: 0.08,
  },
  {
    id: 'opp-6',
    isOpportunity: true,
    spamReason: null,
    sourceEmailSubject: 'National Software Competition 2026',
    sourceEmailSender: 'no-reply@nsc.pk',
    opportunityType: 'competition',
    title: 'National Software Competition',
    organization: 'NSC Pakistan',
    summary: 'Build and present innovative software projects with a student team.',
    deadlineText: 'tomorrow',
    strictDateISO: null,
    eligibility: ['University student teams'],
    requiredDocuments: ['Project abstract', 'Team profiles'],
    requiredSkills: ['Problem solving', 'Presentation'],
    yearsExperienceRequired: null,
    technologyExperienceRequired: [],
    applicationLinks: ['https://nsc.pk/register'],
    contactInfo: ['help@nsc.pk'],
    location: 'Pakistan',
    confidence: 0.91,
  },
  {
    id: 'opp-7',
    isOpportunity: true,
    spamReason: null,
    sourceEmailSubject: 'Exchange Program - Semester Abroad',
    sourceEmailSender: 'mobility@globaluni.org',
    opportunityType: 'exchange',
    title: 'Semester Abroad Exchange Program',
    organization: 'GlobalUni Mobility Office',
    summary: 'One semester exchange pathway with partner universities.',
    deadlineText: '20 May 2026',
    strictDateISO: '2026-05-20T23:59:00.000Z',
    eligibility: ['Semester 5+', 'CGPA 3.2+'],
    requiredDocuments: ['Passport copy', 'Transcript', 'Personal statement'],
    requiredSkills: ['Communication'],
    yearsExperienceRequired: null,
    technologyExperienceRequired: [],
    applicationLinks: ['https://globaluni.org/exchange'],
    contactInfo: ['mobility@globaluni.org'],
    location: 'International',
    confidence: 0.94,
  },
  {
    id: 'opp-8',
    isOpportunity: true,
    spamReason: null,
    sourceEmailSubject: 'Junior Web Developer Part-time',
    sourceEmailSender: 'hr@pixelbyte.co',
    opportunityType: 'job',
    title: 'Part-time Junior Web Developer',
    organization: 'PixelByte',
    summary: 'Part-time role for building internal dashboards and client web modules.',
    deadlineText: '05 May 2026',
    strictDateISO: '2026-05-05T23:59:00.000Z',
    eligibility: ['Available part-time', 'Student or fresh graduate'],
    requiredDocuments: ['CV', 'Portfolio'],
    requiredSkills: ['React', 'Node.js', 'SQL'],
    yearsExperienceRequired: 1,
    technologyExperienceRequired: [
      { technology: 'React', years: 1 },
      { technology: 'Node.js', years: 1 },
    ],
    applicationLinks: ['https://pixelbyte.co/careers/junior-web-developer'],
    contactInfo: ['hr@pixelbyte.co'],
    location: 'Lahore',
    confidence: 0.9,
  },
  {
    id: 'opp-9',
    isOpportunity: false,
    spamReason: 'Event invite not an opportunity application',
    sourceEmailSubject: 'Webinar Invite - Productivity Tips',
    sourceEmailSender: 'events@studyhub.com',
    opportunityType: 'other',
    title: 'Webinar Invite',
    organization: 'StudyHub',
    summary: 'General webinar invite.',
    deadlineText: null,
    strictDateISO: null,
    eligibility: [],
    requiredDocuments: [],
    requiredSkills: [],
    yearsExperienceRequired: null,
    technologyExperienceRequired: [],
    applicationLinks: [],
    contactInfo: [],
    location: null,
    confidence: 0.2,
  },
  {
    id: 'opp-10',
    isOpportunity: true,
    spamReason: null,
    sourceEmailSubject: 'Entrepreneurship Grant Challenge',
    sourceEmailSender: 'grants@innovatepk.org',
    opportunityType: 'competition',
    title: 'Student Entrepreneurship Grant Challenge',
    organization: 'InnovatePK',
    summary: 'Funding challenge for university startup teams.',
    deadlineText: 'next Monday',
    strictDateISO: null,
    eligibility: ['Student teams'],
    requiredDocuments: ['Pitch deck', 'Budget plan'],
    requiredSkills: ['Presentation', 'Product thinking'],
    yearsExperienceRequired: null,
    technologyExperienceRequired: [],
    applicationLinks: ['https://innovatepk.org/challenge'],
    contactInfo: ['grants@innovatepk.org'],
    location: 'Pakistan',
    confidence: 0.89,
  },
  {
    id: 'opp-11',
    isOpportunity: true,
    spamReason: null,
    sourceEmailSubject: 'Data Analyst Internship - FinTech',
    sourceEmailSender: 'talent@cashflowlabs.com',
    opportunityType: 'internship',
    title: 'Data Analyst Internship',
    organization: 'CashFlow Labs',
    summary: 'FinTech analytics internship focused on SQL and dashboards.',
    deadlineText: '28 April 2026',
    strictDateISO: '2026-04-28T23:59:00.000Z',
    eligibility: ['Undergraduate final-year preferred'],
    requiredDocuments: ['CV'],
    requiredSkills: ['SQL', 'Python', 'Dashboarding'],
    yearsExperienceRequired: 0.5,
    technologyExperienceRequired: [
      { technology: 'SQL', years: 1 },
      { technology: 'Python', years: 1 },
    ],
    applicationLinks: ['https://careers.cashflowlabs.com/data-analyst-intern'],
    contactInfo: ['talent@cashflowlabs.com'],
    location: 'Karachi / Hybrid',
    confidence: 0.92,
  },
  {
    id: 'opp-12',
    isOpportunity: false,
    spamReason: 'Fee request and unrealistic guarantee',
    sourceEmailSubject: 'Fake Internship Guaranteed Placement',
    sourceEmailSender: 'internships@instantjobzzz.biz',
    opportunityType: 'other',
    title: 'Suspicious Placement Offer',
    organization: 'Unknown',
    summary: 'Likely fraudulent opportunity requiring upfront fee.',
    deadlineText: null,
    strictDateISO: null,
    eligibility: [],
    requiredDocuments: [],
    requiredSkills: [],
    yearsExperienceRequired: null,
    technologyExperienceRequired: [],
    applicationLinks: [],
    contactInfo: [],
    location: null,
    confidence: 0.14,
  },
];
