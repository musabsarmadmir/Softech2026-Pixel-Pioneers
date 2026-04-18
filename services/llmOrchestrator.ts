type PipelineStage = 'analyzer' | 'ranker';

type ProviderId = 'groq';

type GroqConfig = {
  endpoint: string;
  apiKey?: string;
  analyzerModel: string;
  analyzerFallbackModels: string[];
  rankerModel: string;
  rankerFallbackModels: string[];
};

type OrchestratorOptions = {
  timeoutMs?: number;
  includeInternalMetadata?: boolean;
};

type AttachmentInput = {
  fileName: string;
  mimeType: string;
  dataUrl: string;
};

type InboxAnalyzerInput = {
  studentProfile: Record<string, unknown>;
  batchEmailText?: string;
  screenshotAttachments?: AttachmentInput[];
};

type RankerInput = {
  studentProfile: Record<string, unknown>;
  extractedOpportunities: Record<string, unknown>[];
};

type OrchestratorSuccess<T> = {
  ok: true;
  data: T;
  metadata?: {
    stage: PipelineStage;
    provider: ProviderId;
    model: string;
  };
};

type OrchestratorFailure = {
  ok: false;
  error: string;
  failures: Array<{ provider: 'groq'; reason: string }>;
};

type OrchestratorResult<T> = OrchestratorSuccess<T> | OrchestratorFailure;

const DEFAULT_TIMEOUT_MS = 18_000;

const GROQ_PROVIDER: GroqConfig = {
  endpoint: 'https://api.groq.com/openai/v1/chat/completions',
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  analyzerModel:
    process.env.NEXT_PUBLIC_GROQ_ANALYZER_MODEL ?? 'llava-1.5-7b-32k',
  analyzerFallbackModels: [
    'llava-1.5-7b-32k',
    'llama-3.1-8b-instant',
  ],
  rankerModel:
    process.env.NEXT_PUBLIC_GROQ_RANKER_MODEL ??
    'meta-llama/llama-4-maverick-17b-128e-instruct',
  rankerFallbackModels: [
    'meta-llama/llama-4-maverick-17b-128e-instruct',
    'llama-3.3-70b-versatile',
    'llama-3.1-8b-instant',
  ],
};

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error('LLM request timed out')), timeoutMs);
    }),
  ]);
}

function extractJsonObject(raw: string): Record<string, unknown> {
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    const firstBrace = raw.indexOf('{');
    const lastBrace = raw.lastIndexOf('}');
    if (firstBrace < 0 || lastBrace <= firstBrace) {
      throw new Error('Model response did not contain a valid JSON object.');
    }
    return JSON.parse(raw.slice(firstBrace, lastBrace + 1)) as Record<
      string,
      unknown
    >;
  }
}

function getModelForStage(provider: GroqConfig, stage: PipelineStage): string {
  if (stage === 'analyzer') return provider.analyzerModel;
  if (stage === 'ranker') return provider.rankerModel;
  throw new Error(`Unknown pipeline stage: ${stage}`);
}

function getModelFallbacksForStage(
  provider: GroqConfig,
  stage: PipelineStage,
): string[] {
  if (stage === 'analyzer') return provider.analyzerFallbackModels;
  if (stage === 'ranker') return provider.rankerFallbackModels;
  throw new Error(`Unknown pipeline stage: ${stage}`);
}

function getCandidateModelsForStage(
  provider: GroqConfig,
  stage: PipelineStage,
): string[] {
  const primary = getModelForStage(provider, stage);
  const fallbacks = getModelFallbacksForStage(provider, stage);
  const all = [primary, ...fallbacks].filter(Boolean);
  return [...new Set(all)];
}

function getSystemPrompt(stage: PipelineStage): string {
  if (stage === 'analyzer') {
    return [
      'You are Pixel Pioneers Analyzer (open-source model).',
      'Classify each input item as opportunity or spam/non-opportunity.',
      'Extract structured machine-readable fields from messy natural language.',
      'Resolve relative deadlines (e.g., tomorrow, next Friday, in 48 hours) and output strictDateISO when possible.',
      'Return JSON only. No markdown.',
      'Required top-level schema:',
      '{',
      '  "items": [',
      '    {',
      '      "id": "string",',
      '      "isOpportunity": true,',
      '      "spamReason": "string | null",',
      '      "opportunityType": "internship|scholarship|competition|job|research|exchange|other",',
      '      "title": "string",',
      '      "organization": "string",',
      '      "summary": "string",',
      '      "deadlineText": "string | null",',
      '      "strictDateISO": "string | null",',
      '      "eligibility": ["string"],',
      '      "requiredDocuments": ["string"],',
      '      "requiredSkills": ["string"],',
      '      "yearsExperienceRequired": "number | null",',
      '      "technologyExperienceRequired": [{"technology":"string","years":"number"}],',
      '      "applicationLinks": ["string"],',
      '      "contactInfo": ["string"],',
      '      "location": "string | null",',
      '      "confidence": "number 0-1"',
      '    }',
      '  ]',
      '}',
    ].join('\n');
  }

  if (stage === 'ranker') {
    return [
      'You are PaisaMaker Ranker (open-source model).',
      'You receive structured opportunities already extracted.',
      'Provide ranking guidance, actionable checklists, and evidence-backed reasons, make sure to prioritize based on the provided criteria.',
      'Do not use hidden chain-of-thought; provide concise reasons only.',
      'Return JSON only with schema:',
      '{',
      '  "ranked": [',
      '    {',
      '      "id": "string",',
      '      "priorityNote": "string",',
      '      "evidence": ["string"],',
      '      "actionChecklist": ["string"],',
      '      "draftHints": ["string"]',
      '    }',
      '  ]',
      '}',
    ].join('\n');
  }

  throw new Error(`Unknown pipeline stage: ${stage}`);
}

