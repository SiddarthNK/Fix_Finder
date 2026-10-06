import React, { useState } from 'react';
import { Maximize2, Share2, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { PipelineResult } from '../types';

interface ReasoningLyricsCardProps {
  result: PipelineResult | null;
  activeNode: string | null;
  isNoPrecedent: boolean;
}

export const ReasoningLyricsCard: React.FC<ReasoningLyricsCardProps> = ({
  result,
  activeNode,
  isNoPrecedent
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (!result) return;
    const text = `[FixFinder Maintenance Diagnosis Report]\nBuilding: ${result.intake.building}\nEquipment: ${result.intake.equipment_type}\nDiagnosis: ${result.diagnosis.plain_summary}\nUrgency: ${result.recommendation?.urgency || 'N/A'}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLines = () => {
    if (!result) {
      return [
        { text: 'Awaiting complaint input...', stage: 'idle' },
        { text: 'Intake Agent will parse equipment & symptoms', stage: 'intake' },
        { text: 'Retrieval Agent will query vector database for precedents', stage: 'retrieval' },
        { text: 'Diagnosis Agent will evaluate confidence threshold', stage: 'diagnosis' },
        { text: 'Recommendation Agent will compute fix steps & cost medians', stage: 'recommendation' }
      ];
    }

    if (isNoPrecedent) {
      return [
        { text: `Intake detected ${result.intake.equipment_type} in ${result.intake.building}`, stage: 'intake' },
        { text: `Retrieved ${result.retrieval.matched_cases.length} candidates from ChromaDB`, stage: 'retrieval' },
        { text: `Highest similarity score is ${Math.round((result.retrieval.matched_cases[0]?.similarity_score || 0)*100)}%`, stage: 'diagnosis' },
        { text: '❌ SCORE BELOW CONFIDENCE THRESHOLD (30%)', stage: 'diagnosis' },
        { text: '⚠️ "No Strong Precedent" - Refusing to guess false diagnosis.', stage: 'diagnosis' }
      ];
    }

    const diag = result.diagnosis;
    const rec = result.recommendation;
    const topCause = diag.likely_causes[0];

    return [
      { text: `1. Intake: Identified ${result.intake.equipment_type} (Floor ${result.intake.floor}, ${result.intake.building})`, stage: 'intake' },
      { text: `2. Retrieval: Matched ${result.retrieval.matched_cases.length} cases from ChromaDB library`, stage: 'retrieval' },
      { text: `3. Diagnosis: Primary cause "${topCause?.cause}" (${Math.round((topCause?.confidence || 0)*100)}% match)`, stage: 'diagnosis' },
      { text: `4. Citations: Derived from case IDs ${topCause?.supporting_cases.join(', ')}`, stage: 'diagnosis' },
      { text: `5. Recommendation: Fix estimated at ${rec?.median_cost_inr ? '₹' + rec.median_cost_inr.toLocaleString() : 'N/A'} (${rec?.urgency} Urgency)`, stage: 'recommendation' },
      { text: `6. Rationale: ${rec?.urgency_reason || 'Standard precedence match.'}`, stage: 'recommendation' }
    ];
  };

  const lines = getLines();

  return (
    <div className="bento-card p-6 flex flex-col justify-between h-full relative group">
      <div>
        {/* Header bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#FF6A2B]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8A]">
              Agent Reasoning Lyrics
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              title="Share Report"
              className="w-8 h-8 rounded-full bg-[#262626] hover:bg-[#FF6A2B]/20 flex items-center justify-center text-[#8A8A8A] hover:text-[#FF6A2B] transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Lyrics lines */}
        <div className="space-y-3 my-2 max-h-[260px] overflow-y-auto pr-2">
          {lines.map((line, idx) => {
            const isActive = activeNode === line.stage || (!activeNode && result && idx === lines.length - 1);
            return (
              <div
                key={idx}
                className={`text-sm font-medium transition-all duration-300 leading-snug flex items-start gap-2 ${
                  isActive
                    ? 'text-[#FF6A2B] text-base font-bold scale-[1.01]'
                    : 'text-[#8A8A8A] opacity-70 hover:opacity-100'
                }`}
              >
                <span className="text-xs mt-1 text-[#4A4A4A] select-none">•</span>
                <span>{line.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      {copied && (
        <div className="absolute bottom-4 right-4 bg-[#FF6A2B] text-white text-xs px-3 py-1 rounded-full shadow-lg animate-bounce">
          Report Copied to Clipboard!
        </div>
      )}

      {/* Summary Footer */}
      {result?.diagnosis?.plain_summary && (
        <div className="mt-4 pt-3 border-t border-white/5 text-xs text-[#8A8A8A] italic">
          "{result.diagnosis.plain_summary}"
        </div>
      )}
    </div>
  );
};
