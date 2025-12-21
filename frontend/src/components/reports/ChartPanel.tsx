import React from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart3 } from 'lucide-react';

interface ChartPanelProps {
  title: string;
  data: Array<Record<string, unknown>>;
  chartType?: 'line' | 'area' | 'bar';
  dataKeys?: string[];
  colors?: string[];
  isLoading?: boolean;
  height?: number;
  xAxisKey?: string;
}

export const ChartPanel: React.FC<ChartPanelProps> = ({
  title,
  data,
  chartType = 'line',
  dataKeys = ['value'],
  colors = ['hsl(142, 60%, 35%)', 'hsl(199, 89%, 48%)'],
  isLoading = false,
  height = 300,
  xAxisKey = 'name',
}) => {
  if (isLoading) {
    return (
      <Card className="p-6 shadow-card">
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-64 w-full" />
        </div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="p-6 shadow-card flex items-center justify-center min-h-80">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-muted-foreground font-medium">No data available</p>
          <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
        </div>
      </Card>
    );
  }

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 0, bottom: 5 },
    };

    const children = (
      <>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey={xAxisKey} stroke="hsl(var(--muted-foreground))" />
        <YAxis stroke="hsl(var(--muted-foreground))" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '0.5rem',
          }}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
        />
        <Legend />
        {dataKeys.map((key, index) => {
          if (chartType === 'line') {
            return (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index] || colors[0]}
                dot={{ fill: colors[index] || colors[0] }}
                strokeWidth={2}
                name={key.charAt(0).toUpperCase() + key.slice(1)}
              />
            );
          } else if (chartType === 'area') {
            return (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index] || colors[0]}
                fill={colors[index] || colors[0]}
                fillOpacity={0.2}
                name={key.charAt(0).toUpperCase() + key.slice(1)}
              />
            );
          } else if (chartType === 'bar') {
            return (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[index] || colors[0]}
                name={key.charAt(0).toUpperCase() + key.slice(1)}
              />
            );
          }
        })}
      </>
    );

    if (chartType === 'area') {
      return (
        <AreaChart {...commonProps} height={height}>
          {children}
        </AreaChart>
      );
    } else if (chartType === 'bar') {
      return (
        <BarChart {...commonProps} height={height}>
          {children}
        </BarChart>
      );
    }

    return (
      <LineChart {...commonProps} height={height}>
        {children}
      </LineChart>
    );
  };

  return (
    <Card className="p-6 shadow-card">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-primary" />
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </Card>
  );
};
