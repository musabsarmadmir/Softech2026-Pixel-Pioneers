"use client";

import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppState } from '@/components/shared/app-state-provider';

export function HistoryList() {
  const { history, clearHistory } = useAppState();

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-zinc-100">Local Analysis History (Last 20)</h3>
        <Button type="button" size="sm" variant="outline" onClick={clearHistory}>
          Clear
        </Button>
      </div>

      <div className="space-y-2">
        {history.length === 0 ? (
          <p className="text-sm text-zinc-400">No saved analyses yet.</p>
        ) : (
          history.map((session) => (
            <div key={session.id} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
              <p className="text-sm font-medium text-zinc-100">{session.profileSnapshot.fullName}</p>
              <p className="text-xs text-zinc-400">
                {format(new Date(session.createdAtISO), 'dd MMM yyyy, hh:mm a')} | {session.inboxItemsCount} inbox items |{' '}
                {session.ranked.length} ranked opportunities
              </p>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
