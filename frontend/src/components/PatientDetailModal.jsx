import { X, Heart, Wind, Gauge, MapPin, BedDouble, Building2, User, Stethoscope } from 'lucide-react';
import { conditionColor } from '../utils/helpers';

/**
 * PatientDetailModal — shown when clicking a patient-related alert.
 * Displays ward, room, bed, vitals, and diagnosis info.
 */
export default function PatientDetailModal({ patient, onClose }) {
  if (!patient) return null;

  const cond = (patient.condition || patient.status || 'stable').toLowerCase();
  const condLabel = cond.charAt(0).toUpperCase() + cond.slice(1);

  const badgeClass =
    cond === 'critical'
      ? 'bg-red-500/20 text-red-400 border-red-500/30'
      : cond === 'moderate' || cond === 'warning'
      ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      {/* Card */}
      <div
        className="relative w-[95%] max-w-md rounded-2xl shadow-2xl overflow-hidden animate-slide-up"
        style={{
          background: 'linear-gradient(135deg, #1a2332 0%, #0f1923 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-white/5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/20 flex items-center justify-center">
                <User className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{patient.name}</h2>
                <p className="text-xs text-slate-400">
                  {patient.age} yrs · {patient.gender || '—'} · ID: {patient.patient_id || patient.patientId || '—'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Condition badge */}
          <div className="mt-3 flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badgeClass}`}>
              {condLabel}
            </span>
            {patient.diagnosis && (
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                <Stethoscope className="w-3 h-3" /> {patient.diagnosis}
              </span>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="px-6 py-4 border-b border-white/5">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-3">Location</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <Building2 className="w-4 h-4 text-sky-400 mx-auto mb-1" />
              <p className="text-sm font-bold text-white">{patient.ward || '—'}</p>
              <p className="text-[10px] text-slate-500">Ward</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <MapPin className="w-4 h-4 text-violet-400 mx-auto mb-1" />
              <p className="text-sm font-bold text-white">{patient.room_number || patient.roomNumber || '—'}</p>
              <p className="text-[10px] text-slate-500">Room</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <BedDouble className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <p className="text-sm font-bold text-white">{patient.bed || '—'}</p>
              <p className="text-[10px] text-slate-500">Bed</p>
            </div>
          </div>
          {patient.floor && (
            <p className="text-[11px] text-slate-500 mt-2 text-center">{patient.floor}</p>
          )}
        </div>

        {/* Vitals */}
        <div className="px-6 py-4">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-3">Current Vitals</p>
          <div className="grid grid-cols-2 gap-3">
            {/* Heart Rate */}
            <div className="bg-white/5 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <Heart className="w-3.5 h-3.5 text-red-400" />
                <span className="text-[10px] text-slate-500 uppercase">Heart Rate</span>
              </div>
              <p className={`text-xl font-bold ${
                (patient.heart_rate || 0) > 120 ? 'text-red-400'
                : (patient.heart_rate || 0) > 100 ? 'text-amber-400'
                : 'text-emerald-400'
              }`}>
                {patient.heart_rate ?? '—'} <span className="text-xs font-normal text-slate-500">bpm</span>
              </p>
            </div>

            {/* SpO2 */}
            <div className="bg-white/5 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <Wind className="w-3.5 h-3.5 text-sky-400" />
                <span className="text-[10px] text-slate-500 uppercase">SpO₂</span>
              </div>
              <p className={`text-xl font-bold ${
                (patient.oxygen_level || 100) < 90 ? 'text-red-400'
                : (patient.oxygen_level || 100) < 94 ? 'text-amber-400'
                : 'text-emerald-400'
              }`}>
                {patient.oxygen_level ?? '—'}<span className="text-xs font-normal text-slate-500">%</span>
              </p>
            </div>

            {/* Blood Pressure */}
            <div className="bg-white/5 rounded-xl p-3 col-span-2">
              <div className="flex items-center gap-2 mb-1">
                <Gauge className="w-3.5 h-3.5 text-violet-400" />
                <span className="text-[10px] text-slate-500 uppercase">Blood Pressure</span>
              </div>
              <p className="text-xl font-bold text-white">
                {patient.bp_systolic ?? '—'}/{patient.bp_diastolic ?? '—'}
                <span className="text-xs font-normal text-slate-500 ml-1">mmHg</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
