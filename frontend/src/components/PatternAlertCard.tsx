import React from 'react';
import { AlertOctagon, Disc, ArrowUpRight } from 'lucide-react';

interface PatternAlertCardProps {
  alertText?: string;
  count?: number;
  building?: string;
}

export const PatternAlertCard: React.FC<PatternAlertCardProps> = ({
  alertText = "Clogged condensate drain line due to algae buildup",
  count = 8,
  building = "Building C"
}) => {
  return (
    <div className="bento-card p-6 flex flex-col justify-between h-full bg-[#212121] relative overflow-hidden group">
      {/* Background Vinyl-style gear/dial graphic */}
      <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full border-4 border-dashed border-[#FF6A2B]/10 group-hover:border-[#FF6A2B]/25 transition-all duration-700 flex items-center justify-center animate-spin-slow pointer-events-none">
        <Disc className="w-20 h-20 text-[#FF6A2B]/10 group-hover:text-[#FF6A2B]/20 transition-colors" />
      </div>

      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-[#FF6A2B]">
            <AlertOctagon className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Pattern Alert
            </span>
          </div>

          <span className="text-xs bg-[#FF6A2B]/15 text-[#FF6A2B] font-bold px-2.5 py-1 rounded-full border border-[#FF6A2B]/30">
            {building}
          </span>
        </div>

        {/* Big "80 times" style text */}
        <div className="my-2">
          <div className="flex items-baseline gap-2">
            <span className="font-light text-4xl md:text-5xl text-white">
              {count} times
            </span>
            <span className="text-xs text-[#8A8A8A]">recurrence cluster</span>
          </div>

          <p className="text-xs text-white/90 font-medium mt-2 leading-relaxed max-w-[280px]">
            "{alertText}"
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between z-10">
        <span className="text-[11px] text-[#8A8A8A]">Auto-detected by Chroma Engine</span>
        <button className="w-7 h-7 rounded-full bg-[#262626] group-hover:bg-[#FF6A2B] flex items-center justify-center text-[#8A8A8A] group-hover:text-white transition-all">
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
