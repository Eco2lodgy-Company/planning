// TaskModal.tsx
import React from 'react';

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

const TaskModal: React.FC<TaskModalProps> = ({ 
  newTask, 
  setNewTask, 
  handleAddTask, 
  closeModal,
  users,
  projects,
  departments
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white shadow-2xl p-8 rounded-lg w-2/3 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Ajouter une tâche</h2>
        <form onSubmit={handleAddTask}>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Libellé
              </label>
              <input
                type="text"
                value={newTask.libelle}
                onChange={(e) => setNewTask({ ...newTask, libelle: e.target.value })}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Niveau
              </label>
              <select
                value={newTask.niveau}
                onChange={(e) => setNewTask({ ...newTask, niveau: Number(e.target.value) })}
                className="w-full p-2 border rounded-lg"
                required
              >
                <option value={1}>Facile</option>
                <option value={2}>Moyen</option>
                <option value={3}>Difficile</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Projet
              </label>
              <select
                value={newTask.id_projet}
                onChange={(e) => setNewTask({ ...newTask, id_projet: Number(e.target.value) })}
                className="w-full p-2 border rounded-lg"
                required
              >
                <option value={0}>Choisissez le projet</option>
                {projects.map((project) => (
                  <option key={project.id_projet} value={project.id_projet}>
                    {project.project_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Échéance (jours)
              </label>
              <input
                type="number"
                value={newTask.echeance}
                onChange={(e) => setNewTask({ ...newTask, echeance: Number(e.target.value) })}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de début
              </label>
              <input
                type="date"
                value={newTask.datedebut}
                onChange={(e) => setNewTask({ ...newTask, datedebut: e.target.value })}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departement
              </label>
              <select
                value={newTask.departement}
                onChange={(e) => setNewTask({ ...newTask, departement: Number(e.target.value) })}
                className="w-full p-2 border rounded-lg"
                required
              >
                <option value={0}>Choisissez le département</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.titre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priorité
              </label>
              <select
                value={newTask.priorite}
                onChange={(e) => setNewTask({ ...newTask, priorite: Number(e.target.value) })}
                className="w-full p-2 border rounded-lg"
                required
              >
                <option value={1}>Basse</option>
                <option value={2}>Moyenne</option>
                <option value={3}>Élevée</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Utilisateur
              </label>
              <select
                value={newTask.id_user}
                onChange={(e) => setNewTask({ ...newTask, id_user: Number(e.target.value) })}
                className="w-full p-2 border rounded-lg"
                required
              >
                <option value={0}>Sélectionnez un utilisateur</option>
                {users && users.map((user) => (
                  <option key={user.id_user} value={user.id_user}>
                    {user.nom_complet}
                  </option>
                ))}
              </select>
            </div>
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

export default TaskModal;