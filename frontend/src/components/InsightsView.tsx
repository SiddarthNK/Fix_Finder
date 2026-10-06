import React, { useState, useEffect } from 'react';
import { BarChart3, AlertTriangle, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { fetchInsights } from '../api';

export const InsightsView: React.FC = () => {
  const [insightsData, setInsightsData] = useState<any>(null);

  useEffect(() => {
    fetchInsights().then(setInsightsData).catch(console.error);
  }, []);

  const buildingChartData = insightsData?.by_building
    ? Object.entries(insightsData.by_building).map(([k, v]) => ({ name: k, count: v }))
    : [];

  const equipmentChartData = insightsData?.by_equipment
    ? Object.entries(insightsData.by_equipment).map(([k, v]) => ({ name: k, count: v }))
    : [];

  return (
    <div className="p-6 md:p-8 max-w-[1500px] mx-auto space-y-6">
      {/* Header */}
      <div className="bento-card p-6">
        <div className="flex items-center gap-2 text-[#FF6A2B] font-bold text-lg mb-1">
          <BarChart3 className="w-5 h-5" />
          <span>Facility Analytics & Auto-Detected Patterns</span>
        </div>
        <p className="text-xs text-[#8A8A8A]">
          Automated cluster analysis identifying high-frequency failure patterns across campus facilities.
        </p>
      </div>

      {/* Pattern Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {insightsData?.pattern_alerts?.map((alert: any, idx: number) => (
          <div key={idx} className="bento-card p-6 border-l-4 border-l-[#FF6A2B] bg-[#212121]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-[#FF6A2B] font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Pattern Cluster Alert: {alert.building} ({alert.equipment})</span>
              </div>
              <span className="bg-[#FF6A2B] text-white text-xs px-2.5 py-0.5 rounded-full font-bold">
                {alert.count} Recurrences
              </span>
            </div>

            <p className="text-xs text-white/90 mb-3">
              High recurrence of <strong>{alert.equipment}</strong> issues in <strong>{alert.building}</strong>. Primary causes include: {alert.causes.slice(0, 2).join(', ')}.
            </p>

            <div className="text-[11px] text-[#8A8A8A] bg-[#262626] p-2.5 rounded-xl">
              <strong>Preventive Action:</strong> Schedule full coil flush & filter replacement audit.
            </div>
          </div>
        ))}
      </div>

      {/* Recharts Bar Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Building Distribution Chart */}
        <div className="bento-card p-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8A] mb-4">
            Complaints Distribution by Building
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={buildingChartData}>
                <XAxis dataKey="name" stroke="#8A8A8A" fontSize={11} tickLine={false} />
                <YAxis stroke="#8A8A8A" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#262626', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#FF6A2B" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Equipment Category Distribution Chart */}
        <div className="bento-card p-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8A] mb-4">
            Complaints Distribution by Equipment Category
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={equipmentChartData}>
                <XAxis dataKey="name" stroke="#8A8A8A" fontSize={11} tickLine={false} />
                <YAxis stroke="#8A8A8A" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#262626', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#FF8250" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
