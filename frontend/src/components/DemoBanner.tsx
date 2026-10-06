import React from 'react';
import { Play, Sparkles } from 'lucide-react';

interface DemoBannerProps {
  onSelectDemo: (demoId: number) => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ onSelectDemo }) => {
  const steps = [
    { id: 1, label: '1. Clear AC Complaint' },
    { id: 2, label: '2. Vague Complaint' },
    { id: 3, label: '3. No Precedent Refusal' },
    { id: 4, label: '4. Technician Feedback' },
    { id: 5, label: '5. Batch Triage (3)' },
  ];

  return (
    <div className="w-full bg-gradient-to-r from-[#212121] via-[#262626] to-[#212121] border-b border-[#FF6A2B]/20 px-6 py-2.5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-xs font-semibold text-[#FF6A2B]">
        <Sparkles className="w-4 h-4" />
        <span>3-Minute Demo Script:</span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto py-1">
        {steps.map(step => (
          <button
            key={step.id}
            onClick={() => onSelectDemo(step.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0E0E0E] hover:bg-[#FF6A2B]/20 text-[#8A8A8A] hover:text-white border border-white/10 hover:border-[#FF6A2B]/40 text-xs font-medium transition-all duration-200 whitespace-nowrap"
          >
            <Play className="w-3 h-3 text-[#FF6A2B] fill-[#FF6A2B]" />
            <span>{step.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
