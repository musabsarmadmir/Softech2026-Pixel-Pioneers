'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileUp, Sparkles } from 'lucide-react';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { extractProfileFromResumePdf, extractResumeTextFromPdf, fileToAttachmentInput } from '@/services/llmOrchestrator';
import { useAppState } from '@/components/shared/app-state-provider';

function pickFirstString(data: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const value = data[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return null;
}

function pickFirstNumber(data: Record<string, unknown>, keys: string[]): number | null {
  for (const key of keys) {
    const value = data[key];
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string' && value.trim()) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return null;
}

function pickStringList(data: Record<string, unknown>, keys: string[]): string[] {
  for (const key of keys) {
    const value = data[key];
    if (Array.isArray(value)) {
      const list = value
        .map((item) => String(item).trim())
        .filter(Boolean);
      if (list.length > 0) return list;
    }
    if (typeof value === 'string' && value.trim()) {
      const list = value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
      if (list.length > 0) return list;
    }
  }
  return [];
}

export function ResumeUpload() {
  const { profile, setProfile } = useAppState();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>('Upload PDF resume to auto-populate profile fields.');

  const onDrop = useCallback(
    async (files: File[]) => {
      const file = files[0];
      if (!file) return;
      setLoading(true);
      try {
        const attachment = await fileToAttachmentInput(file);
        const extractedText = await extractResumeTextFromPdf(file);
        const result = await extractProfileFromResumePdf({
          resumePdf: attachment,
          resumeText: extractedText.resumeText,
        });
        if (!result.ok) {
          const reason = result.failures[0]?.reason ?? result.error;
          setStatus(`Could not parse resume right now: ${reason}`);
          return;
        }

        const data = result.data as Record<string, unknown>;
        const fullName = pickFirstString(data, ['fullName', 'name', 'studentName']);
        const degreeProgram = pickFirstString(data, ['degreeProgram', 'degree', 'program']);
        const semester = pickFirstNumber(data, ['semester']);
        const cgpa = pickFirstNumber(data, ['cgpa', 'gpa']);
        const skills = pickStringList(data, ['skills']);
        const interests = pickStringList(data, ['interests']);

        const updated = {
          ...profile,
          fullName: fullName ?? profile.fullName,
          degreeProgram: degreeProgram ?? profile.degreeProgram,
          semester: semester ?? profile.semester,
          cgpa: cgpa ?? profile.cgpa,
          skills: skills.length > 0 ? skills : profile.skills,
          interests: interests.length > 0 ? interests : profile.interests,
        };

        const changed = JSON.stringify(updated) !== JSON.stringify(profile);
        setProfile(updated);

        if (!changed) {
          setStatus('Resume parsed, but no matching structured fields were found to update.');
          return;
        }

        setStatus('Resume parsed successfully. Profile updated.');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        setStatus(`Resume parsing failed: ${message}`);
      } finally {
        setLoading(false);
      }
    },
    [profile, setProfile],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  });

  return (
    <Card className="space-y-4">
      <div>
        <CardTitle>Resume Analyzer (PDF)</CardTitle>
        <CardDescription>
          Uses the Analyzer LLM to extract profile attributes from PDF. OCR support can be added later.
        </CardDescription>
      </div>
      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-2xl border border-dashed p-6 text-center transition ${
          isDragActive ? 'border-cyan-400 bg-cyan-500/10' : 'border-zinc-700 bg-zinc-900/50'
        }`}
      >
        <input {...getInputProps()} />
        <FileUp className="mx-auto mb-2 h-6 w-6 text-zinc-300" />
        <p className="text-sm text-zinc-300">Drop resume PDF here or click to upload</p>
      </div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-zinc-400">{status}</p>
        <Button type="button" size="sm" variant="secondary" disabled={loading}>
          <Sparkles className="mr-1 h-4 w-4" /> {loading ? 'Analyzing...' : 'AI Resume Parse'}
        </Button>
      </div>
    </Card>
  );
}
