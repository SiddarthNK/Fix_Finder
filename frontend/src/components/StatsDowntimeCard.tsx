import React, { useState } from 'react';
import { Activity, Clock } from 'lucide-react';

interface StatsDowntimeCardProps {
  downtimeHrsAvoided?: number;
}

export const StatsDowntimeCard: React.FC<StatsDowntimeCardProps> = ({ downtimeHrsAvoided = 24.5 }) => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');

  // Mini-bar charts data
  const barsData = {
    week: [
      { label: 'Mon', val: 30 },
      { label: 'Tue', val: 55 },
      { label: 'Wed', val: 85, active: true },
      { label: 'Thu', val: 40 },
      { label: 'Fri', val: 65 }
    ],
    month: [
      { label: 'W1', val: 45 },
      { label: 'W2', val: 70 },
      { label: 'W3', val: 95, active: true },
      { label: 'W4', val: 60 }
    ],
    year: [
      { label: 'Q1', val: 60 },
      { label: 'Q2', val: 85, active: true },
      { label: 'Q3', val: 50 },
      { label: 'Q4', val: 75 }
    ]
  };

  const currentBars = barsData[timeframe];

  return (
    <div className="bento-card p-6 flex flex-col justify-between h-full bg-[#212121]">
      <div>
        {/* Header with Timeframe Pills */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8A]">
            Downtime Avoided
          </span>

          <div className="flex items-center bg-[#262626] p-1 rounded-full border border-white/5">
            {(['week', 'month', 'year'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize transition-all ${
                  timeframe === tf
                    ? 'bg-[#FF6A2B] text-white shadow-sm'
                    : 'text-[#8A8A8A] hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Huge 300 weight numeral */}
        <div className="my-3">
          <div className="flex items-baseline gap-2">
            <span className="font-light text-5xl md:text-6xl text-white tracking-tight">
              {downtimeHrsAvoided}
            </span>
            <span className="text-[#8A8A8A] text-sm font-medium">hrs saved</span>
          </div>
          <p className="text-xs text-[#8A8A8A] mt-1">Based on agent precedent diagnosis speed</p>
        </div>

        {/* Mini-bars chart */}
        <div className="mt-6 pt-4 border-t border-white/5">
          <div className="h-16 flex items-end gap-3 justify-between">
            {currentBars.map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div
                  style={{ height: `${bar.val}%` }}
                  className={`w-full rounded-md transition-all duration-300 ${
                    bar.active
                      ? 'bg-[#FF6A2B] shadow-lg shadow-[#FF6A2B]/30'
                      : 'bg-[#4A4A4A] hover:bg-[#8A8A8A]'
                  }`}
                />
                <span className="text-[10px] text-[#8A8A8A] font-medium">{bar.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
