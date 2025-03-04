import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DayInfo } from '@/app/types/planning';

interface WeekHeaderProps {
  days: DayInfo[];
}

export const WeekHeader = ({ days }: WeekHeaderProps) => {
  return (
    <div className="grid grid-cols-8 border-b border-slate-200">
      <div className="p-4 font-medium text-slate-700 bg-slate-50 border-r border-slate-200">
        Employés
      </div>
      {days.map((day, i) => (
        <div
          key={i}
          className={`p-4 font-medium text-slate-700 text-center border-r border-slate-200 last:border-r-0 ${
            day.isWeekend ? 'bg-red-50/50' : 'bg-slate-50'
          }`}
        >
          <div className="text-sm uppercase tracking-wide">{format(day.date, 'EEEE', { locale: fr })}</div>
          <div className="text-lg">{format(day.date, 'dd')}</div>
          <div className="text-xs text-slate-500">{format(day.date, 'MMMM yyyy', { locale: fr })}</div>
        </div>
      ))}
    </div>
  );
};
