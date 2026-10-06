import { SSEEvent, PipelineResult, SettingsModel, ActivityLogItem } from './types';

const API_BASE = '/api';

export function streamDiagnose(
  complaintText: string,
  building: string,
  floor: number,
  onEvent: (evt: SSEEvent) => void,
  onError: (err: any) => void
) {
  fetch(`${API_BASE}/diagnose`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ complaint_text: complaintText, building, floor })
  })
  .then(response => {
    if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
    const reader = response.body?.getReader();
    if (!reader) throw new Error('ReadableStream not supported');

    const decoder = new TextDecoder();
    let buffer = '';

    function read() {
      reader?.read().then(({ done, value }) => {
        if (done) return;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;
          const dataLine = line.split('\n').find(l => l.startsWith('data: '));
          if (dataLine) {
            try {
              const jsonStr = dataLine.replace('data: ', '');
              const parsed: SSEEvent = JSON.parse(jsonStr);
              onEvent(parsed);
            } catch (e) {
              console.error('Failed to parse SSE event JSON:', e);
            }
          }
        }
        read();
      }).catch(onError);
    }
    read();
  })
  .catch(onError);
}

export async function submitFeedback(payload: {
  complaint_text: string;
  confirmed: boolean;
  real_cause?: string;
  building?: string;
  equipment_type?: string;
  cost_inr?: number;
  downtime_hrs?: number;
  fix_steps?: string[];
}) {
  const res = await fetch(`${API_BASE}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function runBatchTriage(complaints: { complaint_text: string; building?: string; floor?: number }[]) {
  const res = await fetch(`${API_BASE}/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ complaints })
  });
  return res.json();
}

export async function fetchCases(query = '', equipment = 'All') {
  const res = await fetch(`${API_BASE}/cases?query=${encodeURIComponent(query)}&equipment=${encodeURIComponent(equipment)}`);
  return res.json();
}

export async function fetchInsights() {
  const res = await fetch(`${API_BASE}/insights`);
  return res.json();
}

export async function fetchLogs(): Promise<{ logs: ActivityLogItem[] }> {
  const res = await fetch(`${API_BASE}/log`);
  return res.json();
}

export async function fetchSettings(): Promise<SettingsModel> {
  const res = await fetch(`${API_BASE}/settings`);
  return res.json();
}

export async function updateSettingsApi(settings: SettingsModel): Promise<{ settings: SettingsModel }> {
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings)
  });
  return res.json();
}
