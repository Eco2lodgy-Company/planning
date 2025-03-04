import { useContext } from 'react';
import PlanningContext from '../context/PlanningContext';

export default function WeekView({ currentWeek }) {
  const { tasks, handleTaskAssignment } = useContext(PlanningContext);
  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

  return (
    <div className="flex-1">
      <div className="flex">
        {days.map((day, index) => (
          <div key={index} className="flex-1 p-2 border-b">
            <h2 className="font-bold mb-2">{day}</h2>
            <div>
              {Object.keys(tasks).map((employeeId) => (
                <div key={employeeId} className="flex items-center">
                  {tasks[employeeId][day]?.map((task, index) => (
                    <div key={index} className="bg-gray-200 p-2 rounded mr-2">
                      {task}
                    </div>
                  ))}
                  <button onClick={() => handleTaskAssignment(employeeId, day, 'Nouvelle tâche')} className="bg-blue-500 text-white px-2 py-1 rounded">+</button>
                </div>
              ))}
            </div>