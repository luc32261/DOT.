import { Search, Bell, Calendar } from 'lucide-react';

export function Header({ title, searchQuery, setSearchQuery }) {
    return (
        <header className="h-20 border-b border-white/10 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
            {/* Page Title */}
            <div>
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                <p className="text-xs text-secondary flex items-center gap-1 mt-1">
                    <Calendar size={12} />
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative w-96 hidden md:block">
                    <input
                        type="text"
                        placeholder="Search stores, products, or inventory..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#1e293b] border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
                    />
                    <Search className="absolute left-3.5 top-2.5 text-secondary" size={18} />
                    <div className="absolute right-2 top-2 px-2 py-0.5 bg-white/10 rounded text-[10px] text-secondary border border-white/5">
                        CTRL + K
                    </div>
                </div>

                {/* Notifications */}
                <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 hover:border-red-500/30 text-secondary hover:text-red-400 transition-all relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
                </button>
            </div>
        </header>
    );
}
