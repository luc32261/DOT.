import { ArrowRight, Leaf, Truck } from 'lucide-react';
import { Badge } from './Badge';
import { Button } from './Button';

export function TransferCard({ data, onApprove, onReject }) {
    const isDnaMatch = data?.method === 'StoreTransfer';

    if (!data) return null;

    return (
        <div className="glass-panel p-4 flex flex-col gap-4 group hover:border-red-500/30 transition-all">
            <div className="flex items-start justify-between w-full gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    {/* Image Placeholder */}
                    <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-secondary shrink-0">
                        <Leaf size={18} className="opacity-50" />
                    </div>

                    {/* Info */}
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-sm truncate">{data.product?.name || 'Unknown Product'}</h4>
                            {isDnaMatch && (
                                <Badge variant="purple" size="sm" icon={ArrowRight}>DNA</Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-secondary">
                            <span className="truncate max-w-[80px]">{data.source_store?.name || 'Src'}</span>
                            <ArrowRight size={10} />
                            <span className="text-white font-medium truncate max-w-[80px]">{data.dest_store?.name || 'Online'}</span>
                        </div>
                    </div>
                </div>

                {/* Sustainability Badge */}
                <div className="shrink-0">
                    <Badge variant="success" icon={Leaf}>
                        -{data.co2_saved}kg
                    </Badge>
                </div>
            </div>

            {/* Actions (Full Width) */}
            <div className="flex gap-2 w-full pt-2 border-t border-white/5">
                <Button variant="ghost" size="sm" className="flex-1 text-xs" onClick={onReject}>Reject</Button>
                <Button variant="primary" size="sm" className="flex-1 text-xs" onClick={onApprove}>Approve</Button>
            </div>
        </div>
    );
}
