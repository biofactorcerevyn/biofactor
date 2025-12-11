import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Filter, X } from 'lucide-react';
import { format, subDays } from 'date-fns';

export interface ReportFiltersType {
  reportType: string;
  dateRange: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
  startDate: string;
  endDate: string;
  groupBy: string;
  dealerId?: string;
  region?: string;
}

interface ReportFiltersProps {
  filters: ReportFiltersType;
  onFilterChange: (filters: ReportFiltersType) => void;
  onReset: () => void;
  isLoading?: boolean;
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  isLoading = false,
}) => {
  const getDateRange = (range: string): { startDate: string; endDate: string } | null => {
    const today = new Date();
    const endDate = format(today, 'yyyy-MM-dd');
    
    let startDate = endDate;
    switch (range) {
      case 'today':
        startDate = endDate;
        break;
      case 'week':
        startDate = format(subDays(today, 7), 'yyyy-MM-dd');
        break;
      case 'month':
        startDate = format(subDays(today, 30), 'yyyy-MM-dd');
        break;
      case 'quarter':
        startDate = format(subDays(today, 90), 'yyyy-MM-dd');
        break;
      case 'year':
        startDate = format(subDays(today, 365), 'yyyy-MM-dd');
        break;
      default:
        return null;
    }
    
    return { startDate, endDate };
  };

  const handleDateRangeChange = (value: string) => {
    const range = value as typeof filters.dateRange;
    if (range === 'custom') {
      onFilterChange({
        ...filters,
        dateRange: 'custom',
      });
    } else {
      const dates = getDateRange(range);
      if (dates) {
        onFilterChange({
          ...filters,
          dateRange: range,
          startDate: dates.startDate,
          endDate: dates.endDate,
        });
      }
    }
  };

  const handleReportTypeChange = (value: string) => {
    onFilterChange({
      ...filters,
      reportType: value,
    });
  };

  const handleGroupByChange = (value: string) => {
    onFilterChange({
      ...filters,
      groupBy: value,
    });
  };

  const handleCustomDateChange = (type: 'start' | 'end', value: string) => {
    onFilterChange({
      ...filters,
      [type === 'start' ? 'startDate' : 'endDate']: value,
    });
  };

  return (
    <Card className="p-6 border-l-4 border-l-primary bg-card shadow-card">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Filters</h3>
          </div>
          <button
            onClick={onReset}
            disabled={isLoading}
            className="p-1 hover:bg-secondary rounded-md transition-colors"
            title="Reset filters"
          >
            <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
          </button>
        </div>

        {/* Report Type */}
        <div className="space-y-2">
          <Label htmlFor="report-type" className="text-sm font-medium text-foreground">
            Report Type
          </Label>
          <Select value={filters.reportType} onValueChange={handleReportTypeChange} disabled={isLoading}>
            <SelectTrigger id="report-type" className="bg-background border-input">
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Sales Overview</SelectItem>
              <SelectItem value="regional">Regional Performance</SelectItem>
              <SelectItem value="dealer">Dealer Analysis</SelectItem>
              <SelectItem value="product">Product Performance</SelectItem>
              <SelectItem value="conversion">Conversion Metrics</SelectItem>
              <SelectItem value="customer">Customer Growth</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <Label htmlFor="date-range" className="text-sm font-medium text-foreground">
            Date Range
          </Label>
          <Select value={filters.dateRange} onValueChange={handleDateRangeChange} disabled={isLoading}>
            <SelectTrigger id="date-range" className="bg-background border-input">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="quarter">Last 90 Days</SelectItem>
              <SelectItem value="year">Last 12 Months</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Custom Date Range */}
        {filters.dateRange === 'custom' && (
          <div className="space-y-3 p-3 bg-secondary/50 rounded-md">
            <div className="space-y-2">
              <Label htmlFor="start-date" className="text-xs font-medium text-muted-foreground">
                Start Date
              </Label>
              <Input
                id="start-date"
                type="date"
                value={filters.startDate}
                onChange={(e) => handleCustomDateChange('start', e.target.value)}
                disabled={isLoading}
                className="bg-background border-input text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date" className="text-xs font-medium text-muted-foreground">
                End Date
              </Label>
              <Input
                id="end-date"
                type="date"
                value={filters.endDate}
                onChange={(e) => handleCustomDateChange('end', e.target.value)}
                disabled={isLoading}
                className="bg-background border-input text-sm"
              />
            </div>
          </div>
        )}

        {/* Group By */}
        <div className="space-y-2">
          <Label htmlFor="group-by" className="text-sm font-medium text-foreground">
            Group By
          </Label>
          <Select value={filters.groupBy} onValueChange={handleGroupByChange} disabled={isLoading}>
            <SelectTrigger id="group-by" className="bg-background border-input">
              <SelectValue placeholder="Select grouping" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">By Date</SelectItem>
              <SelectItem value="region">By Region</SelectItem>
              <SelectItem value="dealer">By Dealer</SelectItem>
              <SelectItem value="product">By Product</SelectItem>
              <SelectItem value="status">By Status</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Apply Button */}
        <Button
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Apply Filters'}
        </Button>
      </div>
    </Card>
  );
};
