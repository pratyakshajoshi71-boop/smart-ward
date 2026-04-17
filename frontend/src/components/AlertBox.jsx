import { AlertTriangle, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';
import { alertBgColor, alertTextColor, alertDotColor, timeAgo } from '../utils/helpers';

export default function AlertBox({ alert, clickable = false }) {
  const {
    message = 'Unknown alert',
    severity = 'normal',
    timestamp,
  } = alert;

  const s = (severity || '').toLowerCase();
  const Icon = s === 'critical' || s === 'red'
    ? AlertTriangle
    : s === 'warning' || s === 'yellow'
    ? AlertCircle
    : CheckCircle;

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3.5 rounded-xl border transition-all duration-300 hover:scale-[1.01] ${alertBgColor(severity)} ${clickable ? 'hover:ring-2 hover:ring-emerald-400/30' : ''}`}
    >
      {/* Dot / Icon */}
      <div className="pt-0.5">
        <Icon className={`w-4 h-4 ${alertTextColor(severity)}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium leading-snug ${alertTextColor(severity)}`}>
          {message}
        </p>
        <div className="flex items-center gap-2 mt-1">
          {timestamp && (
            <p className="text-[10px] text-slate-400">{timeAgo(timestamp)}</p>
          )}
          {clickable && (
            <span className="text-[10px] text-emerald-500/70 flex items-center gap-0.5">
              View patient <ChevronRight className="w-2.5 h-2.5" />
            </span>
          )}
        </div>
      </div>

      {/* Live dot for critical */}
      {(s === 'critical' || s === 'red') && (
        <span className="relative flex h-2.5 w-2.5 mt-1.5">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${alertDotColor(severity)}`} />
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${alertDotColor(severity)}`} />
        </span>
      )}
    </div>
  );
}
