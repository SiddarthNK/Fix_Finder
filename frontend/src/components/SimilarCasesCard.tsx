import React from 'react';
import { BookOpen, Play, ArrowRight } from 'lucide-react';
import { MatchedCase } from '../types';

interface SimilarCasesCardProps {
  cases: MatchedCase[];
  onOpenCase: (caseItem: MatchedCase) => void;
  onSeeAll: () => void;
}

export const SimilarCasesCard: React.FC<SimilarCasesCardProps> = ({
  cases,
  onOpenCase,
  onSeeAll
}) => {
  const displayCases = cases.slice(0, 4);

  return (
    <div className="bento-card p-6 flex flex-col justify-between h-full bg-[#212121]">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#FF6A2B]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8A]">
              Top Similar Cases
            </span>
          </div>

          <button
            onClick={onSeeAll}
            className="text-xs font-medium text-[#FF6A2B] hover:text-[#FF8250] flex items-center gap-1"
          >
            <span>See All</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Similar Cases List */}
        <div className="space-y-2.5 my-2">
          {displayCases.length === 0 ? (
            <div className="text-xs text-[#8A8A8A] py-6 text-center">
              No historical precedents loaded. Run a complaint diagnosis to retrieve similar cases.
            </div>
          ) : (
            displayCases.map((item) => {
              const scorePct = Math.round(item.similarity_score * 100);
              return (
                <div
                  key={item.case_id}
                  onClick={() => onOpenCase(item)}
                  className="p-3 bg-[#262626] hover:bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between gap-3 cursor-pointer group transition-all duration-200"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    {/* Thumbnail Case Badge */}
                    <div className="w-10 h-10 rounded-xl bg-[#0E0E0E] flex items-center justify-center font-mono text-xs font-bold text-[#FF6A2B] flex-shrink-0 border border-white/5">
                      {item.case_id.replace('CASE-', '#')}
                    </div>

                    <div className="overflow-hidden">
                      <div className="text-xs font-bold text-white truncate group-hover:text-[#FF6A2B] transition-colors">
                        {item.root_cause}
                      </div>
                      <div className="text-[11px] text-[#8A8A8A] truncate">
                        {item.building} • {item.equipment_type}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs font-bold text-[#FF6A2B] bg-[#FF6A2B]/10 px-2 py-0.5 rounded-full border border-[#FF6A2B]/20">
                      {scorePct}%
                    </span>
                    <div className="w-7 h-7 rounded-full bg-white/5 group-hover:bg-[#FF6A2B] flex items-center justify-center text-[#8A8A8A] group-hover:text-white transition-all">
                      <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
