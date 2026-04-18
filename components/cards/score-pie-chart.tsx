'use client';

import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

export function ScorePieChart({
  profileFit,
  urgency,
  completeness,
}: {
  profileFit: number;
  urgency: number;
  completeness: number;
}) {
  const data = [
    { name: 'Profile Fit', value: profileFit, fill: '#22d3ee' },
    { name: 'Urgency', value: urgency, fill: '#f59e0b' },
    { name: 'Completeness', value: completeness, fill: '#34d399' },
  ];

  return (
    <div className="w-full space-y-3">
      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={44} outerRadius={64} stroke="none" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.96)',
              border: '1px solid rgba(203, 213, 225, 0.9)',
              borderRadius: 12,
            }}
            itemStyle={{ color: '#0f172a' }}
            labelStyle={{ color: '#334155' }}
          />
        </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {data.map((segment) => (
          <div key={segment.name} className="flex items-center gap-2 rounded-lg border border-border bg-muted/60 px-2.5 py-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: segment.fill }} aria-hidden="true" />
            <span className="text-[11px] font-medium text-muted-foreground">{segment.name}</span>
            <span className="ml-auto text-[11px] font-semibold text-card-foreground">{segment.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
