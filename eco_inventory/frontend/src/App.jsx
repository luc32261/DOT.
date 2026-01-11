import { useState, useEffect } from 'react';
import axios from 'axios';
import { ManagerDashboard } from './ManagerDashboard';
import { CustomerDashboard } from './CustomerDashboard';
import { AuthPortal } from './AuthPortal';
import { Leaf, ArrowRight, TrendingUp, Zap, BarChart3, Lock } from 'lucide-react';
import logo from './assets/logo.jpg';

export default function App() {
  const [view, setView] = useState('landing'); // 'landing', 'manager', 'customer'
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (view === 'manager') {
    return <ManagerDashboard onLogout={() => setView('landing')} />;
  }

  if (view === 'auth_portal') {
    return (
      <AuthPortal
        onLoginManager={() => setView('manager')}
        onLoginCustomer={() => { setIsAuthenticated(true); setView('customer'); }}
        onBack={() => setView('landing')}
      />
    );
  }

  if (view === 'customer') {
    return (
      <div className="min-h-screen bg-[#0f172a]">
        <div className="p-4 bg-[#0f172a] border-b border-white/10 sticky top-0 z-50">
          <button onClick={() => setView('landing')} className="text-white flex items-center gap-2 hover:text-red-400 transition-colors">
            <ArrowRight className="rotate-180" size={20} /> Back to Home
          </button>
        </div>
        <CustomerDashboard
          isAuthenticated={isAuthenticated}
          onRequireAuth={() => setView('auth_portal')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-red-600 font-sans text-white relative overflow-hidden flex flex-col selection:bg-white/30">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-black/20 rounded-full blur-[80px] pointer-events-none translate-y-1/2 -translate-x-1/4"></div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center overflow-hidden">
            <img src={logo} alt="DOT." className="w-full h-full object-contain" />
          </div>
          <span className="font-bold text-2xl tracking-tighter">DOT.</span>
        </div>

        <div className="hidden lg:flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-xs font-bold tracking-wider uppercase shadow-sm hover:bg-white/20 transition-all cursor-default">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
          AI-Powered Inventory Intelligence
        </div>

        <div className="flex items-center gap-6 text-sm font-medium">
        </div>
      </nav>

      {/* Hero Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 mt-8 pb-12">

        <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 bg-black/10 rounded-full text-xs font-bold border border-white/10">
          <span className="bg-white text-red-600 px-1.5 py-0.5 rounded text-[10px]">NEW</span>
          <span>Zero Deadstock Protocol v2.0</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-9xl font-black tracking-tighter mb-6 leading-none drop-shadow-sm">
          DOT.
        </h1>

        <p className="max-w-2xl text-2xl md:text-3xl opacity-90 mb-12 font-light">
          Intelligent Retail System
        </p>

        <p className="max-w-2xl text-lg md:text-xl opacity-90 mb-12 leading-relaxed font-light">
          Transform your fashion retail with AI-driven inventory optimization. Reduce waste, maximize sales, and minimize carbon footprint across all stores.
        </p>

        <div className="flex flex-col gap-4 mb-24 w-full justify-center items-center max-w-sm mx-auto">
          <button
            onClick={() => setView('auth_portal')}
            className="bg-white text-red-600 text-lg font-bold px-10 py-4 rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:-translate-y-1 w-full"
          >
            Get Started
          </button>

          <button
            onClick={() => setView('customer')}
            className="text-white/80 hover:text-white font-medium px-6 py-2 rounded-xl transition-all flex items-center justify-center gap-2 hover:bg-white/10"
          >
            Shop Now <ArrowRight size={18} />
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full px-4">
          <StatCard icon={TrendingUp} value="73%" label="Dead Stock Reduction" />
          <StatCard icon={Zap} value="2.4x" label="Sales Optimization" />
          <StatCard icon={Leaf} value="45%" label="CO₂ Reduction" />
        </div>

      </main>

      <div className="py-4 text-center text-xs opacity-50 relative z-10">
        © 2026 DOT. • Empowering Sustainable Retail
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="bg-white/95 backdrop-blur text-slate-900 p-8 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] flex flex-col items-center justify-center text-center transform hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(0,0,0,0.3)] transition-all duration-300 border border-white/50 group">
      <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <Icon size={24} className="text-red-600" />
      </div>
      <div className="text-4xl font-extrabold mb-2 text-slate-900 tracking-tight">{value}</div>
      <div className="text-sm font-bold text-slate-500 uppercase tracking-wide">{label}</div>
    </div>
  )
}
