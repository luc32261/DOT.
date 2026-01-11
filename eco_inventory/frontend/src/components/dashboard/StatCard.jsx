import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export function StatCard({ label, value, icon: Icon, trend, trendValue, color = "green" }) {
    const isPositive = trend === 'up';

    // Dynamic color classes based on the 'color' prop
    const bgClass = color === "green" ? "bg-red-500/10" : color === "purple" ? "bg-purple-500/10" : "bg-blue-500/10";
    const textClass = color === "green" ? "text-red-400" : color === "purple" ? "text-purple-400" : "text-blue-400";
    const borderClass = color === "green" ? "border-red-500/20" : color === "purple" ? "border-purple-500/20" : "border-blue-500/20";

    return (
        <div className="glass-panel p-6 relative overflow-hidden group hover:border-white/20 transition-all cursor-default">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${bgClass} ${textClass} ${borderClass} border`}>
                    <Icon size={24} />
                </div>
                {trendValue && (
                    <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full border ${isPositive
                        ? 'bg-red-500/10 text-red-400 border-red-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                        {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {trendValue}
                    </div>
                )}
            </div>

            <h3 className="text-3xl font-bold text-white mb-1 group-hover:translate-x-1 transition-transform">{value}</h3>
            <p className="text-secondary text-sm font-medium">{label}</p>

            {/* Decorative element */}
            <div className={`absolute -bottom-4 -right-4 w-24 h-24 ${bgClass} rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none`}></div>
        </div>
    );
}
