import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Heart, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PipelineResult } from '../types';

interface PipelinePlayerCardProps {
  complaintText: string;
  setComplaintText: (text: string) => void;
  building: string;
  setBuilding: (b: string) => void;
  onRunDiagnosis: () => void;
  onRunBatch: () => void;
  onSaveVerified: () => void;
  result: PipelineResult | null;
  isRunning: boolean;
  activeNode: string | null;
  isNoPrecedent: boolean;
}

export const PipelinePlayerCard: React.FC<PipelinePlayerCardProps> = ({
  complaintText,
  setComplaintText,
  building,
  setBuilding,
  onRunDiagnosis,
  onRunBatch,
  onSaveVerified,
  result,
  isRunning,
  activeNode,
  isNoPrecedent
}) => {
  const [isSaved, setIsSaved] = useState(false);

  const matchedScores = result?.retrieval?.matched_cases?.map(c => Math.round(c.similarity_score * 100)) || [85, 72, 65, 48, 30];

  const handleHeartClick = () => {
    setIsSaved(!isSaved);
    if (!isSaved) onSaveVerified();
  };

  const getUrgencyClass = (urgency?: string) => {
    switch (urgency) {
      case 'P1': return 'bg-[#FF6A2B] text-white shadow-md shadow-[#FF6A2B]/40 font-bold';
      case 'P2': return 'border-2 border-[#FF6A2B] text-[#FF6A2B] font-bold';
      case 'P3': return 'bg-white/10 text-white border border-white/20';
      case 'P4': return 'bg-[#4A4A4A]/30 text-[#8A8A8A] border border-[#4A4A4A]';
      default: return 'bg-white/10 text-white';
    }
  };

  return (
    <div className="bento-card p-6 flex flex-col justify-between h-full bg-[#212121] relative overflow-hidden">
      {/* Top Header Controls */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF6A2B] animate-ping" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8A]">
              Pipeline Player Controls
            </span>
          </div>

          {/* Building Selector */}
          <select
            value={building}
            onChange={(e) => setBuilding(e.target.value)}
            className="bg-[#262626] text-xs font-medium text-white px-3 py-1.5 rounded-full border border-white/10 outline-none focus:border-[#FF6A2B]"
          >
            <option value="Building A">Building A</option>
            <option value="Building B">Building B</option>
            <option value="Building C">Building C</option>
            <option value="Building D">Building D</option>
          </select>
        </div>

        {/* Complaint Text Area / Title Input */}
        <div className="mb-4">
          <textarea
            value={complaintText}
            onChange={(e) => setComplaintText(e.target.value)}
            placeholder="Type free-text maintenance complaint..."
            className="w-full bg-[#262626] text-white placeholder-[#8A8A8A] text-sm p-3.5 rounded-2xl border border-white/5 outline-none focus:border-[#FF6A2B]/50 resize-none h-20 transition-all"
          />
        </div>

        {/* Waveform Bar Visualization of Similarity Scores */}
        <div className="my-4">
          <div className="flex items-center justify-between text-xs text-[#8A8A8A] mb-2 font-medium">
            <span>Precedent Similarity Waveform</span>
            <span>{result?.retrieval?.matched_cases?.length || 0} Matches</span>
          </div>

          <div className="h-10 flex items-end gap-1.5 bg-[#262626] p-2 rounded-2xl border border-white/5">
            {matchedScores.map((score, idx) => {
              const isMatched = score >= 30;
              return (
                <div key={idx} className="flex-1 flex flex-col justify-end items-center h-full group relative">
                  <div
                    style={{ height: `${score}%` }}
                    className={`w-full rounded-full transition-all duration-500 ${
                      isMatched
                        ? 'bg-[#FF6A2B] group-hover:bg-[#FF8250]'
                        : 'bg-[#4A4A4A]'
                    }`}
                  />
                  <div className="absolute -top-7 bg-[#0E0E0E] text-[10px] text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {score}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Refusal Warning State if score < threshold */}
      {isNoPrecedent && (
        <div className="my-2 p-3 bg-[#FF6A2B]/10 border border-[#FF6A2B]/30 rounded-2xl flex items-center gap-3 text-xs text-[#FF6A2B]">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <span className="font-bold">No Strong Precedent:</span> Top similarity fell below minimum 30% confidence cutoff. Refusing to guess.
          </div>
        </div>
      )}

      {/* Recommended Action Summary Badge */}
      {result?.recommendation && !isNoPrecedent && (
        <div className="my-2 p-3 bg-[#262626] rounded-2xl flex items-center justify-between border border-white/5 text-xs">
          <div>
            <div className="text-[#8A8A8A]">Est. Cost & Time</div>
            <div className="font-bold text-white text-sm">
              ₹{result.recommendation.median_cost_inr.toLocaleString()} • {result.recommendation.median_downtime_hrs} hrs
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs ${getUrgencyClass(result.recommendation.urgency)}`}>
            {result.recommendation.urgency}
          </div>
        </div>
      )}

      {/* Player Control Toolbar */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Shuffle (Batch Mode) */}
          <button
            onClick={onRunBatch}
            title="Batch Mode (Shuffle)"
            className="w-9 h-9 rounded-full bg-[#262626] hover:bg-[#FF6A2B]/20 flex items-center justify-center text-[#8A8A8A] hover:text-[#FF6A2B] transition-colors"
          >
            <Shuffle className="w-4 h-4" />
          </button>

          {/* Repeat (Re-run) */}
          <button
            onClick={onRunDiagnosis}
            title="Re-run Diagnosis"
            className="w-9 h-9 rounded-full bg-[#262626] hover:bg-[#FF6A2B]/20 flex items-center justify-center text-[#8A8A8A] hover:text-[#FF6A2B] transition-colors"
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* Main Play / Pause Button */}
        <button
          onClick={onRunDiagnosis}
          disabled={isRunning}
          className="w-14 h-14 rounded-full bg-white text-[#1A1A1A] flex items-center justify-center shadow-xl shadow-white/10 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          {isRunning ? (
            <div className="w-5 h-5 border-2 border-[#FF6A2B] border-t-transparent rounded-full animate-spin" />
          ) : (
            <Play className="w-6 h-6 text-[#FF6A2B] fill-[#FF6A2B] translate-x-0.5" />
          )}
        </button>

        <div className="flex items-center gap-2">
          {/* Heart (Save as Verified) */}
          <button
            onClick={handleHeartClick}
            title="Save as Verified Precedent"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              isSaved
                ? 'bg-[#FF6A2B] text-white shadow-md shadow-[#FF6A2B]/40'
                : 'bg-[#262626] text-[#8A8A8A] hover:text-[#FF6A2B]'
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
