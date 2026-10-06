import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import { fetchLogs } from '../api';
import { ActivityLogItem } from '../types';

export const ActivityLogView: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);

  useEffect(() => {
    fetchLogs().then(res => setLogs(res.logs || [])).catch(console.error);
  }, []);

  return (
    <div className="p-6 md:p-8 max-w-[1500px] mx-auto space-y-6">
      <div className="bento-card p-6">
        <div className="flex items-center gap-2 text-[#FF6A2B] font-bold text-lg mb-1">
          <Clock className="w-5 h-5" />
          <span>Agent Activity Audit Log</span>
        </div>
        <p className="text-xs text-[#8A8A8A]">
          Complete timestamped audit log of agent node executions, vector searches, and technician confirmations.
        </p>
      </div>

      <div className="bento-card p-6 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-[#8A8A8A] font-semibold uppercase tracking-wider">
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Agent Name</th>
              <th className="py-3 px-4">Building</th>
              <th className="py-3 px-4">Complaint</th>
              <th className="py-3 px-4">Diagnosed Cause</th>
              <th className="py-3 px-4">Citations</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-white">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-white/5 transition-colors">
                <td className="py-3.5 px-4 text-[#8A8A8A] font-mono">{log.timestamp}</td>
                <td className="py-3.5 px-4 font-bold text-white">{log.agent_name}</td>
                <td className="py-3.5 px-4">{log.building}</td>
                <td className="py-3.5 px-4 max-w-xs truncate text-[#8A8A8A]">{log.complaint_text}</td>
                <td className="py-3.5 px-4 font-medium text-white">{log.diagnosed_cause}</td>
                <td className="py-3.5 px-4 font-mono text-[#FF6A2B]">{log.cited_case_ids}</td>
                <td className="py-3.5 px-4">
                  <span className="bg-[#FF6A2B]/15 text-[#FF6A2B] px-2.5 py-1 rounded-full border border-[#FF6A2B]/30 font-semibold text-[11px]">
                    {log.status}
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
