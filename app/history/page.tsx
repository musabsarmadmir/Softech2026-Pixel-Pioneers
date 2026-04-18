import { HistoryList } from '@/components/shared/history-list';

export default function HistoryPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Analysis History</h1>
        <p className="text-muted-foreground">Stored locally in browser (last 20 analyses).</p>
      </div>
      <HistoryList />
    </div>
  );
}
