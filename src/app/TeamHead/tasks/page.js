'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

// Sample data for dropdowns
const sampleEmployees = [
  { id: '1', name: 'Jean Dupont' },
  { id: '2', name: 'Marie Martin' },
  { id: '3', name: 'Pierre Bernard' }
];

const sampleProjects = [
  { id: '1', name: 'Projet A' },
  { id: '2', name: 'Projet B' },
  { id: '3', name: 'Projet C' }
];

const sampleDepartments = [
  'Informatique',
  'Marketing',
  'Ressources Humaines',
  'Finance'
];

const difficultyLevels = [
  'Facile',
  'Moyen',
  'Difficile'
];

const statusColors = {
  'En attente': 'bg-yellow-100 text-yellow-800',
  'En cours': 'bg-blue-100 text-blue-800',
  'Terminé': 'bg-green-100 text-green-800',
  'Annulé': 'bg-red-100 text-red-800'
};

export default function TaskManagementPage() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([
    {
      id: '1',
      libelle: 'Développement Frontend',
      niveau: 'Moyen',
      id_user: 'Jean Dupont',
      id_projet: 'Projet A',
      departement: 'Informatique',
      echeance: '7',
      dateDebut: '2024-03-15',
      status: 'En cours'
    },
    {
      id: '2',
      libelle: 'Analyse des besoins',
      niveau: 'Facile',
      id_user: 'Marie Martin',
      id_projet: 'Projet B',
      departement: 'Marketing',
      echeance: '5',
      dateDebut: '2024-03-16',
      status: 'En attente'
    }
  ]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    libelle: '',
    niveau: '',
    id_user: '',
    id_projet: '',
    departement: '',
    echeance: '',
    dateDebut: '',
    status: 'En attente',
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleCreateTask = () => {
    setIsPopupOpen(true);
  };

  const handleSubmitTask = () => {
    if (newTask.libelle && newTask.niveau && newTask.id_user && newTask.id_projet && newTask.echeance && newTask.dateDebut) {
      setTasks((prevTasks) => [
        ...prevTasks,
        { id: (prevTasks.length + 1).toString(), ...newTask },
      ]);
      setIsPopupOpen(false);
      setNewTask({
        libelle: '',
        niveau: '',
        id_user: '',
        id_projet: '',
        departement: '',
        echeance: '',
        dateDebut: '',
        status: 'En attente',
      });
      toast('Tâche ajoutée avec succès');
    } else {
      toast('Veuillez remplir les champs obligatoires');
    }
  };

  const handleEditTask = (taskId) => {
    const taskToEdit = tasks.find(task => task.id === taskId);
    if (taskToEdit) {
      setNewTask(taskToEdit);
      setIsPopupOpen(true);
    }
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      setTasks(tasks.filter(task => task.id !== taskId));
      toast('Tâche supprimée avec succès');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-6">
      <header className="flex items-center justify-between p-4 bg-white shadow rounded-md">
        <h2 className="text-lg font-semibold text-gray-800">Gestion des Tâches</h2>
        <button
          onClick={handleCreateTask}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md hover:bg-blue-600"
        >
          <Plus /> Nouvelle Tâche
        </button>
      </header>

      <motion.main className="flex-1 mt-4 overflow-y-auto">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-black font-medium mb-4">Liste des Tâches</h3>
          <table className="w-full border-collapse text-sm text-gray-800">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="px-4 py-2 text-left">Libellé</th>
                <th className="px-4 py-2 text-left">Niveau</th>
                <th className="px-4 py-2 text-left">Utilisateur</th>
                <th className="px-4 py-2 text-left">Projet</th>
                <th className="px-4 py-2 text-left">Département</th>
                <th className="px-4 py-2 text-left">Échéance</th>
                <th className="px-4 py-2 text-left">Date Début</th>
                <th className="px-4 py-2 text-left">Statut</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="border-t">
                  <td className="px-4 py-2">{task.libelle}</td>
                  <td className="px-4 py-2">{task.niveau}</td>
                  <td className="px-4 py-2">{task.id_user}</td>
                  <td className="px-4 py-2">{task.id_projet}</td>
                  <td className="px-4 py-2">{task.departement}</td>
                  <td className="px-4 py-2">{task.echeance} jours</td>
                  <td className="px-4 py-2">{task.dateDebut}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditTask(task.id)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Modifier"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.main>

      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button onClick={() => setIsPopupOpen(false)} className="absolute top-2 right-2 text-gray-600 hover:text-black">
              <X />
            </button>
            <h3 className="text-lg font-semibold mb-4">Nouvelle Tâche</h3>
            <input 
              type="text" 
              placeholder="Libellé" 
              value={newTask.libelle} 
              onChange={(e) => setNewTask({ ...newTask, libelle: e.target.value })} 
              className="w-full p-2 border rounded mb-2 text-black" 
            />
            
            <select 
              value={newTask.niveau} 
              onChange={(e) => setNewTask({ ...newTask, niveau: e.target.value })} 
              className="w-full p-2 border rounded mb-2 text-black"
            >
              <option value="">Sélectionner le niveau</option>
              {difficultyLevels.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>

            <select 
              value={newTask.id_user} 
              onChange={(e) => setNewTask({ ...newTask, id_user: e.target.value })} 
              className="w-full p-2 border rounded mb-2 text-black"
            >
              <option value="">Sélectionner l'employé</option>
              {sampleEmployees.map((employee) => (
                <option key={employee.id} value={employee.name}>{employee.name}</option>
              ))}
            </select>

            <select 
              value={newTask.id_projet} 
              onChange={(e) => setNewTask({ ...newTask, id_projet: e.target.value })} 
              className="w-full p-2 border rounded mb-2 text-black"
            >
              <option value="">Sélectionner le projet</option>
              {sampleProjects.map((project) => (
                <option key={project.id} value={project.name}>{project.name}</option>
              ))}
            </select>

            <select 
              value={newTask.departement} 
              onChange={(e) => setNewTask({ ...newTask, departement: e.target.value })} 
              className="w-full p-2 border rounded mb-2 text-black"
            >
              <option value="">Sélectionner le département</option>
              {sampleDepartments.map((department) => (
                <option key={department} value={department}>{department}</option>
              ))}
            </select>

            <input 
              type="number" 
              placeholder="Échéance (jours)" 
              value={newTask.echeance} 
              onChange={(e) => setNewTask({ ...newTask, echeance: e.target.value })} 
              className="w-full p-2 border rounded mb-2 text-black" 
            />
            
            <input 
              type="date" 
              placeholder="Date Début" 
              value={newTask.dateDebut} 
              onChange={(e) => setNewTask({ ...newTask, dateDebut: e.target.value })} 
              className="w-full p-2 border rounded mb-2 text-black" 
            />

            <select 
              value={newTask.status} 
              onChange={(e) => setNewTask({ ...newTask, status: e.target.value })} 
              className="w-full p-2 border rounded mb-2 text-black"
            >
              <option value="En attente">En attente</option>
              <option value="En cours">En cours</option>
              <option value="Terminé">Terminé</option>
              <option value="Annulé">Annulé</option>
            </select>
            
            <button onClick={handleSubmitTask} className="bg-blue-500 text-white px-4 py-2 rounded w-full">Ajouter</button>
          </div>
        </div>
      )}
    </div>
  );
}