import React from 'react';
import { Zap, LayoutGrid, ListOrdered, BookOpen, BarChart3, Clock, Settings } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  threshold: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, threshold }) => {
  const navItems = [
    { id: 'bento', label: 'Bento Dashboard', icon: LayoutGrid },
    { id: 'triage', label: 'Triage Queue', icon: ListOrdered },
    { id: 'library', label: 'Case Library', icon: BookOpen },
    { id: 'insights', label: 'Insights', icon: BarChart3 },
    { id: 'logs', label: 'Activity Log', icon: Clock },
  ];

  return (
    <header className="w-full bg-[#0E0E0E]/90 backdrop-blur-md border-b border-white/5 sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[#FF6A2B] flex items-center justify-center shadow-lg shadow-[#FF6A2B]/20">
          <Zap className="w-5 h-5 text-white fill-white" />
        </div>
        <div>
          <div className="font-extrabold text-lg text-white tracking-tight leading-none flex items-center gap-2">
            FixFinder <span className="text-xs bg-[#FF6A2B]/15 text-[#FF6A2B] px-2 py-0.5 rounded-full font-semibold border border-[#FF6A2B]/30">B3 Agent</span>
          </div>
          <p className="text-xs text-[#8A8A8A] mt-0.5">Facility Decision-Support System</p>
        </div>
      </div>

      {/* Navigation Pills */}
      <nav className="flex items-center bg-[#212121] p-1.5 rounded-full border border-white/5 shadow-inner">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-[#FF6A2B] text-white shadow-md shadow-[#FF6A2B]/30 scale-[1.02]'
                  : 'text-[#8A8A8A] hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Threshold Status Indicator */}
      <div className="hidden md:flex items-center gap-3">
        <div className="text-xs text-[#8A8A8A]">
          Confidence Cutoff: <span className="text-white font-bold">{Math.round(threshold * 100)}%</span>
        </div>
        <div className="w-2 h-2 rounded-full bg-[#FF6A2B] animate-pulse"></div>
      </div>
    </header>
  );
};
