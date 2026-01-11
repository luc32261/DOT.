import { Zap } from 'lucide-react';
import { TransferCard } from './TransferCard';
import { StockAlertCard } from './StockAlertCard';
import { motion } from 'framer-motion';

export function RecommendationFeed({ recommendations, loading, onApprove, onReject }) {
    if (loading) {
        return <div className="p-12 text-center text-secondary">Analyzing Eco-Network...</div>;
    }

    return (
        <div className="flex flex-col h-full gap-4">
            <div className="flex items-center justify-between mb-2 shrink-0">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <Zap className="text-yellow-400" size={20} />
                    AI Insights & Actions
                </h3>
                <span className="text-xs text-secondary bg-white/5 px-2 py-1 rounded">
                    {recommendations.length} Pending
                </span>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div className="flex flex-col gap-4 pb-4">
                    {/* Hardcoded Alert for Demo */}
                    <StockAlertCard />

                    {/* Dynamic Recommendations */}
                    {recommendations.map((rec, index) => (
                        <motion.div
                            key={rec.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <TransferCard data={rec} onApprove={() => onApprove(rec.id)} onReject={() => onReject(rec.id)} />
                        </motion.div>
                    ))}

                    {recommendations.length === 0 && (
                        <div className="p-8 text-center border border-dashed border-white/10 rounded-xl text-secondary">
                            No new optimization opportunities found. Network is balanced.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
