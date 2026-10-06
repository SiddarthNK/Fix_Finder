import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Filter } from 'lucide-react';
import { fetchCases } from '../api';
import { MatchedCase } from '../types';

export const CaseLibraryView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedEquip, setSelectedEquip] = useState('All');
  const [cases, setCases] = useState<MatchedCase[]>([]);
  const [loading, setLoading] = useState(false);

  const equipmentTypes = ['All', 'AC', 'Generator', 'Elevator', 'Water Pump', 'UPS', 'Projector', 'Electrical Panel'];

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchCases(query, selectedEquip);
      setCases(res.cases || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => loadData(), 200);
    return () => clearTimeout(timer);
  }, [query, selectedEquip]);

  return (
    <div className="p-6 md:p-8 max-w-[1500px] mx-auto space-y-6">
      {/* Header & Controls */}
      <div className="bento-card p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#FF6A2B] font-bold text-lg mb-1">
              <BookOpen className="w-5 h-5" />
              <span>Historical Case Knowledge Base ({cases.length} active)</span>
            </div>
            <p className="text-xs text-[#8A8A8A]">
              Search 250+ synthetic & technician-confirmed historical maintenance precedent records.
            </p>
          </div>

          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 text-[#8A8A8A] absolute left-3.5 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search cause, complaint, or model..."
              className="w-full bg-[#262626] text-xs text-white placeholder-[#8A8A8A] pl-10 pr-4 py-2.5 rounded-full border border-white/10 outline-none focus:border-[#FF6A2B]"
            />
          </div>
        </div>

        {/* Equipment Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2">
          {equipmentTypes.map(equip => (
            <button
              key={equip}
              onClick={() => setSelectedEquip(equip)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedEquip === equip
                  ? 'bg-[#FF6A2B] text-white shadow-md shadow-[#FF6A2B]/30'
                  : 'bg-[#262626] text-[#8A8A8A] hover:text-white hover:bg-white/5'
              }`}
            >
              {equip}
            </button>
          ))}
        </div>
      </div>

      {/* Case Table */}
      <div className="bento-card p-6 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-[#8A8A8A] font-semibold uppercase tracking-wider">
              <th className="py-3 px-4">Case ID</th>
              <th className="py-3 px-4">Building</th>
              <th className="py-3 px-4">Equipment & Model</th>
              <th className="py-3 px-4">Complaint Text</th>
              <th className="py-3 px-4">Diagnosed Cause</th>
              <th className="py-3 px-4">Cost (INR)</th>
              <th className="py-3 px-4">Urgency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-white">
            {cases.map((c) => (
              <tr key={c.case_id} className="hover:bg-white/5 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-[#FF6A2B]">{c.case_id}</td>
                <td className="py-3.5 px-4 font-medium">{c.building}</td>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-white">{c.equipment_type}</div>
                  <div className="text-[10px] text-[#8A8A8A]">{c.model}</div>
                </td>
                <td className="py-3.5 px-4 max-w-xs truncate text-[#8A8A8A]">{c.complaint_text}</td>
                <td className="py-3.5 px-4 font-medium text-white">{c.root_cause}</td>
                <td className="py-3.5 px-4 font-bold text-[#FF6A2B]">₹{c.cost_inr.toLocaleString()}</td>
                <td className="py-3.5 px-4">
                  <span className="bg-[#262626] text-white px-2.5 py-1 rounded-full border border-white/10 font-bold">
                    {c.urgency}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
