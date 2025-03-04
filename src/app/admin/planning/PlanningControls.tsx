import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Download, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DayInfo } from '@/app/types/planning';

interface PlanningControlsProps {
  days: DayInfo[];
  selectedMonth: number;
  selectedYear: number;
  changeWeek: (direction: number) => void;
  handleMonthChange: (value: string) => void;
  handleYearChange: (value: string) => void;
  months: { value: string; label: string }[];
  years: number[];
  generatePDF: () => void;
  isSubmitting: boolean;
}

export const PlanningControls = ({
  days,
  selectedMonth,
  selectedYear,
  changeWeek,
  handleMonthChange,
  handleYearChange,
  months,
  years,
  generatePDF,
  isSubmitting
}: PlanningControlsProps) => {
  return (
    <div className="p-4 md:p-6 border-b border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Button 
          onClick={() => changeWeek(-1)}
          variant="outline"
          size="icon"
          className="h-9 w-9"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="text-lg font-medium text-slate-800 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          <span>
            Semaine du {format(days[0].date, 'dd MMMM', { locale: fr })} au {format(days[6].date, 'dd MMMM yyyy', { locale: fr })}
          </span>
        </div>
        
        <Button 
          onClick={() => changeWeek(1)}
          variant="outline"
          size="icon"
          className="h-9 w-9"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700">Mois:</span>
          <Select
            value={selectedMonth.toString()}
            onValueChange={handleMonthChange}
          >
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Sélectionner un mois" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700">Année:</span>
          <Select
            value={selectedYear.toString()}
            onValueChange={handleYearChange}
          >
            <SelectTrigger className="w-[100px] h-9">
              <SelectValue placeholder="Année" />
            </SelectTrigger>
            <SelectContent>
              {years.map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          variant="default" 
          className="h-9 gap-2 bg-blue-600 hover:bg-blue-700 text-white" 
          onClick={generatePDF}
          disabled={isSubmitting}
        >
          <Download className="h-4 w-4" />
          <span>Exporter en PDF</span>
        </Button>
      </div>
    </div>
  );
};
