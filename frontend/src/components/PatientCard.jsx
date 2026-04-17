import { Heart, Droplets, AlertTriangle } from 'lucide-react';
import { conditionColor } from '../utils/helpers';

export default function PatientCard({ patient }) {
  const {
    name = 'Unknown',
    age,
    heart_rate,
    oxygen_level,
    condition = 'Normal',
    ward,
  } = patient;

  const isCritical = (condition || '').toLowerCase() === 'critical';
  const isModerate = (condition || '').toLowerCase() === 'moderate';

  return (
    <div
      className={`glass-card-hover p-5 relative overflow-hidden
        ${isCritical ? 'border-red-300/60' : ''}
        ${isModerate ? 'border-amber-300/60' : ''}
      `}
    >
      {/* Glow accent for critical */}
      {isCritical && (
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-red-500/0 via-red-500 to-red-500/0" />
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
              ${isCritical ? 'bg-red-100 text-red-600' : isModerate ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-700'}`}
          >
            {name.charAt(0)}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">{name}</h3>
            <p className="text-xs text-slate-500">
              {age ? `${age} yrs` : ''} {ward ? `· ${ward}` : ''}
            </p>
          </div>
        </div>

        {/* Condition badge */}
        <span
          className={`stat-chip ${
            isCritical
              ? 'badge-critical'
              : isModerate
              ? 'badge-moderate'
              : 'badge-stable'
          }`}
        >
          {isCritical && <AlertTriangle className="w-3 h-3" />}
          {condition.charAt(0).toUpperCase() + condition.slice(1)}
        </span>
      </div>

      {/* Vitals */}
      <div className="grid grid-cols-2 gap-3">
        {/* Heart rate */}
        <div className="flex items-center gap-2 bg-emerald-50/60 rounded-xl px-3 py-2.5 border border-emerald-100/50">
          <Heart
            className={`w-4 h-4 ${
              isCritical ? 'text-red-500 animate-heartbeat' : 'text-rose-400'
            }`}
          />
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Heart Rate</p>
            <p className={`text-sm font-bold ${heart_rate > 100 ? 'text-red-600' : 'text-slate-800'}`}>
              {heart_rate ?? '—'} <span className="text-[10px] font-normal text-slate-400">bpm</span>
            </p>
          </div>
        </div>

        {/* Oxygen */}
        <div className="flex items-center gap-2 bg-emerald-50/60 rounded-xl px-3 py-2.5 border border-emerald-100/50">
          <Droplets className={`w-4 h-4 ${oxygen_level < 92 ? 'text-amber-500' : 'text-sky-500'}`} />
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">SpO₂</p>
            <p className={`text-sm font-bold ${oxygen_level < 92 ? 'text-amber-600' : 'text-slate-800'}`}>
              {oxygen_level ?? '—'}
              <span className="text-[10px] font-normal text-slate-400">%</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
