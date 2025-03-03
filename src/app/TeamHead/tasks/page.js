'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Edit2, Trash2,Calendar, Search, ChevronDown } from 'lucide-react';
import { toast, Toaster } from 'sonner';

// Sample data for dropdowns
const difficultyLevels = [
  { id: 1, name: 'Facile' },
  { id: 2, name: 'Moyen' },
  { id: 3, name: 'Difficile' },
];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  'in progress': 'bg-blue-100 text-blue-800',
  done: 'bg-green-100 text-green-800',
  canceled: 'bg-red-100 text-red-800',
};

export default function TaskManagementPage() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [departements, setDepartements] = useState([]);
  const [newTask, setNewTask] = useState({
    libelle: '',
    niveau: '',
    id_user: '',
    id_projet: '',
    departement: '',
    echeance: '',
    datedebut: '',
    status: 'pending',
    priorite: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const fetchData = async () => {
      try {
        const [employeesRes, projectsRes, departementsRes, tasksRes] = await Promise.all([
          fetch(`/api/headside/agents/${userId}`).then((res) => res.json()),
          fetch(`/api/headside/projets/listes/${userId}`).then((res) => res.json()),
          fetch('/api/departement').then((res) => res.json()),
          fetch(`/api/tasks/list/${userId}`).then((res) => res.json()),
        ]);

        setEmployees(employeesRes);
        setProjects(projectsRes);
        setDepartements(departementsRes);
        setTasks(tasksRes);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateTask = () => setIsPopupOpen(true);

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/tasks/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) throw new Error('Erreur lors de la création de la tâche');

      const result = await response.json();
      setTasks((prev) => [...prev, result]);
      toast.success('Tâche ajoutée avec succès !');
      setIsPopupOpen(false);
      setNewTask({
        libelle: '',
        niveau: '',
        id_user: '',
        id_projet: '',
        departement: '',
        echeance: '',
        datedebut: '',
        status: 'pending',
        priorite: '',
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTask = (taskId) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    if (taskToEdit) {
      setNewTask(taskToEdit);
      setIsPopupOpen(true);
    }
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      toast.success('Tâche supprimée avec succès');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const libelle = task.libelle ? task.libelle.toLowerCase() : '';
    const matchesSearch = libelle.includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });
  

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 font-medium">Chargement des tâches...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Toaster position="top-right" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between p-6 bg-white shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Gestion des Tâches</h2>
            <p className="text-gray-500 mt-1">Gérez vos tâches efficacement</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreateTask}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nouvelle Tâche
          </motion.button>
        </header>

        <div className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher par libellé..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="in progress">En cours</option>
                <option value="done">Terminé</option>
                <option value="canceled">Annulé</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Libellé</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projet</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Département</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Échéance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Début</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTasks.map((task) => (
                    <motion.tr
                      key={task.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.libelle}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.niveau}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.nom_utilisateur}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.nom_projet}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.nom_departement}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.echeance} jours</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.datedebut}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[task.status]}`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditTask(task.id)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {filteredTasks.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune tâche trouvée</h3>
                  <p className="mt-1 text-sm text-gray-500">Essayez d'ajuster votre recherche ou vos filtres.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Formulaire de création/édition de tâche */}
      <AnimatePresence>
        {isPopupOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{newTask.id ? 'Modifier la Tâche' : 'Nouvelle Tâche'}</h3>
                <button
                  onClick={() => setIsPopupOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleSubmitTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Libellé</label>
                  <input
                    type="text"
                    value={newTask.libelle}
                    onChange={(e) => setNewTask({ ...newTask, libelle: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Niveau</label>
                  <select
                    value={newTask.niveau}
                    onChange={(e) => setNewTask({ ...newTask, niveau: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Sélectionner le niveau</option>
                    {difficultyLevels.map((level) => (
                      <option key={level.id} value={level.id}>{level.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Utilisateur</label>
                  <select
                    value={newTask.id_user}
                    onChange={(e) => setNewTask({ ...newTask, id_user: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Sélectionner l'utilisateur</option>
                    {employees.map((employee) => (
                      <option key={employee.id_user} value={employee.id_user}>{employee.nom_complet}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Projet</label>
                  <select
                    value={newTask.id_projet}
                    onChange={(e) => setNewTask({ ...newTask, id_projet: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Sélectionner le projet</option>
                    {projects.map((project) => (
                      <option key={project.id_projet} value={project.id_projet}>{project.project_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Département</label>
                  <select
                    value={newTask.departement}
                    onChange={(e) => setNewTask({ ...newTask, departement: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Sélectionner le département</option>
                    {departements.map((departement) => (
                      <option key={departement.id} value={departement.id}>{departement.titre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Échéance (jours)</label>
                  <input
                    type="number"
                    value={newTask.echeance}
                    onChange={(e) => setNewTask({ ...newTask, echeance: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date Début</label>
                  <input
                    type="date"
                    value={newTask.datedebut}
                    onChange={(e) => setNewTask({ ...newTask, datedebut: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Priorité</label>
                  <select
                    value={newTask.priorite}
                    onChange={(e) => setNewTask({ ...newTask, priorite: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Sélectionner la priorité</option>
                    <option value="3">Haute</option>
                    <option value="2">Moyenne</option>
                    <option value="1">Basse</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Statut</label>
                  <select
                    value={newTask.status}
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="pending">En attente</option>
                    <option value="in progress">En cours</option>
                    <option value="done">Terminé</option>
                    <option value="canceled">Annulé</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors"
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Soumettre'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}