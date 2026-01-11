import { useState } from 'react';
import { ArrowRight, Lock, Building, MapPin, Mail, User, ChevronDown } from 'lucide-react';
import logo from './assets/logo.jpg';

export function AuthPortal({ onLoginManager, onLoginCustomer, onBack }) {
    const [userType, setUserType] = useState('admin'); // 'admin' | 'customer'
    const [isSignUp, setIsSignUp] = useState(false); // Only for customer
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Admin Form State
    const [adminData, setAdminData] = useState({ company: '', branch: '', password: '' });
    // Customer Form State
    const [customerData, setCustomerData] = useState({ email: '', password: '', confirmPassword: '' });

    const handleAdminSubmit = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        setTimeout(() => {
            const validUsers = [
                { company: 'DOT.', branch: 'Manhattan', password: 'admin' },
                { company: 'DOT.', branch: 'Brooklyn', password: 'admin' }
            ];

            const isValid = validUsers.some(u =>
                u.company.toLowerCase() === adminData.company.toLowerCase() &&
                u.branch.toLowerCase() === adminData.branch.toLowerCase() &&
                u.password === adminData.password
            );

            if (isValid) {
                onLoginManager();
            } else {
                setError('Invalid Admin Credentials.');
                setLoading(false);
            }
        }, 1000);
    };

    const handleCustomerSubmit = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (isSignUp && customerData.password !== customerData.confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        setTimeout(() => {
            // Mock Customer Auth
            if (isSignUp) {
                onLoginCustomer();
            } else {
                if (customerData.email === 'jane@example.com' && customerData.password === 'password') {
                    onLoginCustomer();
                } else {
                    setError('Invalid. Try the demo credentials below.');
                    setLoading(false);
                }
            }
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-[#020408] flex items-center justify-center relative overflow-hidden">
            {/* Ambient Background */}
            <div className={`absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none transition-colors duration-700 ${userType === 'admin' ? 'bg-red-600/10' : 'bg-blue-600/10'}`}></div>
            <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none transition-colors duration-700 ${userType === 'admin' ? 'bg-orange-600/5' : 'bg-green-600/5'}`}></div>

            <div className="z-10 w-full max-w-md px-6">
                <button
                    onClick={onBack}
                    className="mb-6 text-secondary hover:text-white flex items-center gap-2 text-sm transition-colors"
                >
                    ← Back to Landing
                </button>

                <div className="glass-panel p-8 md:p-10 border border-white/10 shadow-2xl relative">
                    {/* Top Accent Line */}
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r transition-colors duration-500 ${userType === 'admin' ? 'from-red-500 to-red-600' : 'from-blue-500 to-green-500'}`}></div>

                    {/* Header & Logo */}
                    <div className="mb-6 text-center">
                        <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                            <img src={logo} alt="DOT." className="w-10 h-10 object-contain" />
                        </div>
                        <h1 className="text-2xl font-bold mb-1">Welcome Back</h1>
                        <p className="text-secondary text-sm">Please identify yourself to continue</p>
                    </div>

                    {/* User Type Dropdown */}
                    <div className="mb-8 relative">
                        <label className="text-xs font-bold text-secondary uppercase tracking-wider ml-1 mb-1 block">I am a...</label>
                        <div className="relative">
                            <select
                                value={userType}
                                onChange={(e) => setUserType(e.target.value)}
                                className="w-full appearance-none bg-[#0f172a] border border-white/10 rounded-xl py-3 pl-4 pr-10 text-sm focus:outline-none focus:border-white/30 transition-all text-white cursor-pointer"
                            >
                                <option value="admin">Store Admin</option>
                                <option value="customer">Customer</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-3.5 text-secondary pointer-events-none" size={16} />
                        </div>
                    </div>

                    {/* ADMIN FORM */}
                    {userType === 'admin' && (
                        <form onSubmit={handleAdminSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-secondary uppercase tracking-wider ml-1">Company / Branch</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="relative">
                                        <Building className="absolute left-3 top-3 text-secondary" size={16} />
                                        <input
                                            type="text"
                                            placeholder="Company"
                                            className="w-full bg-[#0f172a] border border-white/10 rounded-xl py-2.5 pl-9 pr-2 text-sm focus:outline-none focus:border-red-500/50 transition-all text-white"
                                            value={adminData.company}
                                            onChange={(e) => setAdminData({ ...adminData, company: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 text-secondary" size={16} />
                                        <input
                                            type="text"
                                            placeholder="Branch"
                                            className="w-full bg-[#0f172a] border border-white/10 rounded-xl py-2.5 pl-9 pr-2 text-sm focus:outline-none focus:border-red-500/50 transition-all text-white"
                                            value={adminData.branch}
                                            onChange={(e) => setAdminData({ ...adminData, branch: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-secondary uppercase tracking-wider ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-3 text-secondary" size={18} />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full bg-[#0f172a] border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-red-500/50 transition-all text-white"
                                        value={adminData.password}
                                        onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Demo Hint */}
                            <div className="text-[10px] text-white/40 bg-white/5 p-2 rounded text-center border border-white/5">
                                Demo: <b>DOT.</b> / <b>Manhattan</b> / <b>admin</b>
                            </div>

                            {error && <div className="text-red-400 text-xs text-center">{error}</div>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-red-900/20 mt-2"
                            >
                                {loading ? 'Checking...' : 'Admin Login'}
                            </button>
                        </form>
                    )}

                    {/* CUSTOMER FORM */}
                    {userType === 'customer' && (
                        <form onSubmit={handleCustomerSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-secondary uppercase tracking-wider ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-3 text-secondary" size={18} />
                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        className="w-full bg-[#0f172a] border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all text-white"
                                        value={customerData.email}
                                        onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-secondary uppercase tracking-wider ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-3 text-secondary" size={18} />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full bg-[#0f172a] border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all text-white"
                                        value={customerData.password}
                                        onChange={(e) => setCustomerData({ ...customerData, password: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            {isSignUp && (
                                <div className="space-y-1 animate-in fade-in slide-in-from-top-2">
                                    <label className="text-xs font-bold text-secondary uppercase tracking-wider ml-1">Confirm Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-3 text-secondary" size={18} />
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            className="w-full bg-[#0f172a] border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all text-white"
                                            value={customerData.confirmPassword}
                                            onChange={(e) => setCustomerData({ ...customerData, confirmPassword: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Demo Hint */}
                            <div className="text-[10px] text-white/40 bg-white/5 p-2 rounded text-center border border-white/5">
                                Demo: <b>jane@example.com</b> / <b>password</b>
                            </div>

                            {error && <div className="text-red-400 text-xs text-center">{error}</div>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-900/20 mt-2"
                            >
                                {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
                            </button>

                            <div className="pt-2 text-center">
                                <button
                                    type="button"
                                    onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                                    className="text-xs text-secondary hover:text-white transition-colors"
                                >
                                    {isSignUp ? 'Already have an account? Sign In' : 'New here? Create an Account'}
                                </button>
                            </div>
                        </form>
                    )}

                </div>
            </div>
        </div>
    );
}
