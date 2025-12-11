import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: LucideIcon;
  variant?: 'default' | 'sales' | 'manufacturing' | 'qc' | 'warehouse' | 'finance' | 'hr' | 'fieldops' | 'rnd' | 'marketing';
  className?: string;
}

const variantStyles = {
  default: 'border-l-success',
  sales: 'border-l-success',
  manufacturing: 'border-l-success',
  qc: 'border-l-success',
  warehouse: 'border-l-success',
  finance: 'border-l-success',
  hr: 'border-l-success',
  fieldops: 'border-l-success',
  rnd: 'border-l-success',
  marketing: 'border-l-success',
};

const iconBgStyles = {
  default: 'bg-success/10 text-success',
  sales: 'bg-success/10 text-success',
  manufacturing: 'bg-success/10 text-success',
  qc: 'bg-success/10 text-success',
  warehouse: 'bg-success/10 text-success',
  finance: 'bg-success/10 text-success',
  hr: 'bg-success/10 text-success',
  fieldops: 'bg-success/10 text-success',
  rnd: 'bg-success/10 text-success',
  marketing: 'bg-success/10 text-success',
};

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  variant = 'default',
  className,
}) => {
  const getTrendIcon = () => {
    if (change === undefined) return null;
    if (change > 0) return <TrendingUp className="w-4 h-4" />;
    if (change < 0) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (change === undefined) return '';
    if (change > 0) return 'text-success';
    if (change < 0) return 'text-destructive';
    return 'text-muted-foreground';
  };

  return (
    <div
      className={cn(
        'kpi-card border-l-4 animate-fade-in',
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl lg:text-3xl font-bold text-foreground">{value}</p>
          {change !== undefined && (
            <div className={cn('flex items-center gap-1 mt-2 text-sm', getTrendColor())}>
              {getTrendIcon()}
              <span className="font-medium">{Math.abs(change)}%</span>
              {changeLabel && (
                <span className="text-muted-foreground ml-1">{changeLabel}</span>
              )}
            </div>
          )}
        </div>
        {Icon && (
          <div className={cn('p-3 rounded-xl', iconBgStyles[variant])}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};
