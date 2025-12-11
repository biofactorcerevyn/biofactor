import React from 'react';
import { KPICard } from '@/components/dashboard/KPICard';
import { TrendingUp, Users, Target } from 'lucide-react';

interface KpiCardsProps {
  data: {
    totalRevenue: number;
    totalRevenueChange?: number;
    newCustomers: number;
    newCustomersChange?: number;
    conversionRate: number;
    conversionRateChange?: number;
  };
  isLoading?: boolean;
}

export const KpiCards: React.FC<KpiCardsProps> = ({
  data,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 bg-card rounded-lg border border-border animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <KPICard
        title="Total Revenue"
        value={`₹${(data.totalRevenue || 0).toLocaleString('en-IN')}`}
        change={data.totalRevenueChange}
        changeLabel="vs last period"
        icon={TrendingUp}
        variant="sales"
      />
      <KPICard
        title="New Customers"
        value={data.newCustomers || 0}
        change={data.newCustomersChange}
        changeLabel="new this period"
        icon={Users}
        variant="sales"
      />
      <KPICard
        title="Conversion Rate"
        value={`${(data.conversionRate || 0).toFixed(2)}%`}
        change={data.conversionRateChange}
        changeLabel="vs last period"
        icon={Target}
        variant="sales"
      />
    </div>
  );
};