function toVisionContent(
  textPayload: Record<string, unknown>,
  attachments: AttachmentInput[] = [],
) {
  const content: Array<Record<string, unknown>> = [
    {
      type: 'text',
      text: JSON.stringify(textPayload),
    },
  ];

  for (const attachment of attachments) {
    // NOTE: open-source providers with OpenAI-compatible APIs typically accept data URLs in image_url.
    content.push({
      type: 'image_url',
      image_url: { url: attachment.dataUrl },
    });
  }

  return content;
}

async function callProvider(
  provider: GroqConfig,
  stage: PipelineStage,
  model: string,
  payload: Record<string, unknown>,
  options: { timeoutMs: number; attachments?: AttachmentInput[] },
): Promise<{ output: Record<string, unknown>; model: string }> {
  if (!provider.apiKey) {
    throw new Error('Missing API key for Groq. Set NEXT_PUBLIC_GROQ_API_KEY.');
  }

  const requestBody = {
    model,
    max_tokens: stage === 'analyzer' ? 1800 : 1200,
    temperature: stage === 'ranker' ? 0.1 : 0,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: getSystemPrompt(stage),
      },
      {
        role: 'user',
        content:
          stage === 'analyzer' && options.attachments && options.attachments.length > 0
            ? toVisionContent(payload, options.attachments)
            : JSON.stringify(payload),
      },
    ],
  };

  const response = await withTimeout(
    fetch(provider.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${provider.apiKey}`,
      },
      body: JSON.stringify(requestBody),
    }),
    options.timeoutMs,
  );

  if (!response.ok) {
    const details = await response.text();
    let errorDetail = details;
    try {
      const errorJson = JSON.parse(details);
      errorDetail = errorJson.error?.message || errorJson.message || details;
    } catch {
      // If not JSON, use the raw details
    }
    throw new Error(
      `HTTP ${response.status} from Groq during ${stage}: ${errorDetail}`,
    );
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string | Array<{ text?: string }> } }>;
  };

  const rawContent = data.choices?.[0]?.message?.content;
  let text = '{}';

  if (typeof rawContent === 'string') {
    text = rawContent;
  } else if (Array.isArray(rawContent)) {
    text = rawContent
      .filter((item) => typeof item === 'object' && item !== null && 'text' in item)
      .map((item) => (item as { text?: string }).text ?? '')
      .join('\n');
  }

  if (!text || text.trim() === '') {
    throw new Error('Model returned empty response');
  }

  return {
    output: extractJsonObject(text),
    model,
  };
}

async function executeWithFallback<T extends Record<string, unknown>>(
  stage: PipelineStage,
  payload: Record<string, unknown>,
  orchestratorOptions: OrchestratorOptions = {},
  attachments?: AttachmentInput[],
): Promise<OrchestratorResult<T>> {
  const timeoutMs = orchestratorOptions.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const failures: Array<{ provider: 'groq'; reason: string }> = [];
  const models = getCandidateModelsForStage(GROQ_PROVIDER, stage);

  for (const model of models) {
    try {
      const result = await callProvider(GROQ_PROVIDER, stage, model, payload, {
        timeoutMs,
        attachments,
      });

      return {
        ok: true,
        data: result.output as T,
        metadata: orchestratorOptions.includeInternalMetadata
          ? {
              stage,
              provider: 'groq',
              model: result.model,
            }
          : undefined,
      };
    } catch (error) {
      failures.push({
        provider: 'groq',
        reason: `[${model}] ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  }

  return {
    ok: false,
    error: `Groq request failed during ${stage} stage.`,
    failures,
  };
}

export async function analyzeInboxBatch(
  input: InboxAnalyzerInput,
  options: OrchestratorOptions = {},
) {
  const payload = {
    task: 'opportunity_email_extraction',
    studentProfile: input.studentProfile,
    batchEmailText: input.batchEmailText ?? '',
    instructions: {
      detectSpamAndFake: true,
      includeStrictDates: true,
      includeRelativeDeadlineContext: true,
      supportedTypes: [
        'internship',
        'scholarship',
        'competition',
        'job',
        'research',
        'exchange',
      ],
    },
  };

  return executeWithFallback<{ items: Record<string, unknown>[] }>(
    'analyzer',
    payload,
    options,
    input.screenshotAttachments,
  );
}

export async function generateReasonedRanking(
  input: RankerInput,
  options: OrchestratorOptions = {},
) {
  const payload = {
    task: 'reasoned_ranking_guidance',
    studentProfile: input.studentProfile,
    extractedOpportunities: input.extractedOpportunities,
    constraints: {
      hideProviderDetails: true,
      keepReasoningConcise: true,
      includeActionChecklist: true,
    },
  };

  return executeWithFallback<{ ranked: Record<string, unknown>[] }>(
    'ranker',
    payload,
    options,
  );
}

export function getOrchestratorReadiness() {
  return {
    ready: Boolean(GROQ_PROVIDER.apiKey),
    providersConfigured: Boolean(GROQ_PROVIDER.apiKey) ? ['groq'] : [],
    configuredCount: Boolean(GROQ_PROVIDER.apiKey) ? 1 : 0,
    totalProviders: 1,
    llmLayers: {
      analyzerConfigured: Boolean(GROQ_PROVIDER.analyzerModel),
      rankerConfigured: Boolean(GROQ_PROVIDER.rankerModel),
    },
  };
}

export async function fileToAttachmentInput(file: File): Promise<AttachmentInput> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
    reader.readAsDataURL(file);
  });

  return {
    fileName: file.name,
    mimeType: file.type,
    dataUrl,
  };
}
