# Reports Module - Integration & Usage Guide

## Quick Start

### 1. Access the Reports Page

**Via Navigation:**
- Click "Sales & Marketing" in the sidebar
- Click "Reports" from the submenu
- Or navigate to: `http://localhost:5173/sales/reports`

**URL:** `/sales/reports`

---

## Component Usage Examples

### Example 1: Using ReportFilters Standalone

```typescript
import { ReportFilters, ReportFiltersType } from '@/components/reports';
import { useState } from 'react';

export function MyFiltersComponent() {
  const [filters, setFilters] = useState<ReportFiltersType>({
    reportType: 'overview',
    dateRange: 'month',
    startDate: '2025-11-09',
    endDate: '2025-12-09',
    groupBy: 'date',
  });

  const handleFilterChange = (newFilters: ReportFiltersType) => {
    setFilters(newFilters);
    // Fetch data with new filters
  };

  return (
    <ReportFilters
      filters={filters}
      onFilterChange={handleFilterChange}
      onReset={() => setFilters({...})}
      isLoading={false}
    />
  );
}
```

### Example 2: Displaying KPI Cards

```typescript
import { KpiCards } from '@/components/reports';

export function MyDashboard() {
  return (
    <KpiCards
      data={{
        totalRevenue: 5000000,
        totalRevenueChange: 15,
        newCustomers: 850,
        newCustomersChange: 22,
        conversionRate: 42.5,
        conversionRateChange: 3.2,
      }}
      isLoading={false}
    />
  );
}
```

### Example 3: Rendering Charts

```typescript
import { ChartPanel } from '@/components/reports';

export function RevenueChart() {
  const chartData = [
    { name: 'Week 1', revenue: 45000, orders: 25 },
    { name: 'Week 2', revenue: 52000, orders: 28 },
    { name: 'Week 3', revenue: 61000, orders: 32 },
    // ... more data
  ];

  return (
    <ChartPanel
      title="Revenue Trend"
      data={chartData}
      chartType="area"
      dataKeys={['revenue', 'orders']}
      colors={['hsl(142, 60%, 35%)', 'hsl(199, 89%, 48%)']}
      height={400}
      xAxisKey="name"
    />
  );
}
```

### Example 4: Data Tables

```typescript
import { ReportTable } from '@/components/reports';
import { format } from 'date-fns';

export function SalesTable() {
  const tableData = [
    {
      id: '1',
      date: format(new Date(), 'dd MMM yyyy'),
      region: 'North',
      dealer: 'Dealer ABC',
      orders: 15,
      revenue: 250000,
      status: 'Completed',
      conversionRate: '42.5',
    },
    // ... more rows
  ];

  return (
    <ReportTable
      title="Sales Details"
      data={tableData}
      rowsPerPage={10}
      columns={[
        { key: 'date', label: 'Date' },
        { key: 'region', label: 'Region' },
        { key: 'dealer', label: 'Dealer' },
        { key: 'orders', label: 'Orders' },
        {
          key: 'revenue',
          label: 'Revenue',
          render: (value) => `₹${(value as number).toLocaleString()}`,
        },
        {
          key: 'status',
          label: 'Status',
          render: (value) => {
            const colors = {
              'Completed': 'bg-success/10 text-success',
              'Pending': 'bg-warning/10 text-warning',
              'In Progress': 'bg-info/10 text-info',
            };
            return (
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                colors[value as keyof typeof colors] || ''
              }`}>
                {value}
              </span>
            );
          },
        },
        {
          key: 'conversionRate',
          label: 'Conv. Rate',
          render: (value) => `${value}%`,
        },
      ]}
    />
  );
}
```

### Example 5: Export Controls

```typescript
import { ExportControls } from '@/components/reports';

export function MyExportSection() {
  const handleCSVExport = () => {
    const csv = 'Name,Value\nData1,100\nData2,200';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'report.csv';
    a.click();
  };

  const handlePDFExport = () => {
    window.print();
  };

  return (
    <ExportControls
      onExportCSV={handleCSVExport}
      onExportPDF={handlePDFExport}
      isLoading={false}
      disabled={false}
    />
  );
}
```

---

## Connecting to Real Data

### Using Supabase

```typescript
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';

