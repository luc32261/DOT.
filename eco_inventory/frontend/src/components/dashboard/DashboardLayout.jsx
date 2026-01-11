import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function DashboardLayout({ children, activeTab, setActiveTab, searchQuery, setSearchQuery }) {
    // State lifted to App.jsx

    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex font-sans selection:bg-red-500/30">
            {/* Sidebar (Fixed width) */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Main Content Area */}
            <div className="flex-1 ml-64 flex flex-col min-h-screen relative">
                {/* Header (Sticky) */}
                <Header
                    title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />

                {/* Content */}
                <main className="flex-1 p-8 overflow-y-auto relative">
                    {/* Background Ambient Glow */}
                    <div className="absolute top-0 left-0 w-full h-96 bg-red-500/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2"></div>

                    <div className="relative z-10 max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
