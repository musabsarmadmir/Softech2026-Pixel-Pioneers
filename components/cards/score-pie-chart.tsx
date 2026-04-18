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
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={44} outerRadius={64} stroke="none" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(9, 9, 11, 0.9)',
              border: '1px solid rgba(63, 63, 70, 0.7)',
              borderRadius: 12,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
