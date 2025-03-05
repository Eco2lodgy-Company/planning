"use client"
import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ArrowUpDown,
  User,
  Building2
} from 'lucide-react';

// Types
interface Task {
  id_tache: number;
  libelle: string;
  niveau: number;
  id_user: number;
  id_projet: number;
  echeance: number;
  datedebut: string;
  status: string;
  created_at: string;
  departement: number;
  priorite: number;
}

interface UserDetail {
  id_user: number;
  nom_complet: string;
}

interface DepartmentDetail {
  id: number;
  titre: string;
}

function TaskManagementPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortField, setSortField] = useState<keyof Task>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // New state for user and department details
  const [userDetails, setUserDetails] = useState<{[key: number]: UserDetail}>({});
  const [departmentDetails, setDepartmentDetails] = useState<{[key: number]: DepartmentDetail}>({});

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tache");
      const data = await response.json();
      const fetchedTasks = Array.isArray(data.data) ? data.data : [];
      setTasks(fetchedTasks);
      setFilteredTasks(fetchedTasks);
      
      // Fetch user and department details for all unique users and departments
      const uniqueUserIds = [...new Set(fetchedTasks.map(task => task.id_user))];
      const uniqueDepartmentIds = [...new Set(fetchedTasks.map(task => task.departement))];
      
      await Promise.all([
        fetchUserDetails(uniqueUserIds),
        fetchDepartmentDetails(uniqueDepartmentIds)
      ]);
      
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des tâches:", error);
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userIds: number[]) => {
    const userDetailsMap: {[key: number]: UserDetail} = {};
    
    for (const id of userIds) {
      try {
        const response = await fetch("/api/users/byid", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id_user: id })
        });
        const data = await response.json();
        if (data.user) {
          userDetailsMap[id] = data.user;
        }
      } catch (error) {
        console.error(`Erreur lors du chargement des détails de l'utilisateur ${id}:`, error);
      }
    }
    
    setUserDetails(userDetailsMap);
  };

  const fetchDepartmentDetails = async (departmentIds: number[]) => {
    const departmentDetailsMap: {[key: number]: DepartmentDetail} = {};
    
    for (const id of departmentIds) {
      try {
        const response = await fetch("/api/departement/byid", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id })
        });
        const data = await response.json();
        if (data.departement) {
          departmentDetailsMap[id] = data.departement;
        }
      } catch (error) {
        console.error(`Erreur lors du chargement des détails du département ${id}:`, error);
      }
    }
    
    setDepartmentDetails(departmentDetailsMap);
  };

  useEffect(() => {
    let result = [...tasks];

    if (searchTerm) {
      result = result.filter(task => 
        task.libelle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter(task => task.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      result = result.filter(task => task.priorite === parseInt(priorityFilter));
    }

    result.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sortDirection === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

    setFilteredTasks(result);
  }, [searchTerm, statusFilter, priorityFilter, sortField, sortDirection, tasks]);

  // Fonctions pour les couleurs de statut et de priorité
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return 'text-green-600';
      case 2:
        return 'text-yellow-600';
      case 3:
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleSort = (field: keyof Task) => {
    setSortDirection(current => current === 'asc' ? 'desc' : 'asc');
    setSortField(field);
  };

  // Helpers for rendering user and department names
  const renderUserName = (userId: number) => {
    return userDetails[userId]?.nom_complet || `Utilisateur ${userId}`;
  };

  const renderDepartmentName = (departmentId: number) => {
    return departmentDetails[departmentId]?.titre || `Département ${departmentId}`;
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Contenu principal qui occupe l'espace restant */}
      <div className="flex-grow bg-gray-50 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestion des Tâches</h1>
          
          {/* Filtres et Recherche */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Rechercher une tâche..."
                  className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-gray-400" />
                <select
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="completed">Terminé</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <AlertCircle size={20} className="text-gray-400" />
                <select
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <option value="all">Toutes les priorités</option>
                  <option value="1">Basse</option>
                  <option value="2">Moyenne</option>
                  <option value="3">Haute</option>
                </select>
              </div>

              <div className="flex items-center gap-2 justify-end">
                <button type="submit"> Ajouter une Tache</button>
              </div>
            </div>
          </div>

          {/* Liste des tâches */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('libelle')}>
                      <div className="flex items-center gap-2">
                        Tâche
                        <ArrowUpDown size={14} />
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <User size={14} />
                        Assigné à
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Building2 size={14} />
                        Département
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('datedebut')}>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        Date de début
                        <ArrowUpDown size={14} />
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        Échéance
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('priorite')}>
                      <div className="flex items-center gap-2">
                        Priorité
                        <ArrowUpDown size={14} />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTasks && filteredTasks.map((task) => (
                    <tr key={task.id_tache} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{task.libelle}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{renderUserName(task.id_user)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{renderDepartmentName(task.departement)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{new Date(task.datedebut).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{task.echeance} jours</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(task.status)}`}>
                          {task.status === 'pending' ? (
                            <Clock className="w-4 h-4 mr-1" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                          )}
                          {task.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${getPriorityColor(task.priorite)}`}>
                          {task.priorite === 1 ? 'Basse' : task.priorite === 2 ? 'Moyenne' : 'Haute'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskManagementPage;