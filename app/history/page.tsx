import { HistoryList } from '@/components/shared/history-list';

export default function HistoryPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Analysis History</h1>
        <p className="text-sm text-zinc-300">Stored locally in browser (last 20 analyses).</p>
      </div>
      <HistoryList />
    </div>
  );
}