export function SalesReportsPage() {
  const [filters, setFilters] = useState<ReportFiltersType>({...});

  // Fetch real data from Supabase
  const { data: orders = [] } = useSupabaseQuery<Order>('orders', {
    orderBy: { column: 'created_at', ascending: false }
  });

  const { data: dealers = [] } = useSupabaseQuery<Dealer>('dealers');

  // Calculate KPIs from real data
  const kpis = useMemo(() => {
    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.created_at);
      return orderDate >= new Date(filters.startDate) && 
             orderDate <= new Date(filters.endDate);
    });

    const totalRevenue = filteredOrders.reduce(
      (sum, o) => sum + (o.net_amount || 0), 0
    );
    const newCustomers = new Set(filteredOrders.map(o => o.dealer_id)).size;

    return {
      totalRevenue,
      newCustomers,
      conversionRate: (newCustomers / filteredOrders.length) * 100,
    };
  }, [orders, filters]);

  return <KpiCards data={kpis} />;
}
```

### Using a Custom API

```typescript
const fetchReports = async (filters: ReportFiltersType) => {
  const response = await fetch('/api/reports', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filters),
  });
  return response.json();
};

// In component:
const handleFilterChange = async (newFilters: ReportFiltersType) => {
  setIsLoading(true);
  try {
    const data = await fetchReports(newFilters);
    setReportData(data);
  } finally {
    setIsLoading(false);
  }
};
```

---

## Customization Examples

### Custom Date Range Formatting

```typescript
// In ReportFilters component
const formatDateLabel = (date: string): string => {
  return format(new Date(date), 'MMMM dd, yyyy');
};
```

### Custom Chart Colors

```typescript
<ChartPanel
  title="Sales by Region"
  data={data}
  colors={[
    'hsl(142, 60%, 35%)',    // Primary green
    'hsl(199, 89%, 48%)',    // Sales blue
    'hsl(174, 62%, 40%)',    // Finance teal
    'hsl(262, 52%, 50%)',    // Manufacturing purple
  ]}
/>
```

### Custom Table Rendering

```typescript
const columns = [
  {
    key: 'revenue',
    label: 'Revenue',
    render: (value: unknown, row: ReportTableRow) => {
      const num = value as number;
      const formatted = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(num);
      
      return (
        <span className="font-semibold text-success">
          {formatted}
        </span>
      );
    },
  },
];
```

---

## Advanced Features

### Filtering by Department

```typescript
interface ExtendedFiltersType extends ReportFiltersType {
  department?: 'sales' | 'marketing' | 'fieldops';
}

const handleDepartmentChange = (dept: string) => {
  setFilters(prev => ({
    ...prev,
    department: dept as any,
  }));
};
```

### Adding More Report Types

```typescript
const reportTypeOptions = [
  { value: 'overview', label: 'Sales Overview' },
  { value: 'regional', label: 'Regional Performance' },
  { value: 'dealer', label: 'Dealer Analysis' },
  { value: 'product', label: 'Product Performance' },
  { value: 'conversion', label: 'Conversion Metrics' },
  { value: 'customer', label: 'Customer Growth' },
  // Add more types here
];
```

### Caching Reports

```typescript
const reportCache = useRef<Map<string, any>>(new Map());

const getCachedReport = (cacheKey: string) => {
  return reportCache.current.get(cacheKey);
};

const setCachedReport = (cacheKey: string, data: any) => {
  reportCache.current.set(cacheKey, data);
};
```

---

## CSS Customization

### Using CSS Variables

```css
/* Override brand colors if needed */
:root {
  --primary: 142 60% 35%;  /* Green */
  --primary-foreground: 0 0% 100%;  /* White */
  --sales: 199 89% 48%;  /* Blue */
}
```

### Adding Custom Classes

```typescript
// In component
<div className="custom-reports-container">
  {/* Content */}
</div>
```

```css
/* In CSS file */
.custom-reports-container {
  --custom-spacing: 2rem;
  padding: var(--custom-spacing);
}
```

---

## Performance Optimization

### Memoization

```typescript
const memoizedData = useMemo(() => {
  return processReportData(reportData);
}, [reportData]);
```

### Lazy Loading Tables

```typescript
const [displayedRows, setDisplayedRows] = useState(10);

