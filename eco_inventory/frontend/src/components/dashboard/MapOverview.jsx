import { MapPin } from 'lucide-react';

export function MapOverview({ stores = [] }) {
    // Normalize real lat/lon to percentage for the abstract map (Demo specific)
    // In a real map library (Leaflet/Mapbox), this wouldn't be needed.
    // For this demo, we can just map the few known stores to fixed abstract positions 
    // or generate random ones if new.

    const getPosition = (index) => {
        const positions = [
            { x: 75, y: 30 }, // Manhattan
            { x: 72, y: 35 }, // Brooklyn
            { x: 80, y: 25 }, // Queens
            { x: 65, y: 32 }, // Jersey
        ];
        return positions[index % positions.length];
    };

    return (
        <div className="glass-panel p-6 h-full flex flex-col relative overflow-hidden">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <MapPin className="text-red-400" size={20} />
                Network Status
            </h3>

            <div className="flex-1 bg-[#1e293b] rounded-xl relative overflow-hidden border border-white/5 group">
                {/* Abstract Map Background */}
                <svg className="absolute inset-0 w-full h-full text-white/5" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0,0 L100,100" stroke="currentColor" strokeWidth="0.5" />
                    <path d="M100,0 L0,100" stroke="currentColor" strokeWidth="0.5" />
                    <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" fill="none" />
                </svg>

                {/* Store Dots */}
                {stores.map((store, index) => {
                    const pos = getPosition(index);
                    const isCritical = index === 2;
                    const status = isCritical ? 'critical' : 'healthy';

                    return (
                        <div
                            key={store.id}
                            className="absolute w-4 h-4 -ml-2 -mt-2 cursor-pointer group/pin hover:z-10"
                            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                        >
                            {/* Dot */}
                            <div className={`w-full h-full rounded-full border-2 border-[#0f172a] shadow-lg ${status === 'healthy' ? 'bg-red-500' : 'bg-red-600'
                                } transition-transform group-hover/pin:scale-150`}></div>

                            {/* Pulse effect for critical */}
                            {status === 'critical' && (
                                <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></div>
                            )}

                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-[#0f172a] border border-white/10 p-3 rounded-lg shadow-xl opacity-0 translate-y-2 group-hover/pin:opacity-100 group-hover/pin:translate-y-0 transition-all pointer-events-none z-20">
                                <p className="font-bold text-sm text-white">{store.name}</p>
                                <p className="text-xs text-secondary mt-1">Location: {store.location}</p>
                                <div className="mt-2 flex items-center gap-2 text-[10px] uppercase font-bold tracking-wider">
                                    <div className={`w-2 h-2 rounded-full ${status === 'healthy' ? 'bg-red-500' : 'bg-red-500'}
                                        }`}></div>
                                    {status}
                                </div>
                            </div>
                        </div>
                    );
                })}

                <div className="absolute bottom-4 right-4 bg-[#0f172a]/80 backdrop-blur px-3 py-2 rounded-lg border border-white/10 text-xs text-secondary">
                    New York Metro Area
                </div>
            </div>
        </div>
    );
}
