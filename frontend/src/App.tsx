import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DemoBanner } from './components/DemoBanner';
import { BentoHomeView } from './components/BentoHomeView';
import { TriageQueueView } from './components/TriageQueueView';
import { CaseLibraryView } from './components/CaseLibraryView';
import { InsightsView } from './components/InsightsView';
import { ActivityLogView } from './components/ActivityLogView';
import { FeedbackModal } from './components/FeedbackModal';
import { streamDiagnose, fetchSettings, updateSettingsApi } from './api';
import { PipelineResult, MatchedCase, SettingsModel, SSEEvent } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('bento');
  const [complaintText, setComplaintText] = useState('AC in room 204 is leaking water heavily onto desk and making rattling sound.');
  const [building, setBuilding] = useState('Building A');
  const [floor, setFloor] = useState(2);

  const [result, setResult] = useState<PipelineResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [isNoPrecedent, setIsNoPrecedent] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const [settings, setSettings] = useState<SettingsModel>({
    similarity_threshold: 0.30,
    auto_escalate: true,
    theme: 'dark',
    local_only: true
  });

  useEffect(() => {
    fetchSettings().then(setSettings).catch(console.error);
  }, []);

  const handleUpdateSettings = async (newSettings: Partial<SettingsModel>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    try {
      await updateSettingsApi(updated);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRunDiagnosis = () => {
    if (!complaintText.trim()) return;

    setIsRunning(true);
    setActiveNode('intake');
    setIsNoPrecedent(false);

    streamDiagnose(
      complaintText,
      building,
      floor,
      (evt: SSEEvent) => {
        if (evt.event === 'node_start') {
          setActiveNode(evt.node || null);
        } else if (evt.event === 'pipeline_complete' && evt.result) {
          setResult(evt.result);
          setIsRunning(false);
          setActiveNode(null);
          if (evt.result.diagnosis.is_no_precedent) {
            setIsNoPrecedent(true);
          }
        }
      },
      (err) => {
        console.error('Diagnosis Error:', err);
        setIsRunning(false);
        setActiveNode(null);
      }
    );
  };

  const handleSelectDemo = (demoId: number) => {
    setActiveTab('bento');

    if (demoId === 1) {
      // 1. Clear AC complaint
      setBuilding('Building A');
      setComplaintText('AC in room 204 is leaking water heavily onto desk and making rattling sound.');
      setTimeout(() => handleRunDiagnosis(), 100);
    } else if (demoId === 2) {
      // 2. Vague complaint
      setBuilding('Building A');
      setComplaintText('machine making weird sound in room 102 plzz fix fast');
      setTimeout(() => handleRunDiagnosis(), 100);
    } else if (demoId === 3) {
      // 3. No precedent refusal
      setBuilding('Building B');
      setComplaintText('Quantum refrigeration plasma conduit emitting sub-zero frost spikes');
      setTimeout(() => handleRunDiagnosis(), 100);
    } else if (demoId === 4) {
      // 4. Tech feedback demo
      setBuilding('Building B');
      setComplaintText('Extremely weird squeaking sound in cryogenic freezer pump 99');
      handleRunDiagnosis();
      setTimeout(() => setFeedbackOpen(true), 1200);
    } else if (demoId === 5) {
      // 5. Batch triage
      setActiveTab('triage');
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white flex flex-col font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        threshold={settings.similarity_threshold}
      />

      <DemoBanner onSelectDemo={handleSelectDemo} />

      <main className="flex-1 overflow-y-auto">
        {activeTab === 'bento' && (
          <BentoHomeView
            complaintText={complaintText}
            setComplaintText={setComplaintText}
            building={building}
            setBuilding={setBuilding}
            onRunDiagnosis={handleRunDiagnosis}
            onRunBatch={() => setActiveTab('triage')}
            onSaveVerified={() => alert('Case saved as verified precedent!')}
            onOpenCase={() => setActiveTab('library')}
            onSeeAllCases={() => setActiveTab('library')}
            result={result}
            isRunning={isRunning}
            activeNode={activeNode}
            isNoPrecedent={isNoPrecedent}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onOpenFeedback={() => setFeedbackOpen(true)}
          />
        )}

        {activeTab === 'triage' && (
          <TriageQueueView
            onInspectComplaint={(text, b) => {
              setComplaintText(text);
              setBuilding(b);
              setActiveTab('bento');
              setTimeout(() => handleRunDiagnosis(), 100);
            }}
          />
        )}

        {activeTab === 'library' && <CaseLibraryView />}
        {activeTab === 'insights' && <InsightsView />}
        {activeTab === 'logs' && <ActivityLogView />}
      </main>

      <FeedbackModal
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        complaintText={complaintText}
        building={building}
        equipmentType={result?.intake?.equipment_type || 'AC'}
        onFeedbackSaved={() => {
          alert('✅ Feedback saved! Re-running diagnosis to demonstrate instant Chroma embedding learning...');
          handleRunDiagnosis();
        }}
      />
    </div>
  );
};
