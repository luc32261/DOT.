import { Leaf, Truck, AlertTriangle, TrendingUp } from 'lucide-react';
import { StatCard } from './StatCard';

export function StatsGrid({ totalCO2, recommendationCount }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
                label="Total CO₂ Saved"
                value={`${totalCO2} kg`}
                icon={Leaf}
                trend="up"
                trendValue="12%"
                color="green"
            />
            <StatCard
                label="Active Transfers"
                value={recommendationCount}
                icon={Truck}
                trend="up"
                trendValue="5"
                color="purple"
            />
            <StatCard
                label="Stockout Risks"
                value="3"
                icon={AlertTriangle}
                trend="down"
                trendValue="2"
                color="orange"
            />
            <StatCard
                label="Sales Velocity"
                value="94%"
                icon={TrendingUp}
                trend="up"
                trendValue="8%"
                color="blue"
            />
        </div>
    );
}
