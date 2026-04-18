'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useAppState } from '@/components/shared/app-state-provider';
import { analyzeInboxBatch, fileToAttachmentInput } from '@/services/llmOrchestrator';
import type { OpportunityItem } from '@/types/opportunity';

export function InboxBatchInput() {
  const { inboxRawText, setInboxRawText, profile, setExtractedItems } = useAppState();
  const [loading, setLoading] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [status, setStatus] = useState('Paste 5-15 emails separated by --- and run AI extraction.');

  const onDrop = useCallback((files: File[]) => {
    setAttachments(files.slice(0, 5));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 5,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
    },
  });

  async function runExtraction() {
    setLoading(true);
    setStatus('Running analyzer model...');
    try {
      // Validate input content
      if (!inboxRawText || inboxRawText.trim().length === 0) {
        setStatus('Error: Please provide email content or text to analyze.');
        setLoading(false);
        return;
      }

      const screenshotAttachments = await Promise.all(attachments.map((file) => fileToAttachmentInput(file)));
      const result = await analyzeInboxBatch({
        studentProfile: profile as unknown as Record<string, unknown>,
        batchEmailText: inboxRawText,
        screenshotAttachments,
      });

      if (!result.ok) {
        // Collect all failure reasons for debugging
        const failureReasons = result.failures
          .map((f) => f.reason)
          .filter((r) => r && r.trim().length > 0);
        
        let errorMsg = result.error || 'Unknown error occurred';
        if (failureReasons.length > 0) {
          // Use the most specific error (usually the last one)
          errorMsg = failureReasons[failureReasons.length - 1];
        }
        
        setStatus(`Analyzer failed: ${errorMsg}`);
        return;
      }

      const items = Array.isArray(result.data.items)
        ? (result.data.items as OpportunityItem[])
        : [];
      setExtractedItems(items);
      setStatus(`Extraction complete. Parsed ${items.length} items.`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Extraction failed unexpectedly';
      setStatus(`Extraction failed: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="space-y-4">
      <div>
        <CardTitle>Opportunity Inbox Parser</CardTitle>
        <CardDescription>
          Paste batched emails, optionally add screenshots, then classify opportunities vs spam.
        </CardDescription>
      </div>

      <Textarea
        value={inboxRawText}
        onChange={(event) => setInboxRawText(event.target.value)}
        className="min-h-[220px]"
        placeholder="Paste 5-15 opportunity emails separated by ---"
      />

      <div
        {...getRootProps()}
        className="cursor-pointer rounded-2xl border border-dashed border-border bg-secondary/50 p-4 text-center"
      >
        <input {...getInputProps()} />
        <UploadCloud className="mx-auto mb-2 h-5 w-5 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">Upload screenshot emails (single or multiple)</p>
        {attachments.length > 0 ? <p className="mt-1 text-xs text-muted-foreground">{attachments.length} file(s) attached</p> : null}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-zinc-400">{status}</p>
        <Button type="button" onClick={runExtraction} disabled={loading}>
          {loading ? 'Analyzing...' : 'Run Analyzer'}
        </Button>
      </div>
    </Card>
  );
}
