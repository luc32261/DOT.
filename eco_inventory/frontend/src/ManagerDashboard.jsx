import { useState, useEffect } from 'react';
import axios from 'axios';
import { Leaf, Truck, TrendingUp } from 'lucide-react';
import { RecommendationFeed } from './components/dashboard/RecommendationFeed';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { InventoryView } from './components/dashboard/InventoryView';
import { StoresView } from './components/dashboard/StoresView';
import { MapOverview } from './components/dashboard/MapOverview';
import { SettingsView } from './components/dashboard/SettingsView';

export function ManagerDashboard({ onLogout }) {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [searchQuery, setSearchQuery] = useState("");
    const [recommendations, setRecommendations] = useState([]);
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);

    // Inline StatsCard Component to match original exact design
    function StatsCard({ title, value, icon, delay }) {
        return (
            <div
                className="glass-panel p-6 flex justify-between items-center"
            >
                <div>
                    <p className="text-secondary text-sm font-medium mb-1">{title}</p>
                    <p className="text-3xl font-bold">{value}</p>
                </div>
                <div className="p-3 bg-white/5 rounded-full">
                    {icon}
                </div>
            </div>
        )
    }

    const fetchData = async () => {
        setLoading(true);
        try {
            const [recRes, storeRes] = await Promise.all([
                axios.get('/api/recommendations'),
                axios.get('/api/stores')
            ]);
            setRecommendations(recRes.data);
            setStores(storeRes.data);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleApprove = async (id) => {
        try {
            await axios.post(`/api/recommendations/${id}/approve`);
            setRecommendations(prev => prev.filter(r => r.id !== id));
        } catch (e) {
            console.error("Approve failed", e);
        }
    };

    const handleReject = async (id) => {
        try {
            await axios.post(`/api/recommendations/${id}/reject`);
            setRecommendations(prev => prev.filter(r => r.id !== id));
        } catch (e) {
            console.error("Reject failed", e);
        }
    };

    // Calculate Stats
    const totalCO2 = recommendations.reduce((acc, curr) => acc + curr.co2_saved, 0).toFixed(1);
    const pendingCount = recommendations.length;

    return (
        <DashboardLayout
            activeTab={activeTab}
            setActiveTab={(tab) => {
                if (tab === 'logout') onLogout();
                else setActiveTab(tab);
            }}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
        >
            {activeTab === 'dashboard' && (
                <div className="space-y-8">
                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#0f172a] p-4 rounded-xl border border-white/5">
                        <StatsCard
                            title="Potential CO₂ Savings"
                            value={`${totalCO2} kg`}
                            icon={<Leaf className="text-red-400" />}
                            delay={0}
                        />
                        <StatsCard
                            title="Pending Transfers"
                            value={pendingCount}
                            icon={<Truck className="text-purple-400" />}
                            delay={0.1}
                        />
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
                        {/* AI Insights (Left) */}
                        <div className="glass-panel p-6 bg-[#1e293b]/50 h-full overflow-hidden">
                            <RecommendationFeed
                                recommendations={recommendations}
                                loading={loading}
                                onApprove={handleApprove}
                                onReject={handleReject}
                            />
                        </div>

                        {/* Network Status (Right) */}
                        <div className="h-full glass-panel p-1">
                            <MapOverview stores={stores} />
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'inventory' && <InventoryView searchQuery={searchQuery} />}
            {activeTab === 'stores' && <StoresView stores={stores} />}
            {activeTab === 'settings' && <SettingsView />}
        </DashboardLayout>
    );
}
