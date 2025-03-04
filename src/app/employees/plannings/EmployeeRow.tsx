import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import { TaskCard } from '@/app/components/TaskCard';
import { DayInfo, Task, User, Project } from '@/app/types/planning';

interface EmployeeRowProps {
  user: User;
  days: DayInfo[];
  getTasksForCell: (employeeId: number, day: DayInfo) => Task[];
  getProjectsForCell: (employeeId: number, day: DayInfo) => Project[];
  handleCellClick: (employeeId: number, day: DayInfo) => void;
  getEmployeeBackgroundColor: (employeeId: number) => string;
}

export const EmployeeRow = ({
  user,
  days,
  getTasksForCell,
  getProjectsForCell,
  handleCellClick,
  getEmployeeBackgroundColor
}: EmployeeRowProps) => {
  return (
    <div className="grid grid-cols-8 border-b border-slate-200 last:border-b-0">
      <div className={`p-4 font-medium border-r border-slate-200 flex items-center ${user.color || 'bg-gray-100 border-gray-200 text-gray-800'}`}>
        {user.nom_complet}
      </div>
      {days.map((day, i) => {
        const cellTasks = getTasksForCell(user.id_user, day);
        const cellProjects = getProjectsForCell(user.id_user, day);
        const totalItems = cellTasks.length + cellProjects.length;
        
        return (
          <div 
            key={i} 
            className={`p-3 min-h-28 border-r border-slate-200 last:border-r-0 hover:bg-slate-50/75 transition-colors ${
              day.isWeekend ? 'bg-red-50/20' : getEmployeeBackgroundColor(user.id_user)
            }`}
            onClick={() => handleCellClick(user.id_user, day)}
          >
            <div className="flex flex-col gap-2 h-full relative">
              {cellProjects.map((project, j) => (
                <TaskCard key={`project-${j}`} label={project.project_name} type="project" />
              ))}
              
              {cellTasks.map((task, j) => (
                <TaskCard key={`task-${j}`} label={task.libelle} type="task" />
              ))}
              
              {totalItems < 3 && (
                <button 
                  className="mt-auto text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center gap-1"
                >
                  <Plus className="h-3 w-3" />
                  <span>{totalItems > 0 ? 'Ajouter' : 'Ajouter une tâche'}</span>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};