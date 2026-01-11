
import { useState, useEffect } from 'react';
import axios from 'axios';
import { X, TrendingUp, AlertTriangle, BarChart3, Activity } from 'lucide-react';

export function StoreAnalyticsModal({ store, onClose }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await axios.get(`/api/stores/${store.id}/analytics`);
                setData(res.data);
            } catch (error) {
                console.error("Failed to fetch store analytics", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [store.id]);

    if (!store) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-panel w-full max-w-4xl bg-[#0f172a] border border-white/20 h-[80vh] flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            {store.name}
                            <span className="text-secondary text-base font-normal hidden md:inline">| AI Performance Analysis</span>
                        </h2>
                        <p className="text-secondary text-xs mt-1 flex items-center gap-2">
                            <Activity size={14} className="text-green-400" />
                            Real-time DNA & Inventory Evaluation
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    {loading ? (
                        <div className="text-center py-20 text-secondary animate-pulse">
                            Analyzing Sales Patterns & Categorizing Inventory...
                        </div>
                    ) : !data ? (
                        <div className="text-center py-20 text-red-400">
                            <AlertTriangle size={48} className="mx-auto mb-4 opacity-50" />
                            <p>Failed to load analytics data.</p>
                            <p className="text-xs text-secondary mt-2">Please ensure the backend is running and supports /analytics.</p>
                        </div>
                    ) : (
                        <>
                            {/* DNA Section */}
                            <section>
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <BarChart3 className="text-purple-400" size={20} />
                                    Store DNA (Category Affinity)
                                </h3>
                                <div className="glass-panel p-4 bg-white/5">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {data.dna.map((trait, idx) => (
                                            <div key={idx} className="p-3 bg-[#0f172a] rounded-lg border border-white/5">
                                                <div className="text-xs text-secondary mb-1 uppercase tracking-wider">{trait.category}</div>
                                                <div className="flex items-end gap-2">
                                                    <div className="h-16 w-3 bg-purple-500/20 rounded-full relative overflow-hidden">
                                                        <div
                                                            className="absolute bottom-0 left-0 w-full bg-purple-500 transition-all duration-1000"
                                                            style={{ height: `${Math.min(trait.score / 20 * 100, 100)}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-2xl font-bold">{trait.score.toFixed(1)}</span>
                                                </div>
                                            </div>
                                        ))}
                                        {data.dna.length === 0 && (
                                            <div className="col-span-4 text-center text-secondary text-sm py-4">
                                                Not enough sales data to generate DNA signature yet.
                                            </div>
                                        )}
                                    </div>
                                    <p className="mt-4 text-xs text-secondary italic border-l-2 border-purple-500 pl-3">
                                        "This store shows a strong preference for the categories above. AI uses this 'DNA' to route compatible overstock from other locations."
                                    </p>
                                </div>
                            </section>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* High Demand */}
                                <section>
                                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-green-400">
                                        <TrendingUp size={20} />
                                        High Demand (Keep Stocked)
                                    </h3>
                                    <div className="glass-panel p-0 overflow-hidden">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-white/5 text-secondary text-xs uppercase">
                                                <tr>
                                                    <th className="p-3">Product</th>
                                                    <th className="p-3 text-right">Velocity</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/10">
                                                {data.high_demand.map((item, i) => (
                                                    <tr key={i}>
                                                        <td className="p-3 font-medium">{item.product_name}</td>
                                                        <td className="p-3 text-right font-bold text-green-400">{item.velocity.toFixed(1)}/wk</td>
                                                    </tr>
                                                ))}
                                                {data.high_demand.length === 0 && (
                                                    <tr><td colSpan="2" className="p-4 text-center text-secondary text-xs">No active high-velocity items.</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </section>

                                {/* Dead Stock */}
                                <section>
                                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-400">
                                        <AlertTriangle size={20} />
                                        Dead Stock (Move Out)
                                    </h3>
                                    <div className="glass-panel p-0 overflow-hidden">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-white/5 text-secondary text-xs uppercase">
                                                <tr>
                                                    <th className="p-3">Product</th>
                                                    <th className="p-3 text-right">Qty</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/10">
                                                {data.dead_stock.map((item, i) => (
                                                    <tr key={i}>
                                                        <td className="p-3 font-medium">{item.product_name}</td>
                                                        <td className="p-3 text-right font-bold text-red-400">{item.quantity}</td>
                                                    </tr>
                                                ))}
                                                {data.dead_stock.length === 0 && (
                                                    <tr><td colSpan="2" className="p-4 text-center text-secondary text-xs">No dead stock detected. Excellent!!</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </section>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
