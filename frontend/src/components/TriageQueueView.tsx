import React, { useState, useEffect } from 'react';
import { ListOrdered, Play, RefreshCw, Zap } from 'lucide-react';
import { runBatchTriage } from '../api';

interface TriageQueueViewProps {
  onInspectComplaint: (complaint: string, building: string) => void;
}

export const TriageQueueView: React.FC<TriageQueueViewProps> = ({ onInspectComplaint }) => {
  const [loading, setLoading] = useState(false);
  const [triageItems, setTriageItems] = useState<any[]>([]);

  const sampleBatch = [
    { complaint_text: "Server room AC unit B humming loudly and temperature rising to 32C", building: "Building A" },
    { complaint_text: "Elevator B doors closing rapidly trapping passengers and ignoring sensor", building: "Building C" },
    { complaint_text: "Water pump making loud screeching bearing noise in basement", building: "Building B" },
    { complaint_text: "Breakroom sink faucet dripping steadily", building: "Building D" }
  ];

  const loadBatch = async () => {
    setLoading(true);
    try {
      const data = await runBatchTriage(sampleBatch);
      setTriageItems(data.triage_queue || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBatch();
  }, []);

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'P1': return 'bg-[#FF6A2B] text-white shadow-md shadow-[#FF6A2B]/40 font-bold';
      case 'P2': return 'border-2 border-[#FF6A2B] text-[#FF6A2B] font-bold';
      case 'P3': return 'bg-white/10 text-white border border-white/20';
      default: return 'bg-[#4A4A4A]/30 text-[#8A8A8A]';
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto space-y-6">
      <div className="bento-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#FF6A2B] font-bold text-lg mb-1">
            <ListOrdered className="w-5 h-5" />
            <span>Automated Triage Queue</span>
          </div>
          <p className="text-xs text-[#8A8A8A]">
            Incoming complaints auto-sorted by calculated urgency rating (P1 Critical top down to P4 Low).
          </p>
        </div>

        <button
          onClick={loadBatch}
          disabled={loading}
          className="pill-button px-5 py-2.5 flex items-center gap-2 text-xs shadow-lg hover:scale-105"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Diagnosing Batch...' : 'Re-run Batch Triage (3+)'}</span>
        </button>
      </div>

      {/* Triage Queue Table */}
      <div className="bento-card p-6 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-[#8A8A8A] font-semibold uppercase tracking-wider">
              <th className="py-3 px-4">Urgency</th>
              <th className="py-3 px-4">Building</th>
              <th className="py-3 px-4">Complaint Description</th>
              <th className="py-3 px-4">Equipment</th>
              <th className="py-3 px-4">Diagnosed Cause</th>
              <th className="py-3 px-4">Est. Cost</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-white">
            {triageItems.map((item, idx) => (
              <tr key={idx} className="hover:bg-white/5 transition-colors">
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs ${getUrgencyBadge(item.urgency)}`}>
                    {item.urgency}
                  </span>
                </td>
                <td className="py-4 px-4 font-bold text-white">{item.building}</td>
                <td className="py-4 px-4 max-w-xs truncate text-[#8A8A8A]">{item.complaint}</td>
                <td className="py-4 px-4">
                  <span className="bg-[#262626] text-white px-2.5 py-1 rounded-full font-medium border border-white/5">
                    {item.equipment_type}
                  </span>
                </td>
                <td className="py-4 px-4 font-medium">{item.cause}</td>
                <td className="py-4 px-4 text-[#FF6A2B] font-bold">₹{item.cost_inr.toLocaleString()}</td>
                <td className="py-4 px-4 text-right">
                  <button
                    onClick={() => onInspectComplaint(item.complaint, item.building)}
                    className="p-2 rounded-full bg-[#262626] hover:bg-[#FF6A2B] text-[#8A8A8A] hover:text-white transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
