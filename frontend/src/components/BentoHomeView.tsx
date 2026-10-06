import React from 'react';
import { ReasoningLyricsCard } from './ReasoningLyricsCard';
import { PipelinePlayerCard } from './PipelinePlayerCard';
import { EquipmentProfileCard } from './EquipmentProfileCard';
import { SimilarCasesCard } from './SimilarCasesCard';
import { StatsDowntimeCard } from './StatsDowntimeCard';
import { PatternAlertCard } from './PatternAlertCard';
import { SettingsCard } from './SettingsCard';
import { PipelineResult, MatchedCase, SettingsModel } from '../types';

interface BentoHomeViewProps {
  complaintText: string;
  setComplaintText: (text: string) => void;
  building: string;
  setBuilding: (b: string) => void;
  onRunDiagnosis: () => void;
  onRunBatch: () => void;
  onSaveVerified: () => void;
  onOpenCase: (caseItem: MatchedCase) => void;
  onSeeAllCases: () => void;
  result: PipelineResult | null;
  isRunning: boolean;
  activeNode: string | null;
  isNoPrecedent: boolean;
  settings: SettingsModel;
  onUpdateSettings: (newSettings: Partial<SettingsModel>) => void;
  onOpenFeedback: () => void;
}

export const BentoHomeView: React.FC<BentoHomeViewProps> = ({
  complaintText,
  setComplaintText,
  building,
  setBuilding,
  onRunDiagnosis,
  onRunBatch,
  onSaveVerified,
  onOpenCase,
  onSeeAllCases,
  result,
  isRunning,
  activeNode,
  isNoPrecedent,
  settings,
  onUpdateSettings,
  onOpenFeedback
}) => {
  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Top Banner Action Bar for Feedback Loop */}
      {result?.diagnosis && (
        <div className="bg-[#212121] p-4 rounded-3xl border border-white/5 flex items-center justify-between gap-4">
          <div className="text-xs text-white">
            <span className="text-[#8A8A8A]">Diagnosed: </span>
            <span className="font-bold text-[#FF6A2B]">{result.diagnosis.likely_causes[0]?.cause || 'Uncertain'}</span>
            <span className="text-[#8A8A8A] ml-2">({result.intake.building})</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#8A8A8A]">Technician Feedback:</span>
            <button
              onClick={onOpenFeedback}
              className="pill-button text-xs px-4 py-1.5 shadow-md hover:scale-105"
            >
              Verify / Correct Diagnosis
            </button>
          </div>
        </div>
      )}

      {/* 3-Column Bento Masonry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* ROW 1: Player (Main), Lyrics (Reasoning), Equipment Profile */}
        <div className="h-[440px]">
          <PipelinePlayerCard
            complaintText={complaintText}
            setComplaintText={setComplaintText}
            building={building}
            setBuilding={setBuilding}
            onRunDiagnosis={onRunDiagnosis}
            onRunBatch={onRunBatch}
            onSaveVerified={onSaveVerified}
            result={result}
            isRunning={isRunning}
            activeNode={activeNode}
            isNoPrecedent={isNoPrecedent}
          />
        </div>

        <div className="h-[440px]">
          <ReasoningLyricsCard
            result={result}
            activeNode={activeNode}
            isNoPrecedent={isNoPrecedent}
          />
        </div>

        <div className="h-[440px]">
          <EquipmentProfileCard intake={result?.intake} />
        </div>

        {/* ROW 2: Similar Cases, Stats / Downtime, Pattern Alert */}
        <div className="h-[360px]">
          <SimilarCasesCard
            cases={result?.retrieval?.matched_cases || []}
            onOpenCase={onOpenCase}
            onSeeAll={onSeeAllCases}
          />
        </div>

        <div className="h-[360px]">
          <StatsDowntimeCard downtimeHrsAvoided={result?.recommendation?.median_downtime_hrs || 24.5} />
        </div>

        <div className="h-[360px]">
          <PatternAlertCard />
        </div>

        {/* ROW 3: Settings Widget (Span 1 Column or Full) */}
        <div className="h-[320px] lg:col-span-1">
          <SettingsCard
            settings={settings}
            onUpdateSettings={onUpdateSettings}
          />
        </div>
      </div>
    </div>
  );
};
