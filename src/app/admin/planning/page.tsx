"use client"
import React, { useEffect, useState } from 'react';
import Calendrier from '@/app/admin/planning/Calendrier';

<<<<<<< HEAD
const Home = () => {
  const [taches, setTaches] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
=======
// Lazy-loaded components
const TaskModal = dynamic(() => import("./TaskModal"), {
  loading: () => <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-lg shadow-md">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p className="text-center mt-4">Chargement du formulaire...</p>
    </div>
  </div>,
  ssr: false,
});

interface Task {
  id_tache: number;
  libelle: string;
  niveau: number;
  id_user: number | null;
  id_projet: number | null;
  echeance: number;
  datedebut: string;
  status: string;
  departement: number | null;
  priorite: number;
}

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

interface TaskWithDates extends Task {
  endDate: Date;
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

// Task list component for each day
const DayTaskList = ({ day, tasks, users, projects, departments }: { 
  day: Date, 
  tasks: TaskWithDates[],
  users: User[],
  projects: Project[],
  departments: Department[]
}) => {
  // Fonctions pour récupérer les noms au lieu des IDs
  const getUserName = (userId: number | null) => {
    if (!userId) return "Non assigné";
    const user = users.find(user => user.id_user === userId);
    return user ? user.nom_complet : "Utilisateur inconnu";
  };

  const getProjectName = (projectId: number | null) => {
    if (!projectId) return "Sans projet";
    const project = projects.find(project => project.id_projet === projectId);
    return project ? project.project_name : "Projet inconnu";
  };

  const getDepartmentName = (departmentId: number | null) => {
    if (!departmentId) return "Sans département";
    const department = departments.find(dept => dept.id === departmentId);
    return department ? department.titre : "Département inconnu";
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
    const lowerStatus = status.toLowerCase();
    switch (lowerStatus) {
      case "done":
        return "bg-green-500";
      case "in_progress":
      case "en cours":
        return "bg-blue-500";
      default:
        return "bg-yellow-500";
    }
  };
  
  const getRemainingDays = (task: TaskWithDates, currentDate: Date) => {
    try {
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
    } catch (error) {
      console.error("Error calculating remaining days:", error);
      return 0;
    }
  };
  
  return (
    <div className="p-2 border-r min-h-[120px] relative">
      <div className="space-y-2">
        {tasks.length === 0 ? (
          <div className="text-gray-400 text-sm italic text-center mt-4">
            Aucune tâche
          </div>
        ) : (
          tasks.map((task) => {
            try {
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
                  <span className="text-xs text-gray-500 block mt-1">
                    Assigné à: {getUserName(task.id_user)}
                  </span>
                  <span className="text-xs text-gray-500 block">
                    Projet: {getProjectName(task.id_projet)}
                  </span>
                  <span className="text-xs text-gray-500 block">
                    Département: {getDepartmentName(task.departement)}
                  </span>
                  <span className="text-xs text-gray-500 block">
                    Difficulté: {getDifficultyLabel(task.niveau)}
                  </span>
                  <span className="text-xs text-gray-500 block">
                    Priorité: {getPriorityLabel(task.priorite)}
                  </span>
                  <span className="text-xs text-gray-500 block">
                    {remainingDays} jour{remainingDays > 1 ? 's' : ''} restant{remainingDays > 1 ? 's' : ''}
                  </span>
                </div>
              );
            } catch (error) {
              console.error("Error rendering task:", error);
              return null;
            }
          })
        )}
      </div>
    </div>
  );
};

export default function Calendar() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
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
  const [dataLoaded, setDataLoaded] = useState({
    users: false,
    projects: false,
    departments: false,
    tasks: false
  });

  // Lazy data loading with individual loading states
  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const result = await response.json();
      if (response.ok) {
        setUsers(result);
      } else {
        console.error("Erreur lors de la récupération des utilisateurs:", result.message);
      }
      setDataLoaded(prev => ({ ...prev, users: true }));
    } catch (error) {
      console.error("Erreur réseau lors de la récupération des utilisateurs:", error);
      setDataLoaded(prev => ({ ...prev, users: true }));
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
      setDataLoaded(prev => ({ ...prev, projects: true }));
    } catch (error) {
      console.error("Erreur réseau lors de la récupération des projets:", error);
      setDataLoaded(prev => ({ ...prev, projects: true }));
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
      setDataLoaded(prev => ({ ...prev, departments: true }));
    } catch (error) {
      console.error("Erreur réseau lors de la récupération des départements:", error);
      setDataLoaded(prev => ({ ...prev, departments: true }));
    }
  };

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/tache");
      const result = await response.json();
      if (response.ok) {
        setTasks(Array.isArray(result.data) ? result.data : []);
      } else {
        setError("Erreur lors de la récupération des tâches.");
        toast.error("Erreur lors de la récupération des tâches.");
      }
    } catch (error) {
      setError("Erreur lors de la récupération des données.");
      toast.error("Erreur lors de la récupération des données.");
      console.error(error);
    } finally {
      setIsLoading(false);
      setDataLoaded(prev => ({ ...prev, tasks: true }));
    }
  };
>>>>>>> 23d3e60ce354d61f4f5adc30d78b02a16d552719

  useEffect(() => {
    // Simuler une requête API pour récupérer les tâches
    fetch('/api/tache')
      .then(response => response.json())
      .then(data => setTaches(data.data));

    // Simuler une requête API pour récupérer les utilisateurs
    fetch('/api/users')
      .then(response => response.json())
      .then(data => setUtilisateurs(data));
  }, []);

  return (
    <div>
      <h1>Calendrier des Tâches</h1>
      <Calendrier taches={taches} utilisateurs={utilisateurs} />
    </div>
  );
};

export default Home;