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

/* ---------- Tiny stat-card ---------- */
function StatCard({ icon: Icon, label, value, sub, accent = 'ward' }) {
  const colors = {
    ward: 'from-emerald-500/20 to-emerald-600/5 text-emerald-700 border-emerald-300/50',
    red: 'from-red-500/20 to-red-600/5 text-red-600 border-red-300/50',
    amber: 'from-amber-500/20 to-amber-600/5 text-amber-600 border-amber-300/50',
    sky: 'from-sky-500/20 to-sky-600/5 text-sky-600 border-sky-300/50',
  };
  return (
    <div className="glass-card-hover p-5 animate-slide-up">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
          <p className="text-2xl font-extrabold text-slate-800">{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[accent]} border flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
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
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-emerald-900 tracking-tight">Clinical Insights</h1>
          <p className="text-sm text-slate-500 mt-0.5">Real-time hospital overview</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 stat-chip badge-stable">
          <Activity className="w-3 h-3" />
          <span>Live</span>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Patients" value={totalPatients} sub="Currently admitted" accent="ward" />
        <StatCard icon={AlertTriangle} label="Critical" value={criticalPatients.length} sub="Require attention" accent="red" />
        <StatCard icon={BedDouble} label="ICU Occupancy" value={`${icuPct}%`} sub={`${icuOccupied} / ${icuTotal} beds`} accent="amber" />
        <StatCard icon={Stethoscope} label="Staff on Duty" value={(resources?.doctors_on_duty ?? 0) + (resources?.nurses_on_duty ?? 0)} sub={`${resources?.doctors_on_duty ?? 0} doctors · ${resources?.nurses_on_duty ?? 0} nurses`} accent="sky" />
      </div>

      {/* ── Main grid: 3 columns ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Col 1 — Critical Patients */}
        <div className="glass-card p-5 animate-slide-up lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-4 h-4 text-red-500" />
            <h2 className="text-sm font-semibold text-slate-700">Critical Patients</h2>
            <span className="ml-auto stat-chip badge-critical text-[10px]">{criticalPatients.length}</span>
          </div>
          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {criticalPatients.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">No critical patients 🎉</p>
            ) : (
              criticalPatients.map((p, i) => <PatientCard key={p._id || i} patient={p} />)
            )}
          </div>
        </div>

        {/* Col 2 — Resources */}
        <div className="glass-card p-5 animate-slide-up lg:col-span-1" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-semibold text-slate-700">Resource Usage</h2>
          </div>
          <ResourceChart items={resourceItems} />

          {/* Extra stats */}
          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="bg-emerald-50/80 rounded-xl p-3 text-center border border-emerald-100">
              <p className="text-lg font-bold text-slate-800">{resources?.oxygen_cylinders ?? '—'}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">O₂ Cylinders</p>
            </div>
            <div className="bg-emerald-50/80 rounded-xl p-3 text-center border border-emerald-100">
              <p className="text-lg font-bold text-slate-800">{resources?.available_beds ?? '—'}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Beds Free</p>
            </div>
          </div>
        </div>

        {/* Col 3 — Alerts + AI */}
        <div className="flex flex-col gap-5 lg:col-span-1">
          {/* Alerts */}
          <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-semibold text-slate-700">Recent Alerts</h2>
              {criticalAlerts.length > 0 && (
                <span className="ml-auto stat-chip badge-critical text-[10px]">{criticalAlerts.length} critical</span>
              )}
            </div>
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
              {alerts.slice(0, 4).map((a, i) => (
                <AlertBox key={a._id || i} alert={a} />
              ))}
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-4 h-4 text-teal-600" />
              <h2 className="text-sm font-semibold text-slate-700">AI Insights</h2>
            </div>
            <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
              {aiInsights.slice(0, 3).map((item, i) => (
                <div key={i} className="bg-teal-50/80 border border-teal-200/50 rounded-xl p-3">
                  <p className="text-xs font-semibold text-teal-700 mb-1">{item.recommendation}</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{item.reason}</p>
                </div>
              ))}
              {aiInsights.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-4">No insights available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
