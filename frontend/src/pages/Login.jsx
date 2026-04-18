import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, AlertCircle, Shield, Stethoscope, User } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Admin');
  const [error, setError] = useState('');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const defaultPaths = { Admin: '/admin', Patient: '/patient', Staff: '/staff/dashboard' };



  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password should be at least 6 characters');
      return;
    }

    if (role === 'Admin') {
      if (email !== 'admin@smartward.com' || password !== '123456') {
        setError('Invalid admin credentials.');
        return;
      }
    }

    if (role === 'Patient') {
      if (email !== 'arjun@gmail.com' || password !== '123456') {
        setError('Invalid patient credentials. Only Arjun Mehta has access to the portal currently.');
        return;
      }
    }

    try {
      login(email, password, role);
      const dest = location.state?.from?.pathname || defaultPaths[role] || '/admin';
      navigate(dest, { replace: true });
    } catch (err) {
      setError('Failed to login. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-center py-12 sm:px-6 lg:px-8 overflow-hidden bg-transparent">
      
      {/* ════════════ 3D Animated Background ════════════ */}
      <AnimatedBackground />

      {/* ════════════ LOGIN FORM CONTAINER ════════════ */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        
        {/* Main Glass Card */}
        <div className="bg-slate-900/50 backdrop-blur-2xl border border-white/10 py-10 px-6 shadow-2xl shadow-teal-900/50 sm:rounded-[2rem] sm:px-10 overflow-hidden relative">
          
          {/* Inner subtle glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-teal-500/20 rounded-full blur-[50px] pointer-events-none" />

          {/* Motion Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative w-24 h-24 flex items-center justify-center bg-white/5 rounded-3xl border border-white/10 shadow-inner">
              <svg 
                viewBox="0 0 100 50" 
                className="w-16 h-8 text-emerald-400 animate-sweep animate-pulse-glow" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M 0,25 L 20,25 L 28,10 L 40,40 L 52,5 L 60,40 L 68,25 L 100,25" />
              </svg>
            </div>
          </div>

          <h2 className="text-center text-3xl font-bold text-white tracking-tight mb-2">
            Welcome to Smart Ward
          </h2>
          <p className="text-center text-sm text-teal-200/70 mb-8">
            Secure access to futuristic healthcare
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-2xl flex items-start gap-3 backdrop-blur-sm">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            {/* Role Selector */}
            <div>
              <label className="block text-sm font-medium text-teal-100 mb-3">Select Portal</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'Admin', icon: Shield },
                  { id: 'Staff', icon: Stethoscope },
                  { id: 'Patient', icon: User },
                ].map(({ id, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setRole(id)}
                    className={`flex flex-col items-center gap-2 py-3 px-2 border rounded-2xl text-xs font-semibold transition-all duration-300 ${
                      role === id
                        ? 'bg-teal-500/20 border-teal-400 text-teal-300 shadow-[0_0_15px_rgba(45,212,191,0.2)]'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:border-teal-500/50 hover:text-teal-200 hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {id}
                  </button>
                ))}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-teal-100 mb-2">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-teal-500/50" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500/50 focus:border-teal-400 transition-colors sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-teal-100 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-teal-500/50" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500/50 focus:border-teal-400 transition-colors sm:text-sm"
                  placeholder="Enter password"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-2xl shadow-lg shadow-teal-500/20 text-sm font-bold text-teal-950 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 hover:scale-[1.02]"
            >
              Access Portal
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
