import { AlertTriangle, Clock } from 'lucide-react';
import { Button } from './Button';

export function StockAlertCard() {
    return (
        <div className="glass-panel p-4 border-l-4 border-l-red-500 flex items-start gap-4">
            <div className="p-2 bg-red-500/10 rounded-lg text-red-400 shrink-0">
                <AlertTriangle size={20} />
            </div>
            <div className="flex-1">
                <h4 className="font-bold text-sm">Downtown Store: Stockout Risk</h4>
                <p className="text-xs text-secondary mt-1 mb-3">
                    "Vintage Denim Jacket" velocity indicates stockout in &lt; 24hrs.
                </p>
                <div className="flex items-center gap-4">
                    <span className="text-xs text-red-300 flex items-center gap-1 font-medium">
                        <Clock size={12} />
                        Critical (Urgent)
                    </span>
                    <Button
                        variant="secondary"
                        size="sm"
                        className="ml-auto text-xs py-1 h-7"
                        onClick={() => alert("Redirecting to Intelligent Stock Replenishment...")}
                    >
                        Review Options
                    </Button>
                </div>
            </div>
        </div>
    );
}
