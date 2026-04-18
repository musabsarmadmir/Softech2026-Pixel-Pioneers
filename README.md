# Pixel Pioneers
### AI Opportunity Copilot for Students: turn inbox chaos into prioritized, deadline-aware action.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss)
![Groq](https://img.shields.io/badge/Groq-LLM-orange?style=for-the-badge)
![Hackathon](https://img.shields.io/badge/FAST%20Softec-AI%20Hackathon-blueviolet?style=for-the-badge)

## 1. Problem Statement
Students receive opportunities from many channels (email dumps, forwarded screenshots, random announcements), but the signal is buried in noise. Important deadlines are missed, fake opportunities slip through, and decision quality suffers under time pressure.

Why this matters:
- Missed internships/scholarships directly impact student career outcomes.
- Manual triage is slow and inconsistent.
- Most tools do not personalize ranking to a student profile.

## 2. Solution Overview
Pixel Pioneers is a web app that ingests batched inbox content (text + screenshots), extracts structured opportunities with an AI analyzer, filters spam/fake signals, and ranks valid opportunities using deterministic scoring.

Core idea:
- AI handles extraction and normalization.
- Deterministic logic handles explainable ranking.
- The user gets a clear, actionable priority list instead of raw inbox clutter.

## 3. Key Features
- Batch inbox parsing from pasted email text.
- Screenshot-based extraction using multimodal LLM inputs.
- Spam/non-opportunity detection and filtering.
- Structured extraction: type, organization, links, eligibility, skills, deadlines.
- Relative deadline normalization (for example: tomorrow, next week).
- Deterministic weighted ranking:
  - Profile fit (40%)
  - Urgency (30%)
  - Completeness (30%)
- Explainable output with evidence and action checklist.
- Profile-aware matching with:
  - Overall experience years
  - Technology-specific experience years
  - Financial need preference levels
- Save up to last 20 analysis sessions in local storage.
- Seeded fallback data for demo resilience.

## 4. Tech Stack
### Frontend
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Radix UI primitives
- Recharts

### AI / NLP
- Groq Chat Completions API
- Multimodal analyzer model support (text + image)

### Validation / Forms / Utilities
- React Hook Form
- Zod
- date-fns
- react-dropzone
- html-to-image

### Tooling
- ESLint
- PostCSS
- Autoprefixer
- npm scripts (`dev`, `build`, `start`, `lint`, `typecheck`)

## 5. How It Works
1. User configures a student profile (skills, interests, preferred opportunity type, financial need, experience).
2. User pastes batched inbox content and optionally uploads screenshots.
3. Analyzer LLM extracts structured opportunity objects and classifies spam/non-opportunities.
4. Extracted items are normalized (including deadline interpretation where possible).
5. Ranker stage adds reasoning hints.
6. Deterministic scoring engine computes final ranked order with urgency badges and breakdowns.
7. User reviews cards, timelines, and action checklist; can save the analysis snapshot.

## 6. Screenshots / Demo Section
- Live demo: `https://your-demo-url-here`
- Demo video: `https://your-demo-video-url-here`

Placeholders:

```md
![Inbox Processing](./public/demo/inbox-processing.png)
![Ranking Results](./public/demo/results-dashboard.png)
![Deadline Timeline](./public/demo/deadline-timeline.png)
```

## 7. Installation & Setup
### Prerequisites
- Node.js 18+
- npm 9+

### Steps
```bash
git clone https://github.com/musabsarmadmir/Softech-2026---Pixel-Pioneers.git
cd Softech-2026---Pixel-Pioneers
npm install
```

Create `.env.local` in project root:

```env
NEXT_PUBLIC_GROQ_API_KEY=your_groq_key
# Optional overrides
NEXT_PUBLIC_GROQ_ANALYZER_MODEL=llava-1.5-7b-32k
NEXT_PUBLIC_GROQ_RANKER_MODEL=meta-llama/llama-4-maverick-17b-128e-instruct
```

Run locally:

```bash
npm run dev
```

Build for production:

```bash
npm run build
npm run start
```

## 8. Usage
1. Open `/profile` and fill student profile details.
2. Open `/inbox` and paste batched emails (separated entries supported).
3. Optionally upload screenshot images.
4. Click Run Analyzer.
5. Click Run Ranker + Deterministic Engine.
6. Open `/results` to inspect ranked opportunities, urgency levels, and checklists.
7. Save analysis for later comparison.

## 9. Project Structure
```text
Softech-2026---Pixel-Pioneers/
├─ app/
│  ├─ page.tsx                 # Landing page
│  ├─ inbox/page.tsx           # Inbox parsing workflow
│  ├─ profile/page.tsx         # Student profile setup
│  ├─ results/page.tsx         # Ranked output and timeline
│  └─ history/page.tsx         # Saved analysis sessions
├─ components/
│  ├─ forms/                   # Profile/inbox/resume form components
│  ├─ cards/                   # Opportunity and chart cards
│  ├─ timeline/                # Deadline visualization
│  ├─ navigation/              # App navigation shell
│  ├─ shared/                  # Global app state providers
│  └─ ui/                      # Reusable UI primitives
├─ services/
│  └─ llmOrchestrator.ts       # Analyzer/ranker orchestration with model fallback
├─ utils/
│  └─ scoringEngine.ts         # Deterministic weighted ranking
├─ types/
│  └─ opportunity.ts           # Core domain types
├─ constants/
│  └─ sampleData.ts            # Seed fallback/demo data
└─ public/                     # Static assets
```

## 10. Future Improvements / Roadmap
- Gmail/Outlook API integration for automatic inbox sync.
- Resume PDF extraction pipeline re-enable with robust OCR fallback.
- Explainability panel with score contribution visualizations.
- Team/campus mode for shared opportunity boards.
- Notification system for near-expiry deadlines.
- Analytics dashboard for opportunity conversion tracking.
- Server-side secure API routing to avoid client-exposed provider key usage.

## 11. Contributing
Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make focused commits with clear messages.
4. Run checks before pushing:
   - `npm run lint`
   - `npm run typecheck`
   - `npm run build`
5. Open a pull request with:
   - What changed
   - Why it changed
   - Screenshots (if UI-related)

## 12. License
No license file is currently present in this repository.

Recommended: add an MIT License for open collaboration.

## 13. Author
**Musab Sarmad Mir** && **Sajeel Ahmad**
- Repository: https://github.com/musabsarmadmir/Softech-2026---Pixel-Pioneers
