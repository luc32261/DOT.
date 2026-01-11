import { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, AlertTriangle, ArrowRightLeft, TrendingUp } from 'lucide-react';

export function InventoryView({ searchQuery = '' }) {
    const [inventory, setInventory] = useState([]);
    const [forecasts, setForecasts] = useState({});
    const [loading, setLoading] = useState(true);
    const [transferItem, setTransferItem] = useState(null);

    useEffect(() => {
        const fetchInv = async () => {
            try {
                const res = await axios.get('/api/inventory/all');
                // Default Sort: Alphabetical by Product Name
                const sorted = res.data.sort((a, b) => a.product_name.localeCompare(b.product_name));
                setInventory(sorted);
                setLoading(false);

                // Fetch AI Forecasts separately
                try {
                    const aiRes = await axios.get('/api/analytics/forecast');
                    const map = {};
                    aiRes.data.forEach(f => map[f.product_name] = f);
                    setForecasts(map);
                } catch (aiErr) {
                    console.error("AI Forecast failed", aiErr);
                }

            } catch (error) {
                console.error("Failed to load inventory", error);
                setLoading(false);
            }
        };
        fetchInv();
    }, []);

    // Filter Logic
    const filteredInventory = inventory.filter(item => {
        const q = searchQuery.toLowerCase();
        return item.product_name.toLowerCase().includes(q) ||
            item.store_name.toLowerCase().includes(q) ||
            item.sku?.toLowerCase().includes(q);
    });

    if (loading) return <div className="p-12 text-center text-secondary">Loading Global Inventory...</div>;

    return (
        <div className="relative">
            {/* Main View */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Global Inventory Real-Time View</h2>
                <div className="text-sm text-secondary">Showing {filteredInventory.length} SKUs across network</div>
            </div>

            <InventoryTable inventory={filteredInventory} forecasts={forecasts} onTransfer={(item) => setTransferItem(item)} />

            {/* Transfer Modal */}
            {transferItem && (
                <TransferModal
                    item={transferItem}
                    onClose={() => setTransferItem(null)}
                    onSuccess={() => {
                        setTransferItem(null);
                        // Refresh inventory
                        window.location.reload(); // Simple refresh for now or fetchInv()
                    }}
                />
            )}
        </div>
    );
}

function InventoryTable({ inventory, forecasts, onTransfer }) {
    return (
        <div className="glass-panel overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead className="bg-white/5 text-secondary text-xs uppercase tracking-wider">
                    <tr>
                        <th className="p-4 font-medium">Product</th>
                        <th className="p-4 font-medium">Store</th>
                        <th className="p-4 font-medium">Stock Level</th>
                        <th className="p-4 font-medium text-accent-primary">AI Projection (7d)</th>
                        <th className="p-4 font-medium">Health Status</th>
                        <th className="p-4 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-sm">
                    {inventory.map(item => (
                        <tr key={item.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 font-medium flex items-center gap-3">
                                <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center overflow-hidden shrink-0">
                                    <Package size={16} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold">{item.product_name}</span>
                                    <span className="text-xs text-secondary">{item.sku}</span>
                                </div>
                            </td>
                            <td className="p-4 text-secondary">{item.store_name}</td>
                            <td className="p-4">
                                <div className="flex items-center gap-2">
                                    <span className={`font-bold ${item.quantity === 0 ? 'text-red-400' : 'text-white'}`}>
                                        {item.quantity}
                                    </span>
                                    <span className="text-xs text-secondary">units</span>
                                </div>
                            </td>
                            <td className="p-4">
                                {forecasts[item.product_name] ? (
                                    <div className="flex flex-col">
                                        <span className="font-bold text-accent-primary">{forecasts[item.product_name].predicted_next_week}</span>
                                        <span className="text-[10px] text-secondary flex items-center gap-1">
                                            {forecasts[item.product_name].trend === 'Rising' ? <TrendingUp size={10} /> : null}
                                            {forecasts[item.product_name].trend}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-xs text-secondary animate-pulse">Analyzing...</span>
                                )}
                            </td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded text-xs border ${item.status === 'Dead Stock' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                    'bg-green-500/10 text-green-400 border-green-500/20'
                                    }`}>
                                    {item.status}
                                </span>
                            </td>
                            <td className="p-4 text-right">
                                <button
                                    onClick={() => onTransfer(item)}
                                    className="text-accent-primary hover:text-white transition-colors text-xs flex items-center justify-end gap-1 w-full"
                                >
                                    <ArrowRightLeft size={14} /> Transfer
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function TransferModal({ item, onClose, onSuccess }) {
    const [stores, setStores] = useState([]);
    const [selectedStore, setSelectedStore] = useState('');
    const [qty, setQty] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        axios.get('/api/stores').then(res => setStores(res.data));
    }, []);

    const handleTransfer = async () => {
        if (!selectedStore) return;
        setIsSubmitting(true);
        try {
            await axios.post('/api/transfer', {
                inventory_id: item.id,
                dest_store_id: selectedStore,
                quantity: parseInt(qty)
            });
            onSuccess();
        } catch (error) {
            alert("Transfer failed: " + (error.response?.data?.message || error.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-panel p-6 max-w-sm w-full bg-[#0f172a] border border-white/20">
                <h3 className="text-xl font-bold mb-4">Transfer Stock</h3>

                <div className="mb-4 p-3 bg-white/5 rounded-lg">
                    <p className="text-sm font-bold">{item.product_name}</p>
                    <p className="text-xs text-secondary">From: {item.store_name} (Current: {item.quantity})</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs uppercase text-secondary font-bold mb-1 block">Destination Store</label>
                        <select
                            className="w-full bg-white/5 border border-white/10 rounded p-2 text-white"
                            value={selectedStore}
                            onChange={e => setSelectedStore(e.target.value)}
                        >
                            <option value="" className="text-black">Select Store...</option>
                            {stores.filter(s => s.name !== item.store_name).map(s => (
                                <option key={s.id} value={s.id} className="text-black">{s.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs uppercase text-secondary font-bold mb-1 block">Quantity</label>
                        <input
                            type="number"
                            min="1"
                            max={item.quantity}
                            className="w-full bg-white/5 border border-white/10 rounded p-2 text-white"
                            value={qty}
                            onChange={e => setQty(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex gap-2 mt-6">
                    <button onClick={onClose} className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 font-medium">Cancel</button>
                    <button
                        onClick={handleTransfer}
                        disabled={!selectedStore || isSubmitting || qty > item.quantity || qty <= 0}
                        className="flex-1 py-2 rounded-lg bg-accent-primary text-black font-bold hover:opacity-90 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Moving...' : 'Confirm'}
                    </button>
                </div>
            </div>
        </div>
    );
}
