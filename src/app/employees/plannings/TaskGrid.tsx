import { WeekHeader } from './WeekHeader';
import { EmployeeRow } from './EmployeeRow';
import { DayInfo, Task, User, Project } from '@/app/types/planning';

interface TaskGridProps {
  days: DayInfo[];
  users: User[];
  getTasksForCell: (employeeId: number, day: DayInfo) => Task[];
  getProjectsForCell: (employeeId: number, day: DayInfo) => Project[];
  handleCellClick: (employeeId: number, day: DayInfo) => void;
  getEmployeeBackgroundColor: (employeeId: number) => string;
}

export const TaskGrid = ({
  days,
  users,
  getTasksForCell,
  getProjectsForCell,
  handleCellClick,
  getEmployeeBackgroundColor
}: TaskGridProps) => {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[1000px]">
        <WeekHeader days={days} />
        
        {users.map(user => (
          <EmployeeRow
            key={user.id_user}
            user={user}
            days={days}
            getTasksForCell={getTasksForCell}
            getProjectsForCell={getProjectsForCell}
            handleCellClick={handleCellClick}
            getEmployeeBackgroundColor={getEmployeeBackgroundColor}
          />
        ))}
      </div>
    </div>
  );
};
