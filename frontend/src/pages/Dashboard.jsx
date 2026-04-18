import {
  Users,
  BedDouble,
  AlertTriangle,
  Brain,
  Heart,
  Activity,
  Stethoscope,
  TrendingUp,
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import PatientCard from '../components/PatientCard';
import AlertBox from '../components/AlertBox';
import ResourceChart from '../components/ResourceChart';

/* ---------- Modern KPI Stat Card (Solid Style) ---------- */
function StatCard({ icon: Icon, label, value, sub, accent = 'teal' }) {
  const styles = {
    teal: 'bg-[#009e73] shadow-[0_8px_30px_rgba(0,158,115,0.3)]',
    sky: 'bg-[#0284c7] shadow-[0_8px_30px_rgba(2,132,199,0.3)]',
    amber: 'bg-[#f59e0b] shadow-[0_8px_30px_rgba(245,158,11,0.3)]',
    red: 'bg-[#ef4444] shadow-[0_8px_30px_rgba(239,68,68,0.3)]',
  };

  const themeClass = styles[accent] || styles.teal;

  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 ${themeClass} text-white transition-transform duration-300 hover:scale-[1.03] group animate-slide-up flex flex-col justify-between min-h-[140px]`}>
      {/* Decorative Circles */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full group-hover:scale-110 transition-transform duration-500 pointer-events-none" />
      <div className="absolute right-8 -bottom-8 w-24 h-24 bg-white/5 rounded-full pointer-events-none" />

      {/* Icon Area */}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-sm">
          <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>
      </div>

      {/* Content Area */}
      <div className="relative z-10 flex flex-col">
        <p className="text-3xl font-extrabold tracking-tight mb-1">{value}</p>
        <p className="text-[13px] font-bold tracking-wide text-white/95">{label}</p>
        {sub && <p className="text-[11px] text-white/75 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

/* ---------- Loading skeleton ---------- */
function Skeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="shimmer-block h-28" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="shimmer-block h-64" />
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { patients, resources, alerts, aiInsights, loading } = useAppContext();

  if (loading) return <Skeleton />;

  const totalPatients = patients.length;
  const criticalPatients = patients.filter((p) => (p.condition || '').toLowerCase() === 'critical');
  const criticalAlerts = alerts.filter((a) => (a.severity || '').toLowerCase() === 'critical');
  const icuOccupied = resources?.icu_occupied ?? 0;
  const icuTotal = resources?.icu_total ?? 1;
  const icuPct = Math.round((icuOccupied / icuTotal) * 100);

  const resourceItems = [
    { label: 'General Beds', used: resources?.occupied_beds ?? 0, total: resources?.total_beds ?? 0 },
    { label: 'ICU Beds', used: resources?.icu_occupied ?? 0, total: resources?.icu_total ?? 0 },
    { label: 'Ventilators', used: resources?.ventilators_in_use ?? 0, total: resources?.ventilators_total ?? 0 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Clinical Insights</h1>
          <p className="text-sm text-slate-500 mt-1">Live status of all wards and critical patients</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">Last updated: Just now</span>
          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-200 font-semibold text-[11px] tracking-wide uppercase">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            SYSTEM LIVE
          </div>
          <div className="hidden sm:flex items-center gap-2 stat-chip badge-stable">
            <Activity className="w-3 h-3" />
            <span>Live</span>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      {/* Broken symmetry: Total patients takes 2 columns, others take 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-2">
          <StatCard icon={Users} label="Total Admitted Patients" value={totalPatients} sub={`${totalPatients > 50 ? 'High' : 'Normal'} patient volume today`} accent="teal" />
        </div>
        <StatCard icon={AlertTriangle} label="Critical Condition" value={criticalPatients.length} sub={criticalPatients.length > 0 ? "Requires attention" : "All stable"} accent="red" />
        <StatCard icon={BedDouble} label="ICU Occupancy" value={`${icuPct}%`} sub={icuPct > 80 ? "ICU nearly full" : `${icuOccupied}/${icuTotal} beds used`} accent="amber" />
        <StatCard icon={Stethoscope} label="Active Staff" value={(resources?.doctors_on_duty ?? 0) + (resources?.nurses_on_duty ?? 0)} sub="Across all shifts" accent="sky" />
      </div>

      {/* ── Main grid: Asymmetrical layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">

        {/* Col 1 — Critical Patients (Wider column for list) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 lg:col-span-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              <h2 className="text-[13px] font-bold text-slate-700 uppercase tracking-wide">Critical Watchlist</h2>
            </div>
            <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-[11px] font-bold border border-red-100">{criticalPatients.length} active</span>
          </div>
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
            {criticalPatients.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-slate-100 rounded-lg">
                <p className="text-sm font-medium text-slate-500">No critical patients</p>
                <p className="text-xs text-slate-400 mt-1 text-center">All admitted patients are currently stable.</p>
              </div>
            ) : (
              criticalPatients.map((p, i) => <PatientCard key={p._id || i} patient={p} />)
            )}
          </div>
        </div>

        {/* Col 2 — Resources (Medium column) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 lg:col-span-4">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-4 h-4 text-slate-500" />
            <h2 className="text-[13px] font-bold text-slate-700 uppercase tracking-wide">Ward Capacity</h2>
          </div>
          <ResourceChart items={resourceItems} />

          {/* Contextual stats instead of generic blocks */}
          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100">
            <div>
              <p className="text-xs font-semibold text-slate-400 mb-1">O₂ Cylinders</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-black text-slate-800">{resources?.oxygen_cylinders ?? '—'}</p>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Adequate</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 mb-1">Available Beds</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-black text-slate-800">{resources?.available_beds ?? '—'}</p>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">General</span>
              </div>
            </div>
          </div>
        </div>

        {/* Col 3 — Alerts + AI (Narrow column) */}
        <div className="flex flex-col gap-6 lg:col-span-3">

          {/* Alerts */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h2 className="text-[13px] font-bold text-slate-700 uppercase tracking-wide">System Alerts</h2>
            </div>
            <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1 custom-scrollbar">
              {alerts.length === 0 ? (
                <p className="text-xs text-slate-400 py-2">No active alerts</p>
              ) : (
                alerts.slice(0, 4).map((a, i) => (
                  <AlertBox key={a._id || i} alert={a} />
                ))
              )}
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-4 flex-1">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-4 h-4 text-indigo-500" />
              <h2 className="text-[13px] font-bold text-slate-700 uppercase tracking-wide">AI Assistant</h2>
            </div>
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
              {aiInsights.slice(0, 3).map((item, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
                  <p className="text-[12px] font-bold text-slate-800 mb-1 leading-snug">{item.recommendation}</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{item.reason}</p>
                </div>
              ))}
              {aiInsights.length === 0 && (
                <p className="text-xs text-slate-400 py-2 text-center">Scanning data...</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}