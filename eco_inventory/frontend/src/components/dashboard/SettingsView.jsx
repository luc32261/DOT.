
import { useState } from 'react';
import { Save, Bell, Shield, User, Check } from 'lucide-react';

export function SettingsView() {
    const [notifications, setNotifications] = useState({
        stockouts: true,
        recommendations: true
    });
    const [saved, setSaved] = useState(false);

    const handleToggle = (key) => {
        setNotifications(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    function Toggle({ active, onToggle }) {
        return (
            <div
                className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${active ? 'bg-green-500/20' : 'bg-white/10'}`}
                onClick={onToggle}
            >
                <div className={`absolute top-0.5 bottom-0.5 w-4 rounded-full shadow-lg transition-all duration-200 ${active ? 'right-0.5 bg-green-500' : 'left-0.5 bg-secondary'}`}></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4">System Settings</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Settings */}
                <div className="glass-panel p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-white/5 rounded-lg">
                            <User size={20} className="text-secondary" />
                        </div>
                        <h3 className="font-bold">Profile Settings</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-secondary uppercase">Display Name</label>
                            <input type="text" value="John Doe" className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-red-500/50" readOnly />
                            <p className="text-[10px] text-secondary/50">Managed by Application Administrator</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-secondary uppercase">Role</label>
                            <input type="text" value="Regional Manager" className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-sm text-secondary" readOnly />
                        </div>
                    </div>
                </div>

                {/* Notification Settings */}
                <div className="glass-panel p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-white/5 rounded-lg">
                            <Bell size={20} className="text-secondary" />
                        </div>
                        <h3 className="font-bold">Notifications</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                            <span className="text-sm">Stockout Alerts</span>
                            <Toggle active={notifications.stockouts} onToggle={() => handleToggle('stockouts')} />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                            <span className="text-sm">Transfer Recommendations</span>
                            <Toggle active={notifications.recommendations} onToggle={() => handleToggle('recommendations')} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    className={`flex items-center gap-2 font-bold py-2 px-6 rounded-lg transition-all ${saved ? 'bg-green-500 text-white' : 'bg-white text-black hover:bg-white/90'}`}
                >
                    {saved ? <Check size={18} /> : <Save size={18} />}
                    {saved ? 'Saved Successfully' : 'Save Changes'}
                </button>
            </div>
        </div>
    );
}
