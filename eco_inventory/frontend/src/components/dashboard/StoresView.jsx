import { useState } from 'react';
import { Store as StoreIcon, MapPin, TrendingUp, BarChart3 } from 'lucide-react';
import { StoreAnalyticsModal } from './StoreAnalyticsModal';

export function StoresView({ stores }) {
    const [selectedStore, setSelectedStore] = useState(null);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Store Network ({stores.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stores.map(store => (
                    <div
                        key={store.id}
                        onClick={() => setSelectedStore(store)}
                        className="glass-panel p-6 hover:bg-white/5 transition-all hover:scale-[1.02] cursor-pointer group relative"
                    >
                        {/* Hover Hint */}
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-xs font-bold text-accent-primary flex items-center gap-1">
                                <BarChart3 size={12} /> View DNA
                            </span>
                        </div>

                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
                                <StoreIcon size={24} />
                            </div>
                            <span className="px-2 py-1 text-xs bg-green-500/10 text-green-400 rounded-full border border-green-500/20">
                                Active
                            </span>
                        </div>
                        <h3 className="text-xl font-bold mb-1">{store.name}</h3>
                        <div className="flex items-center gap-1 text-secondary text-sm mb-4">
                            <MapPin size={14} />
                            {store.location}
                        </div>

                        <div className="pt-4 border-t border-white/10 flex justify-between items-center text-sm">
                            <span className="text-secondary">Weekly Sales</span>
                            <span className={`font-bold flex items-center gap-1 ${store.total_velocity > 50 ? 'text-red-400' : 'text-green-400'}`}>
                                <TrendingUp size={14} className={store.total_velocity > 50 ? 'text-red-400' : 'text-green-400'} />
                                {store.total_velocity > 50 ? 'High Velocity' : 'Normal Velocity'} ({store.total_velocity})
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {selectedStore && (
                <StoreAnalyticsModal
                    store={selectedStore}
                    onClose={() => setSelectedStore(null)}
                />
            )}
        </div>
    );
}
