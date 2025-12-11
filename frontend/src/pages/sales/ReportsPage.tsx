import React, { useState, useMemo } from 'react';
import { ReportFilters, ReportFiltersType } from '@/components/reports/ReportFilters';
import { KpiCards } from '@/components/reports/KpiCards';
import { ChartPanel } from '@/components/reports/ChartPanel';
import { ReportTable } from '@/components/reports/ReportTable';
import { ExportControls } from '@/components/reports/ExportControls';
import { format } from 'date-fns';
import { FileText } from 'lucide-react';

// Mock data service
const fetchReports = async (filters: ReportFiltersType) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Generate mock data based on filters
  const generateChartData = () => {
    const days = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push({
        name: format(date, 'MMM dd'),
        revenue: Math.floor(Math.random() * 50000) + 20000,
        orders: Math.floor(Math.random() * 50) + 10,
        customers: Math.floor(Math.random() * 30) + 5,
      });
    }
    return days;
  };

  const generateTableData = () => {
    const regions = ['North', 'South', 'East', 'West', 'Central'];
    const statuses = ['Completed', 'Pending', 'In Progress'];
    const data = [];

    for (let i = 0; i < 25; i++) {
      data.push({
        id: `report-${i}`,
        date: format(new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), 'dd MMM yyyy'),
        region: regions[Math.floor(Math.random() * regions.length)],
        dealer: `Dealer ${Math.floor(Math.random() * 100) + 1}`,
        orders: Math.floor(Math.random() * 50) + 1,
        revenue: Math.floor(Math.random() * 500000) + 10000,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        conversionRate: (Math.random() * 40 + 20).toFixed(2),
      });
    }
    return data;
  };

  const chartData = generateChartData();
  const tableData = generateTableData();

  const totalRevenue = chartData.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = chartData.reduce((sum, d) => sum + d.orders, 0);
  const totalCustomers = chartData.reduce((sum, d) => sum + d.customers, 0);
  const conversionRate = (totalCustomers / totalOrders) * 100;

  return {
    kpis: {
      totalRevenue,
      totalRevenueChange: Math.random() > 0.5 ? Math.random() * 20 : -Math.random() * 10,
      newCustomers: totalCustomers,
      newCustomersChange: Math.random() > 0.5 ? Math.random() * 25 : -Math.random() * 15,
      conversionRate,
      conversionRateChange: Math.random() > 0.5 ? Math.random() * 5 : -Math.random() * 3,
    },
    chartData,
    tableData,
  };
};

export default function SalesReportsPage() {
  const [filters, setFilters] = useState<ReportFiltersType>({
    reportType: 'overview',
    dateRange: 'month',
    startDate: format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    groupBy: 'date',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<{
    kpis: {
      totalRevenue: number;
      totalRevenueChange: number;
      newCustomers: number;
      newCustomersChange: number;
      conversionRate: number;
      conversionRateChange: number;
    };
    chartData: Array<{ name: string; revenue: number; orders: number; customers: number }>;
    tableData: Array<{
      id: string;
      date: string;
      region: string;
      dealer: string;
      orders: number;
      revenue: number;
      status: string;
      conversionRate: string;
    }>;
  } | null>(null);

  // Load initial data
  React.useEffect(() => {
    loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadReports = async () => {
    setIsLoading(true);
    try {
      const data = await fetchReports(filters);
      setReportData(data);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = async (newFilters: ReportFiltersType) => {
    setFilters(newFilters);
    setIsLoading(true);
    try {
      const data = await fetchReports(newFilters);
      setReportData(data);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    const today = new Date();
    const defaultFilters: ReportFiltersType = {
      reportType: 'overview',
      dateRange: 'month',
      startDate: format(new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      endDate: format(today, 'yyyy-MM-dd'),
      groupBy: 'date',
    };
    setFilters(defaultFilters);
    setIsLoading(true);
    fetchReports(defaultFilters).then((data) => {
      setReportData(data);
      setIsLoading(false);
    });
  };

  const handleExportCSV = () => {
    if (!reportData?.tableData) return;

    const headers = ['Date', 'Region', 'Dealer', 'Orders', 'Revenue', 'Status', 'Conversion Rate'];
    const csv = [
      headers.join(','),
      ...reportData.tableData.map((row: typeof reportData.tableData[0]) =>
        [row.date, row.region, row.dealer, row.orders, row.revenue, row.status, row.conversionRate].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    // Simple print-to-PDF using browser print dialog
    window.print();
  };

  const getChartTitle = () => {
    const titles: Record<string, string> = {
      overview: 'Revenue & Orders Trend',
      regional: 'Regional Performance',
      dealer: 'Dealer Performance',
      product: 'Product Sales Trend',
      conversion: 'Conversion Metrics Trend',
      customer: 'Customer Growth',
    };
    return titles[filters.reportType] || 'Report Chart';
  };

  const getTableTitle = () => {
    const titles: Record<string, string> = {
      overview: 'Sales Summary',
      regional: 'Regional Details',
      dealer: 'Dealer Details',
      product: 'Product Sales Details',
      conversion: 'Conversion Details',
      customer: 'Customer Details',
    };
    return titles[filters.reportType] || 'Report Details';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-border px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Sales & Marketing Reports</h1>
          </div>
          <p className="text-muted-foreground">Analyze sales performance and marketing metrics</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Filters */}
          <div className="lg:col-span-1">
            <ReportFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleReset}
              isLoading={isLoading}
            />
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* KPI Cards */}
            <KpiCards
              data={reportData?.kpis || {
                totalRevenue: 0,
                newCustomers: 0,
                conversionRate: 0,
              }}
              isLoading={isLoading}
            />

            {/* Export Controls */}
            <div className="flex justify-end">
              <ExportControls
                onExportCSV={handleExportCSV}
                onExportPDF={handleExportPDF}
                isLoading={isLoading}
                disabled={!reportData?.tableData || reportData.tableData.length === 0}
              />
            </div>

            {/* Chart */}
            <ChartPanel
              title={getChartTitle()}
              data={reportData?.chartData || []}
              chartType={filters.reportType === 'regional' ? 'bar' : 'area'}
              dataKeys={['revenue', 'orders']}
              colors={['hsl(142, 60%, 35%)', 'hsl(199, 89%, 48%)']}
              isLoading={isLoading}
              height={400}
            />

            {/* Table */}
            <ReportTable
              title={getTableTitle()}
              columns={[
                { key: 'date', label: 'Date' },
                { key: 'region', label: 'Region' },
                { key: 'dealer', label: 'Dealer' },
                { key: 'orders', label: 'Orders' },
                {
                  key: 'revenue',
                  label: 'Revenue',
                  render: (value) => `₹${(value || 0).toLocaleString('en-IN')}`,
                },
                {
                  key: 'status',
                  label: 'Status',
                  render: (value) => {
                    const statusClasses: Record<string, string> = {
                      'Completed': 'bg-success/10 text-success',
                      'Pending': 'bg-warning/10 text-warning',
                      'In Progress': 'bg-info/10 text-info',
                    };
                    return (
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusClasses[value] || 'bg-muted text-muted-foreground'}`}
                      >
                        {value}
                      </span>
                    );
                  },
                },
                {
                  key: 'conversionRate',
                  label: 'Conversion Rate',
                  render: (value) => `${value}%`,
                },
              ]}
              data={reportData?.tableData || []}
              isLoading={isLoading}
              emptyMessage="No report data available. Try adjusting your filters."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
