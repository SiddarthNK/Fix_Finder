import React, { useState } from 'react';
import { X, CheckCircle, AlertTriangle } from 'lucide-react';
import { submitFeedback } from '../api';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaintText: string;
  building: string;
  equipmentType: string;
  onFeedbackSaved: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  complaintText,
  building,
  equipmentType,
  onFeedbackSaved
}) => {
  if (!isOpen) return null;

  const [confirmed, setConfirmed] = useState(true);
  const [realCause, setRealCause] = useState('');
  const [costInr, setCostInr] = useState(3500);
  const [downtimeHrs, setDowntimeHrs] = useState(2.0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitFeedback({
        complaint_text: complaintText,
        confirmed: confirmed,
        real_cause: confirmed ? undefined : realCause,
        building: building,
        equipment_type: equipmentType,
        cost_inr: costInr,
        downtime_hrs: downtimeHrs
      });

      onFeedbackSaved();
      onClose();
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#212121] border border-white/10 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#8A8A8A] hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-white mb-2">Technician Feedback Loop</h3>
        <p className="text-xs text-[#8A8A8A] mb-4">
          Confirming or correcting this diagnosis immediately embeds the true record into ChromaDB for active learning.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#8A8A8A] mb-1 font-semibold">Complaint</label>
            <div className="bg-[#262626] text-white p-3 rounded-2xl border border-white/5 font-medium">
              "{complaintText}"
            </div>
          </div>

          <div className="flex gap-3 my-3">
            <button
              type="button"
              onClick={() => setConfirmed(true)}
              className={`flex-1 py-2.5 rounded-full font-bold transition-all ${
                confirmed
                  ? 'bg-[#FF6A2B] text-white shadow-md shadow-[#FF6A2B]/30'
                  : 'bg-[#262626] text-[#8A8A8A] hover:text-white'
              }`}
            >
              <CheckCircle className="w-4 h-4 inline mr-1" />
              Confirm Diagnosis
            </button>

            <button
              type="button"
              onClick={() => setConfirmed(false)}
              className={`flex-1 py-2.5 rounded-full font-bold transition-all ${
                !confirmed
                  ? 'bg-[#FF6A2B] text-white shadow-md shadow-[#FF6A2B]/30'
                  : 'bg-[#262626] text-[#8A8A8A] hover:text-white'
              }`}
            >
              <AlertTriangle className="w-4 h-4 inline mr-1" />
              Correct / Enter Real Cause
            </button>
          </div>

          {!confirmed && (
            <div>
              <label className="block text-[#8A8A8A] mb-1 font-semibold">True Diagnosed Root Cause *</label>
              <input
                type="text"
                value={realCause}
                onChange={(e) => setRealCause(e.target.value)}
                placeholder="e.g. Cryogenic seals friction imbalance"
                required
                className="w-full bg-[#262626] text-white p-3 rounded-2xl border border-white/10 outline-none focus:border-[#FF6A2B]"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#8A8A8A] mb-1 font-semibold">Actual Repair Cost (INR)</label>
              <input
                type="number"
                value={costInr}
                onChange={(e) => setCostInr(parseFloat(e.target.value))}
                className="w-full bg-[#262626] text-white p-3 rounded-2xl border border-white/10 outline-none focus:border-[#FF6A2B]"
              />
            </div>

            <div>
              <label className="block text-[#8A8A8A] mb-1 font-semibold">Downtime (Hours)</label>
              <input
                type="number"
                step="0.5"
                value={downtimeHrs}
                onChange={(e) => setDowntimeHrs(parseFloat(e.target.value))}
                className="w-full bg-[#262626] text-white p-3 rounded-2xl border border-white/10 outline-none focus:border-[#FF6A2B]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-[#262626] text-[#8A8A8A] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="pill-button px-5 py-2 text-xs shadow-lg hover:scale-105"
            >
              {submitting ? 'Embeding in ChromaDB...' : 'Save & Re-Diagnose'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
