import React from 'react';
import { Settings, Sliders, Shield, Zap } from 'lucide-react';
import { SettingsModel } from '../types';

interface SettingsCardProps {
  settings: SettingsModel;
  onUpdateSettings: (newSettings: Partial<SettingsModel>) => void;
}

export const SettingsCard: React.FC<SettingsCardProps> = ({
  settings,
  onUpdateSettings
}) => {
  return (
    <div className="bento-card p-6 flex flex-col justify-between h-full bg-[#212121]">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#FF6A2B]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8A]">
              Agent Configuration
            </span>
          </div>
        </div>

        {/* 1. Similarity Threshold Slider */}
        <div className="mb-5 bg-[#262626] p-4 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-white font-medium flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#FF6A2B]" />
              Similarity Cutoff
            </span>
            <span className="font-bold text-[#FF6A2B]">{Math.round(settings.similarity_threshold * 100)}%</span>
          </div>

          <input
            type="range"
            min="0.15"
            max="0.60"
            step="0.05"
            value={settings.similarity_threshold}
            onChange={(e) => onUpdateSettings({ similarity_threshold: parseFloat(e.target.value) })}
            className="w-full accent-[#FF6A2B] bg-[#0E0E0E] h-2 rounded-lg cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-[#8A8A8A] mt-1.5 font-medium">
            <span>Low (Lenient)</span>
            <span>Default (30%)</span>
            <span>High (Strict)</span>
          </div>
        </div>

        {/* 2. Auto-Escalate Toggle */}
        <div className="mb-3 bg-[#262626] p-3.5 rounded-2xl border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-[#FF6A2B]" />
            <div>
              <div className="text-xs font-bold text-white">Auto-Escalate Urgency</div>
              <div className="text-[10px] text-[#8A8A8A]">Safety equipment & recurrences</div>
            </div>
          </div>

          <button
            onClick={() => onUpdateSettings({ auto_escalate: !settings.auto_escalate })}
            className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${
              settings.auto_escalate ? 'bg-[#FF6A2B]' : 'bg-[#4A4A4A]'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                settings.auto_escalate ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* 3. Local-Only Fallback Toggle */}
        <div className="bg-[#262626] p-3.5 rounded-2xl border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-[#FF6A2B]" />
            <div>
              <div className="text-xs font-bold text-white">Deterministic Fallback</div>
              <div className="text-[10px] text-[#8A8A8A]">Guaranteed demo safety</div>
            </div>
          </div>

          <button
            onClick={() => onUpdateSettings({ local_only: !settings.local_only })}
            className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${
              settings.local_only ? 'bg-[#FF6A2B]' : 'bg-[#4A4A4A]'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                settings.local_only ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
