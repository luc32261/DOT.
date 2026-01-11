import { LayoutDashboard, Store, Package, Settings, LogOut, Zap } from 'lucide-react';

export function Sidebar({ activeTab, setActiveTab }) {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'stores', label: 'Stores', icon: Store },
        { id: 'inventory', label: 'Inventory', icon: Package },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <aside className="w-64 bg-[#0f172a] border-r border-white/10 flex flex-col h-screen fixed left-0 top-0 z-50">
            {/* Logo Area */}
            <div className="p-6 flex items-center gap-2 border-b border-white/10">
                <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center text-red-400">
                    <Zap size={20} className="text-red-400" />
                </div>
                <h1 className="text-xl font-bold tracking-tight">DOT.<span className="text-red-400">Manager</span></h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                ? 'bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                                : 'text-secondary hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <Icon size={20} />
                            <span className="font-medium">{item.label}</span>
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* User Profile / Logout */}
            <div className="p-4 border-t border-white/10">
                <div
                    onClick={() => setActiveTab('logout')}
                    className="glass-panel p-4 flex items-center gap-3 hover:bg-white/5 transition-colors cursor-pointer group"
                >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-black font-bold text-sm">
                        JD
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">John Doe</p>
                        <p className="text-xs text-secondary truncate">Regional Manager</p>
                    </div>
                    <LogOut size={18} className="text-secondary group-hover:text-red-400 transition-colors" />
                </div>
            </div>
        </aside>
    );
}
