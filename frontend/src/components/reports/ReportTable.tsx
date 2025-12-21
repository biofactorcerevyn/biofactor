import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { format } from 'date-fns';

export interface ReportTableRow {
  [key: string]: any;
  id?: string;
}

interface Column {
  key: string;
  label: string;
  render?: (value: unknown, row: ReportTableRow) => React.ReactNode;
  className?: string;
}

interface ReportTableProps {
  title?: string;
  columns: Column[];
  data: ReportTableRow[];
  rowsPerPage?: number;
  isLoading?: boolean;
  emptyMessage?: string;
}

export const ReportTable: React.FC<ReportTableProps> = ({
  title = 'Report Details',
  columns,
  data,
  rowsPerPage = 10,
  isLoading = false,
  emptyMessage = 'No data available',
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  if (isLoading) {
    return (
      <Card className="p-6 shadow-card">
        {title && <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>}
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-2">
            <Loader className="w-8 h-8 text-primary animate-spin" />
            <p className="text-muted-foreground">Loading data...</p>
          </div>
        </div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="p-6 shadow-card">
        {title && <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>}
        <div className="flex items-center justify-center h-40">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 shadow-card">
      {title && <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>}
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left font-semibold text-foreground bg-secondary/30 ${
                    column.className || ''
                  }`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                className="border-b border-border hover:bg-secondary/20 transition-colors"
              >
                {columns.map((column) => {
                  const value = row[column.key];
                  const rendered = column.render ? column.render(value, row) : value;

                  return (
                    <td
                      key={`${row.id || rowIndex}-${column.key}`}
                      className={`px-4 py-3 text-foreground ${column.className || ''}`}
                    >
                      {rendered || '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} results
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="border-border text-foreground hover:bg-secondary"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium text-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="border-border text-foreground hover:bg-secondary"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
