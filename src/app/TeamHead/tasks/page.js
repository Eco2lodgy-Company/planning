'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Edit2, Trash2 } from 'lucide-react';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Sample data for dropdowns
const difficultyLevels = [
  { id: 1, name: 'Facile' },
  { id: 2, name: 'Moyen' },
  { id: 3, name: 'Difficile' }
];

const statusColors = {
  'pending': 'bg-yellow-100 text-yellow-800',
  'in progress': 'bg-blue-100 text-blue-800',
  'done': 'bg-green-100 text-green-800',
  'canceled': 'bg-red-100 text-red-800'
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
      status: 'En cours',
      priorite: 'Haute'
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
      status: 'En attente',
      priorite: 'Moyenne'
    }
  ]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [departement, setDepartement] = useState([]);
  const [newTask, setNewTask] = useState({
    libelle: '',
    niveau: '',
    id_user: '',
    id_projet: '',
    departement: '',
    echeance: '',
    datedebut: '',
    status: 'pending',
    priorite: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleCreateTask = () => {
    setIsPopupOpen(true);
  };

  useEffect(() => {
    const userIdd = localStorage.getItem('userId');
    const fetchEmployees = async () => {
      try {
        const response = await fetch('/api/headside/agents/' + userIdd);
        if (!response.ok) throw new Error('Erreur lors de la récupération des informations');
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();

    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/headside/projets/listes/' + userIdd);
        if (!response.ok) throw new Error('Erreur lors de la récupération des informations');
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();

    const fetchDepartement = async () => {
      try {
        const response = await fetch('/api/departement');
        if (!response.ok) throw new Error('Erreur lors de la récupération des informations');
        const data = await response.json();
        setDepartement(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartement();
  }, []);

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate a network request
    setTimeout(async () => {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Tâche ajoutée avec succès !');
        setNewTask({
          libelle: '',
          niveau: '',
          id_user: '',
          id_projet: '',
          departement: '',
          echeance: '',
          datedebut: '',
          status: 'pending',
          priorite: ''
        });
      } else {
        alert(`Erreur: ${result.error}`);
      }

      setIsSubmitting(false);
      setIsPopupOpen(false);
    }, 2000); // Simulate a 2-second delay
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
                <th className="px-4 py-2 text-left">Priorité</th>
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
                  <td className="px-4 py-2">{task.priorite}</td>
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
                <option key={level.id} value={level.id}>{level.name}</option>
              ))}
            </select>

            <select
              value={newTask.id_user}
              onChange={(e) => setNewTask({ ...newTask, id_user: e.target.value })}
              className="w-full p-2 border rounded mb-2 text-black"
            >
              <option value="">Sélectionner l'employé</option>
              {employees.map((employee) => (
                <option key={employee.id_user} value={employee.id_user}>{employee.nom_complet}</option>
              ))}
            </select>

            <select
              value={newTask.id_projet}
              onChange={(e) => setNewTask({ ...newTask, id_projet: e.target.value })}
              className="w-full p-2 border rounded mb-2 text-black"
            >
              <option value="">Sélectionner le projet</option>
              {projects.map((project) => (
                <option key={project.id_projet} value={project.id_projet}>{project.project_name}</option>
              ))}
            </select>

            <select
              value={newTask.departement}
              onChange={(e) => setNewTask({ ...newTask, departement: e.target.value })}
              className="w-full p-2 border rounded mb-2 text-black"
            >
              <option value="">Sélectionner le département</option>
              {departement.map((department) => (
                <option key={department.id} value={department.id}>{department.titre}</option>
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
              value={newTask.datedebut}
              onChange={(e) => setNewTask({ ...newTask, datedebut: e.target.value })}
              className="w-full p-2 border rounded mb-2 text-black"
            />

            <select
              value={newTask.priorite}
              onChange={(e) => setNewTask({ ...newTask, priorite: e.target.value })}
              className="w-full p-2 border rounded mb-2 text-black"
            >
              <option value="">Sélectionner la priorité</option>
              <option value="1">Haute</option>
              <option value="2">Moyenne</option>
              <option value="3">Basse</option>
            </select>

            <select
              value={newTask.status}
              onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
              className="w-full p-2 border rounded mb-2 text-black"
            >
              <option value="pending">En attente</option>
              <option value="in progress">En cours</option>
              <option value="done">Terminé</option>
              <option value="canceled">Annulé</option>
            </select>

            <button 
              onClick={handleSubmitTask} 
              disabled={isSubmitting}
              className="bg-blue-500 text-white px-4 py-2 rounded w-full flex items-center justify-center"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : (
                'Ajouter'
              )}
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}