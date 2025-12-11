import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Printer } from 'lucide-react';

interface ExportControlsProps {
  onExportCSV: () => void;
  onExportPDF: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const ExportControls: React.FC<ExportControlsProps> = ({
  onExportCSV,
  onExportPDF,
  isLoading = false,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button
        onClick={onExportCSV}
        disabled={isLoading || disabled}
        className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        Export CSV
      </Button>
      <Button
        onClick={onExportPDF}
        disabled={isLoading || disabled}
        className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors flex items-center gap-2"
      >
        <Printer className="w-4 h-4" />
        Print / PDF
      </Button>
    </div>
  );
};