const loadMoreRows = () => {
  setDisplayedRows(prev => prev + 10);
};

// Show load more button when needed
{displayedRows < data.length && (
  <Button onClick={loadMoreRows}>Load More</Button>
)}
```

### Virtualized Lists (for large datasets)

```typescript
// Consider using react-window for thousands of rows
import { FixedSizeList } from 'react-window';
```

---

## Error Handling

```typescript
const handleFilterChange = async (newFilters: ReportFiltersType) => {
  setIsLoading(true);
  setError(null);
  try {
    const data = await fetchReports(newFilters);
    setReportData(data);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to load reports');
    toast.error('Error loading reports');
  } finally {
    setIsLoading(false);
  }
};

// Display error message
{error && (
  <div className="bg-destructive/10 text-destructive p-4 rounded-md">
    {error}
  </div>
)}
```

---

## Testing Examples

### Unit Test (Jest + React Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import { KpiCards } from '@/components/reports';

describe('KpiCards', () => {
  it('renders three KPI cards', () => {
    render(
      <KpiCards
        data={{
          totalRevenue: 1000000,
          newCustomers: 100,
          conversionRate: 50,
        }}
      />
    );
    
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('New Customers')).toBeInTheDocument();
    expect(screen.getByText('Conversion Rate')).toBeInTheDocument();
  });
});
```

### Integration Test

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import SalesReportsPage from '@/pages/sales/ReportsPage';

describe('SalesReportsPage', () => {
  it('filters data when filters are applied', async () => {
    render(<SalesReportsPage />);
    
    const reportTypeSelect = screen.getByDisplayValue('Sales Overview');
    fireEvent.change(reportTypeSelect, { target: { value: 'regional' } });
    
    // Wait for data to reload
    await screen.findByText('Regional Details');
  });
});
```

---

## Troubleshooting

### Issue: Charts not displaying

**Solution:** Ensure Recharts is properly installed:
```bash
npm install recharts
```

### Issue: Filters not applying

**Solution:** Check that `onFilterChange` callback is properly connected:
```typescript
<ReportFilters
  filters={filters}
  onFilterChange={handleFilterChange}  // Must be defined
  onReset={handleReset}
/>
```

### Issue: Export button not working

**Solution:** Ensure data exists before exporting:
```typescript
disabled={!reportData?.tableData || reportData.tableData.length === 0}
```

### Issue: Table pagination not working

**Solution:** Verify data array is being passed:
```typescript
<ReportTable
  data={reportData?.tableData || []}  // Fallback to empty array
  rowsPerPage={10}
/>
```

---

## API Response Format (Expected)

```typescript
interface ReportResponse {
  kpis: {
    totalRevenue: number;
    totalRevenueChange: number;
    newCustomers: number;
    newCustomersChange: number;
    conversionRate: number;
    conversionRateChange: number;
  };
  chartData: Array<{
    name: string;
    [key: string]: string | number;
  }>;
  tableData: Array<{
    id: string;
    date: string;
    region: string;
    dealer: string;
    orders: number;
    revenue: number;
    status: 'Completed' | 'Pending' | 'In Progress';
    conversionRate: string;
  }>;
}
```

---

## Environment Variables (if needed)

```env
# .env.local
VITE_REPORTS_API_URL=http://localhost:3000/api
VITE_REPORT_EXPORT_FORMAT=xlsx
```

```typescript
const apiUrl = import.meta.env.VITE_REPORTS_API_URL || '/api';
```

---

## Migration Guide (From Old Reports to New)

If you had an older reports implementation:

1. **Remove old imports:**
   ```typescript
   // Old
   import { exportToCSV, exportToExcel } from '@/lib/export';
   
   // New
   import { ExportControls } from '@/components/reports';
   ```

2. **Update route:**
   ```typescript
   // Old
   <Route path="/sales/reports" element={<SalesDashboard />} />
   
   // New
   <Route path="/sales/reports" element={<SalesReportsPage />} />
   ```

3. **Migrate data:**
   Transfer any custom logic to the new `fetchReports` function.

---

**Version:** 1.0
**Last Updated:** December 9, 2025
**Support:** Refer to REPORTS_MODULE_IMPLEMENTATION.md
