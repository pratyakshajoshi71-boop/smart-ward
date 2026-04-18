import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';
import { Calendar, FileText, User as UserIcon, LogOut, Clock, Activity, Eye, Download, Pill, Sparkles, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockPatients } from '../data/mockStaffData';
import PatientSidebar from '../components/patient/PatientSidebar';
import { analyzeReport } from '../services/aiService';
import ReactMarkdown from 'react-markdown';

export default function PatientDashboard() {
  const { user } = useAuth();
  const { patients: livePatients } = useAppContext();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [checkedMeds, setCheckedMeds] = useState({});
  const [analyzingReport, setAnalyzingReport] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookedAppointments, setBookedAppointments] = useState([]);
  const [bookingForm, setBookingForm] = useState({ doctor: 'Dr. Sarah Smith', date: '', time: '10:00 AM', type: 'General Checkup' });

  const patientData = mockPatients.find(p => p.id === user?.id);
  const livePatient = livePatients.find(p => p.patient_id === user?.id || p._id === user?.id);
  
  const baseAppointments = patientData?.appointments || [];
  const allAppointments = [...bookedAppointments, ...baseAppointments];
  
  const reports = patientData?.reports || [];
  const prescriptions = patientData?.prescriptions || [];

  const handleBookAppointment = (e) => {
    e.preventDefault();
    setBookedAppointments([
      {
        ...bookingForm,
        status: 'upcoming'
      },
      ...bookedAppointments
    ]);
    setIsBookingModalOpen(false);
    setBookingForm({ doctor: 'Dr. Sarah Smith', date: '', time: '10:00 AM', type: 'General Checkup' });
  };

  const handleViewReport = (base64Data) => {
    fetch(base64Data)
      .then(res => res.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      });
  };

  const handleAnalyzeClick = async (report) => {
    setAnalyzingReport(report);
    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
      const result = await analyzeReport(report.file_data, report.name);
      if (result.success) {
        setAnalysisResult(result.data.analysis);
      } else {
        setAnalysisResult("Failed to analyze the report. Please try again later.");
      }
    } catch (error) {
      console.error("Analysis error:", error);
      setAnalysisResult("An error occurred during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const closeAnalysisModal = () => {
    setAnalyzingReport(null);
    setAnalysisResult(null);
  };

  const toggleMedication = (idx) => {
    setCheckedMeds(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const renderDashboard = () => (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/80 p-6 rounded-2xl border border-emerald-100 shadow-sm backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-bold text-emerald-900">Welcome, {user?.name || 'Patient'}</h1>
          <p className="text-slate-500 mt-1">Patient ID: {user?.id || 'P-XXX'}</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="glass-card p-6 flex flex-col items-center text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
          <UserIcon className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">{user?.name}</h2>
        <p className="text-slate-500 mb-6">{user?.email}</p>
        <div className="w-full space-y-3 text-sm text-left">
          <div className="flex justify-between border-b border-emerald-50 pb-2">
            <span className="text-slate-500">Phone</span>
            <span className="font-medium text-slate-800">{patientData?.contact || '+91 98765 43210'}</span>
          </div>
          <div className="flex justify-between border-b border-emerald-50 pb-2">
            <span className="text-slate-500">DOB</span>
            <span className="font-medium text-slate-800">April 15, 1981</span>
          </div>
          <div className="flex justify-between border-b border-emerald-50 pb-2">
            <span className="text-slate-500">Blood Group</span>
            <span className="font-medium text-slate-800">{patientData?.bloodGroup}</span>
          </div>
          <div className="flex justify-between pt-2">
            <span className="text-slate-500">Address</span>
            <span className="font-medium text-slate-800 text-right">{patientData?.address}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppointments = () => (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-emerald-900">Your Appointments</h2>
        </div>
        <button 
          onClick={() => setIsBookingModalOpen(true)}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors shadow-sm"
        >
          Book Appointment
        </button>
      </div>
      
      <div className="space-y-4">
        {allAppointments.map((apt, idx) => {
          const isUpcoming = apt.status === 'upcoming';
          return (
            <div key={idx} className={`glass-card p-5 flex items-center justify-between ${isUpcoming ? 'border-l-4 border-l-emerald-500' : ''}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isUpcoming ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-50 text-slate-400 border border-slate-200'}`}>
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-slate-800">{apt.type}</h4>
                  <p className="text-sm text-slate-500 mt-0.5">{apt.doctor} · {apt.date} at {apt.time}</p>
                </div>
              </div>
              <span className={`stat-chip text-xs border px-3 py-1 ${isUpcoming ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                {isUpcoming ? 'Upcoming' : 'Completed'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center">
          <FileText className="w-6 h-6 text-sky-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Medical Reports</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((rpt, idx) => {
          const liveReport = livePatient?.reports?.find(r => r.name === rpt.name);
          
          return (
            <div key={idx} className="flex flex-col p-5 bg-white/80 border border-emerald-100 rounded-xl hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-800">{rpt.name}</span>
                  <span className="text-xs text-slate-500">{rpt.date} · {rpt.type}</span>
                </div>
              </div>
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                {liveReport?.file_data ? (
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Available</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleAnalyzeClick(liveReport)}
                        className="px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-1.5 border border-indigo-100"
                      >
                        <Sparkles className="w-4 h-4" /> Analyse
                      </button>
                      <button 
                        onClick={() => handleViewReport(liveReport.file_data)}
                        className="px-3 py-1.5 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <Eye className="w-4 h-4" /> View PDF
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded">Awaiting Upload</span>
                    <button disabled className="px-4 py-1.5 text-sm font-medium text-slate-400 bg-slate-100 rounded-lg border border-slate-200 cursor-not-allowed">
                      Pending
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderMedications = () => (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
          <Pill className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Medications Checklist</h2>
          <p className="text-sm text-slate-500">Mark off your medicines as you take them today.</p>
        </div>
      </div>

      <div className="glass-card p-2 md:p-6 space-y-3 bg-white/50">
        {prescriptions.map((med, idx) => (
          <div key={idx} className={`flex items-center justify-between p-4 bg-white border rounded-xl transition-all duration-300 ${checkedMeds[idx] ? 'border-indigo-300 shadow-sm bg-indigo-50/30' : 'border-slate-200 hover:border-indigo-300'}`}>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => toggleMedication(idx)}
                className={`w-7 h-7 rounded border-2 flex items-center justify-center transition-colors ${checkedMeds[idx] ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300 hover:border-indigo-400'}`}
              >
                {checkedMeds[idx] && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              </button>
              <div>
                <h4 className={`font-semibold text-lg ${checkedMeds[idx] ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{med.name}</h4>
                <p className={`text-sm ${checkedMeds[idx] ? 'text-slate-400' : 'text-slate-500'}`}>{med.dosage} · {med.frequency}</p>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-md ${checkedMeds[idx] ? 'bg-indigo-100 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                {med.duration}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-200 via-emerald-200 to-teal-300 text-slate-800">
      <PatientSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content Area */}
      <main className="lg:pl-[260px] p-4 lg:p-8 pt-20 lg:pt-8 transition-all duration-300">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'appointments' && renderAppointments()}
        {activeTab === 'reports' && renderReports()}
        {activeTab === 'medications' && renderMedications()}
      </main>

      {/* Analysis Modal */}
      {analyzingReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeAnalysisModal} />
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{analyzingReport.name} Analysis</h3>
                  <p className="text-sm text-slate-500">AI-Powered Summary</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleViewReport(analyzingReport.file_data)}
                  className="px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors flex items-center gap-2 border border-emerald-100"
                >
                  <Eye className="w-4 h-4" /> View PDF
                </button>
                <button 
                  onClick={closeAnalysisModal}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            {/* Modal Content */}
            <div className="p-6 overflow-y-auto bg-slate-50/30">
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
                    <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-indigo-600 animate-pulse" />
                  </div>
                  <h4 className="text-lg font-medium text-slate-700">Analyzing Report with Gemini AI...</h4>
                  <p className="text-sm text-slate-500 text-center max-w-md">
                    Reading the medical data and generating an easy-to-understand summary. This may take a few moments.
                  </p>
                </div>
              ) : (
                <div className="prose prose-slate max-w-none prose-headings:text-indigo-900 prose-strong:text-indigo-700 prose-p:text-slate-600 prose-li:text-slate-600">
                  {analysisResult ? (
                    <ReactMarkdown>{analysisResult}</ReactMarkdown>
                  ) : (
                    <p className="text-red-500">Failed to load analysis.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------- Appointment Booking Modal ---------- */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsBookingModalOpen(false)}></div>
          
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-scale-up">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Book Appointment</h3>
              </div>
              <button 
                onClick={() => setIsBookingModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookAppointment} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Select Doctor</label>
                <select 
                  required
                  value={bookingForm.doctor}
                  onChange={(e) => setBookingForm({...bookingForm, doctor: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-700"
                >
                  <option value="Dr. Sarah Smith">Dr. Sarah Smith (Cardiology)</option>
                  <option value="Dr. Michael Chen">Dr. Michael Chen (Neurology)</option>
                  <option value="Dr. Emily Davis">Dr. Emily Davis (General Practice)</option>
                  <option value="Dr. James Wilson">Dr. James Wilson (Orthopedics)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Date</label>
                  <input 
                    type="date" 
                    required
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-700"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Time</label>
                  <select 
                    required
                    value={bookingForm.time}
                    onChange={(e) => setBookingForm({...bookingForm, time: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-700"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:30 PM">03:30 PM</option>
                    <option value="04:45 PM">04:45 PM</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Consultation Type</label>
                <select 
                  required
                  value={bookingForm.type}
                  onChange={(e) => setBookingForm({...bookingForm, type: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-700"
                >
                  <option value="General Checkup">General Checkup</option>
                  <option value="Follow-up Visit">Follow-up Visit</option>
                  <option value="Routine Blood Test">Routine Blood Test</option>
                  <option value="Specialist Consultation">Specialist Consultation</option>
                </select>
              </div>

              <div className="pt-4 mt-2 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors shadow-sm"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
