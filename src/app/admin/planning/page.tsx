"use client"
import { useState, useEffect, useMemo } from "react";
import { format, startOfWeek, addDays, parseISO, isSameDay, isWithinInterval, isBefore, isAfter } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/SupabaseClient";

interface Task {
  id_tache: number;
  libelle: string;
  niveau: number;
  id_user: number;
  id_projet: number;
  echeance: number;
  datedebut: Date;
  status: number;
  departement: number;
  priorite: number;
}

const getDifficultyLabel = (niveau: number): string => {
  switch (niveau) {
    case 1:
      return "Facile";
    case 2:
      return "Moyen";
    case 3:
      return "Difficile";
    default:
      return "Inconnu";
  }
};

const getPriorityLabel = (priorite: number): string => {
  switch (priorite) {
    case 1:
      return "Basse";
    case 2:
      return "Moyenne";
    case 3:
      return "Élevée";
    default:
      return "Inconnue";
  }
};

interface User {
  id_user: number;
  nom_complet: string;
}

interface TaskWithDates extends Task {
  endDate: Date;
}

export default function Calendar() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({
    libelle: "",
    niveau: 1,
    id_projet: 0,
    echeance: 1,
    datedebut: "",
    status: "pending",
    departement: 0,
    priorite: 1,
    id_user: 0,
  });
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [departments, setDepartments] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const result = await response.json();
      if (response.ok) {
        setUsers(result);
      } else {
        console.error("Erreur lors de la récupération des utilisateurs:", result.message);
      }
    } catch (error) {
      console.error("Erreur réseau lors de la récupération des utilisateurs:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      const result = await response.json();
      if (response.ok) {
        setProjects(result.data);
      } else {
        console.error("Erreur lors de la récupération des projets:", result.message);
      }
    } catch (error) {
      console.error("Erreur réseau lors de la récupération des projets:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch("/api/departement");
      const result = await response.json();
      if (response.ok) {
        setDepartments(result);
      } else {
        console.error("Erreur lors de la récupération des départements:", result.message);
      }
    } catch (error) {
      console.error("Erreur réseau lors de la récupération des départements:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchProjects();
    fetchDepartments();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Appel de la fonction PostgreSQL via Supabase
      const { data, error } = await supabase
        .rpc('get_tasks_with_names');

      if (error) {
        throw error;
      }

      // Mettre à jour l'état des tâches
      setTasks(data || []);
      console.log(data);

    } catch (error) {
      setError("Erreur lors de la récupération des données.");
      toast.error("Erreur lors de la récupération des données.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

useEffect(() => {
  fetchData();
}, []);

  // const fetchUser = async (id_user: number) => {
  //   try {
  //     const response = await fetch("/api/users/byid", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ id_user }),
  //     });
  //     const result = await response.json();
  //     if (response.ok) {
  //       return result.user;
  //     } else {
  //       console.error(`Erreur pour id_user ${id_user}:`, result.message);
  //       return { id_user, nom_complet: "Utilisateur inconnu" };
  //     }
  //   } catch (error) {
  //     console.error(`Erreur réseau pour id_user ${id_user}:`, error);
  //     return { id_user, nom_complet: "Erreur réseau" };
  //   }
  // };

  // const fetchUsersForTasks = async (tasks: Task[]) => {
  //   const uniqueIds = [...new Set(tasks.map((task) => task.id_user).filter(Boolean))];
  //   const usersData = await Promise.all(uniqueIds.map((id) => fetchUser(id as number)));
  //   return usersData;
  // };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setIsLoading(true);
  //       const tasksResponse = await fetch("/api/tache");
  //       const tasksResult = await tasksResponse.json();
  //       if (tasksResult.data) setTasks(tasksResult.data);
  //       const usersData = await fetchUsersForTasks(tasksResult.data || []);
  //       setUsers(usersData);
  //     } catch (error) {
  //       setError("Erreur lors de la récupération des données.");
  //       toast.error("Erreur lors de la récupération des données.");
  //     } finally {
  //       setIsLoading(false);
  //     }
  // //   };

  //   fetchData();
  // }, []);

  const processedTasks = useMemo(() => {
    return tasks.map(task => {
      const startDate = parseISO(task.datedebut);
      let remainingDays = task.echeance;
      let currentDate = startDate;
      let endDate = startDate;
      
      while (remainingDays > 0) {
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip weekends
          remainingDays--;
          endDate = currentDate;
        }
        currentDate = addDays(currentDate, 1);
      }
      
      return {
        ...task,
        endDate,
      };
    });
  }, [tasks]);

  const getWeekDays = () => {
    const start = startOfWeek(currentWeek, { weekStartsOn: 1 });
    return Array.from({ length: 5 }).map((_, i) => addDays(start, i));
  };

  const getRemainingDays = (task: TaskWithDates, currentDate: Date) => {
    const startDate = parseISO(task.datedebut);
    let remainingDays = task.echeance;
    let tempDate = startDate;
    
    while (isBefore(tempDate, currentDate)) {
      const dayOfWeek = tempDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        remainingDays--;
      }
      tempDate = addDays(tempDate, 1);
    }
    
    return remainingDays;
  };

  const getTasksForDay = (date: Date) => {
    return processedTasks.filter(task => {
      const startDate = parseISO(task.datedebut);
      return isWithinInterval(date, { start: startDate, end: task.endDate }) ||
             isSameDay(date, startDate) ||
             isSameDay(date, task.endDate);
    });
  };

  const getPriorityColor = (niveau: number) => {
    switch (niveau) {
      case 3:
        return "bg-red-100 border-red-200";
      case 2:
        return "bg-orange-100 border-orange-200";
      default:
        return "bg-green-100 border-green-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return "bg-green-500";
      case "in_progress":
        return "bg-blue-500";
      default:
        return "bg-red-500";
    }
  };

  const getUserName = (userId: number | null) => {
    const user = users.find((user) => user.id_user === userId);
    return user ? user.nom_complet : "Utilisateur inconnu";
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch("/api/tasks/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });
  
      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout de la tâche");
      }
  
      toast.success("Tâche ajoutée avec succès");
      setIsAddTaskModalOpen(false);
      fetchData(); // Re-fetch tasks to update the list
  
      // Réinitialiser le formulaire
      setNewTask({
        libelle: "",
        niveau: 1,
        id_projet: 0,
        echeance: 1,
        datedebut: "",
        status: "pending",
        departement: 0,
        priorite: 1,
        id_user: 0,
      });
    } catch (error) {
      toast.error("Erreur lors de l'ajout de la tâche");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Calendrier des Tâches</h1>
        <div className="flex items-center space-x-4">
        <button
          onClick={() => setCurrentWeek((prev) => addDays(prev, -7))}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-medium">
          Semaine du {format(getWeekDays()[0], "d MMMM yyyy", { locale: fr })}
        </span>
        <button
          onClick={() => setCurrentWeek((prev) => addDays(prev, 7))}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        </div>
      </div>
      </header>
      <button
      onClick={() => setIsAddTaskModalOpen(true)}
      className="p-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
      >
      Ajouter une tâche
      </button>
      <div className="flex-1 overflow-auto p-6">
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-full">
        <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-5 border-b">
          {getWeekDays().map((day) => (
          <div
            key={day.toString()}
            className="p-4 font-medium text-gray-500 text-center border-r"
          >
            {format(day, "EEEE d/MM", { locale: fr })}
          </div>
          ))}
        </div>

        <div className="flex flex-col h-screen bg-gray-50">
      {/* ... (le reste du code reste inchangé) */}

      <div className="grid grid-cols-5">
      {getWeekDays().map((day) => {
        const dayTasks = getTasksForDay(day);
        return (
          <div key={day.toString()} className="p-2 border-r min-h-[120px] relative">
          <div className="space-y-2">
            {dayTasks.map((task) => {
            const remainingDays = getRemainingDays(task, day);
            if (remainingDays <= 0) return null;

            return (
              <div
              key={task.id_tache}
              className={`p-2 rounded border ${getPriorityColor(task.niveau)}`}
              >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{task.libelle}</span>
                <span
                className={`w-2 h-2 rounded-full ${getStatusColor(task.status)}`}
                />
              </div>
              <span className="text-xs text-gray-500 block mt-1">nom: {task.id_user}
              </span>
              {task.departement && (
                <span className="text-xs text-gray-500 block"> departement: {task.departement}
                </span>
              )}
              <span className="text-xs text-gray-500 block">
                Difficulté : {getDifficultyLabel(task.niveau)}
              </span>
              <span className="text-xs text-gray-500 block">
                Priorité : {getPriorityLabel(task.priorite)}
              </span>
              <span className="text-xs text-gray-500 block">
                {remainingDays} jour{remainingDays > 1 ? 's' : ''} restant{remainingDays > 1 ? 's' : ''}
              </span>
              </div>
            );
            })}
          </div>
          </div>
        );
      })}
      </div>
    </div>
        </div>
      )}
      </div>
      {isAddTaskModalOpen && (
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
          <option value={1}>choisissez le projet</option>
        {projects && projects.map((pro)=>
           <option value={pro.id_projet}>{pro.project_name}</option>)
           }
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
         <option value={1}>choisissez le departement</option>
        {departments && departments.map((dep)=>
           <option value={dep.id}>{dep.titre}</option>)
           }
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
          value={newTask.id_user ?? ""}
          onChange={(e) => setNewTask({ ...newTask, id_user: Number(e.target.value) })}
          className="w-full p-2 border rounded-lg"
          required
        >
          <option value="">Sélectionnez un utilisateur</option>
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
        onClick={() => setIsAddTaskModalOpen(false)}
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
  )}
    </div>
  );
}