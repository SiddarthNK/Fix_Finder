import React, { useState } from 'react';
import { ShieldCheck, Eye, EyeOff, Wrench, ChevronDown, ChevronUp } from 'lucide-react';
import { IntakeOutput } from '../types';

interface EquipmentProfileCardProps {
  intake?: IntakeOutput | null;
}

export const EquipmentProfileCard: React.FC<EquipmentProfileCardProps> = ({ intake }) => {
  const [isWatching, setIsWatching] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const equipType = intake?.equipment_type || 'AC Unit';
  const building = intake?.building || 'Building A';
  const floor = intake?.floor ?? 2;

  // Equipment model fallback display
  const modelName = equipType === 'AC' ? 'Daikin SkyAir 500' : (equipType === 'Generator' ? 'Cummins Silent Power 250' : 'Otis Gen2 Premier');
  const failuresThisYear = equipType === 'AC' ? 12 : 5;

  return (
    <div className="bento-card p-6 flex flex-col justify-between h-full bg-[#212121] relative overflow-hidden">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8A]">
            Equipment Profile
          </span>
          <span className="text-xs bg-[#262626] text-white px-2.5 py-1 rounded-full border border-white/5 font-medium">
            {building} • Floor {floor}
          </span>
        </div>

        {/* Profile Card Main */}
        <div className="flex items-center gap-4 my-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#262626] to-[#0E0E0E] border border-white/10 flex items-center justify-center text-[#FF6A2B] shadow-inner">
            <Wrench className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white leading-snug">{modelName}</h3>
            <p className="text-xs text-[#8A8A8A] font-medium">{equipType} Series</p>
          </div>
        </div>

        {/* Stat: "Monthly Listeners" -> "Failures this year" */}
        <div className="mt-4 p-3.5 bg-[#262626] rounded-2xl border border-white/5 flex items-center justify-between">
          <div>
            <div className="text-xs text-[#8A8A8A]">Failures Recorded</div>
            <div className="text-xl font-light text-white flex items-baseline gap-1">
              <span>{failuresThisYear}</span>
              <span className="text-xs text-[#8A8A8A] font-normal">incidents this year</span>
            </div>
          </div>

          {/* "Subscribe" -> "Watch" pill button */}
          <button
            onClick={() => setIsWatching(!isWatching)}
            className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 ${
              isWatching
                ? 'bg-[#FF6A2B] text-white shadow-md shadow-[#FF6A2B]/30'
                : 'pill-button'
            }`}
          >
            {isWatching ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-[#1A1A1A]" />}
            <span>{isWatching ? 'Watching' : 'Watch Alerts'}</span>
          </button>
        </div>
      </div>

      {/* Expandable Spec detail */}
      <div className="mt-4 pt-3 border-t border-white/5">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between text-xs text-[#8A8A8A] hover:text-white font-medium"
        >
          <span>Asset Maintenance Specs</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {expanded && (
          <div className="mt-3 text-xs space-y-1.5 text-[#8A8A8A] bg-[#262626] p-3 rounded-xl">
            <div>• Rated Service Life: 15 Years</div>
            <div>• Last Preventive Service: 45 days ago</div>
            <div>• OEM Parts Vendor: Facility Direct Spares</div>
          </div>
        )}
      </div>
    </div>
  );
};
