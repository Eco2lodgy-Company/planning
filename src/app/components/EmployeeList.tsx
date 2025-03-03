import { useContext } from 'react';
import PlanningContext from '../admin/pl/PlanningContext';

export default function EmployeeList() {
  const { tasks } = useContext(PlanningContext);
  const employees = ['Employé 1', 'Employé 2', 'Employé 3']; // Exemple d'employés

  return (
    <div className="w-1/6">
      {employees.map((employee, index) => (
        <div key={index} className="p-2 border-b">
          {employee}
        </div>
      ))}
    </div>
  );
}