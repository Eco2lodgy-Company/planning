import React, { memo } from 'react';

interface User {
  id_user: number;
  nom_complet: string;
}

interface Project {
  id_projet: number;
  project_name: string;
}

interface Department {
  id: number;
  titre: string;
}

interface TaskModalProps {
  newTask: {
    libelle: string;
    niveau: number;
    id_projet: number;
    echeance: number;
    datedebut: string;
    status: string;
    departement: number;
    priorite: number;
    id_user: number;
  };
  setNewTask: React.Dispatch<React.SetStateAction<{
    libelle: string;
    niveau: number;
    id_projet: number;
    echeance: number;
    datedebut: string;
    status: string;
    departement: number;
    priorite: number;
    id_user: number;
  }>>;
  handleAddTask: (e: React.FormEvent) => Promise<void>;
  closeModal: () => void;
  users: User[];
  projects: Project[];
  departments: Department[];
}

// Form field component for reusability and cleaner code
const FormField = memo(({ 
  label, 
  children 
}: { 
  label: string, 
  children: React.ReactNode 
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    {children}
  </div>
));

FormField.displayName = 'FormField';

// Select field component for all dropdown menus
const SelectField = memo(({ 
  value, 
  onChange, 
  options, 
  defaultOption = "Choisir une option" 
}: { 
  value: number, 
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, 
  options: {value: number, label: string}[],
  defaultOption?: string
}) => (
  <select
    value={value}
    onChange={onChange}
    className="w-full p-2 border rounded-lg"
    required
  >
    <option value={0}>{defaultOption}</option>
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
));

SelectField.displayName = 'SelectField';

const TaskModal: React.FC<TaskModalProps> = ({ 
  newTask, 
  setNewTask, 
  handleAddTask, 
  closeModal,
  users,
  projects,
  departments
}) => {
  // Handler functions for form changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: Number(value) }));
  };

  // Options for select fields
  const difficultyOptions = [
    { value: 1, label: "Facile" },
    { value: 2, label: "Moyen" },
    { value: 3, label: "Difficile" }
  ];

  const priorityOptions = [
    { value: 1, label: "Basse" },
    { value: 2, label: "Moyenne" },
    { value: 3, label: "Élevée" }
  ];

  const userOptions = users.map(user => ({ 
    value: user.id_user, 
    label: user.nom_complet 
  }));

  const projectOptions = projects.map(project => ({ 
    value: project.id_projet, 
    label: project.project_name 
  }));

  const departmentOptions = departments.map(dept => ({ 
    value: dept.id, 
    label: dept.titre 
  }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white shadow-2xl p-8 rounded-lg w-2/3 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Ajouter une tâche</h2>
        <form onSubmit={handleAddTask}>
          <div className="grid grid-cols-2 gap-6">
            <FormField label="Libellé">
              <input
                type="text"
                name="libelle"
                value={newTask.libelle}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
                required
              />
            </FormField>
            
            <FormField label="Niveau">
              <SelectField
                value={newTask.niveau}
                onChange={(e) => handleSelectChange({ ...e, target: { ...e.target, name: "niveau" } })}
                options={difficultyOptions}
              />
            </FormField>
            
            <FormField label="Projet">
              <SelectField
                value={newTask.id_projet}
                onChange={(e) => handleSelectChange({ ...e, target: { ...e.target, name: "id_projet" } })}
                options={projectOptions}
                defaultOption="Choisissez le projet"
              />
            </FormField>
            
            <FormField label="Échéance (jours)">
              <input
                type="number"
                name="echeance"
                value={newTask.echeance}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
                required
                min="1"
              />
            </FormField>
            
            <FormField label="Date de début">
              <input
                type="date"
                name="datedebut"
                value={newTask.datedebut}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
                required
              />
            </FormField>
            
            <FormField label="Departement">
              <SelectField
                value={newTask.departement}
                onChange={(e) => handleSelectChange({ ...e, target: { ...e.target, name: "departement" } })}
                options={departmentOptions}
                defaultOption="Choisissez le département"
              />
            </FormField>
            
            <FormField label="Priorité">
              <SelectField
                value={newTask.priorite}
                onChange={(e) => handleSelectChange({ ...e, target: { ...e.target, name: "priorite" } })}
                options={priorityOptions}
              />
            </FormField>
            
            <FormField label="Utilisateur">
              <SelectField
                value={newTask.id_user}
                onChange={(e) => handleSelectChange({ ...e, target: { ...e.target, name: "id_user" } })}
                options={userOptions}
                defaultOption="Sélectionnez un utilisateur"
              />
            </FormField>
          </div>
          
          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default memo(TaskModal);