import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { Task, AssignedTasks, User, Project } from '@/app/types/planning';
import { defaultColors } from '@/app/utils/colorUtils';
// 
export const useTaskData = () => {
  const [dbTasks, setDbTasks] = useState<Task[]>([]);
  const [assignedTasks, setAssignedTasks] = useState<AssignedTasks>({});
  const [assignedProjects, setAssignedProjects] = useState<{[key: string]: Project[]}>({});
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Récupérer les utilisateurs depuis l'API
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des utilisateurs");
      }
      const result = await response.json();
      if (response.ok) {
        // Assigner des couleurs aux utilisateurs
        const usersWithColors = result.map((user: User, index: number) => ({
          ...user,
          color: defaultColors[index % defaultColors.length].color,
          pdfColor: defaultColors[index % defaultColors.length].pdfColor
        }));
        setUsers(usersWithColors);
      } else {
        toast.error("Erreur lors de la récupération des utilisateurs");
        console.error("Erreur lors de la récupération des utilisateurs:", result.message);
      }
    } catch (error) {
      toast.error("Erreur réseau lors de la récupération des utilisateurs");
      console.error("Erreur réseau lors de la récupération des utilisateurs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Récupérer les tâches depuis l'API
  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/tache");
      const result = await response.json();
      
      if (response.ok) {
        // Extraire les données de tâches depuis la réponse API
        const tasksData = Array.isArray(result.data) ? result.data : [];
        setDbTasks(tasksData);
        
        // Organiser les tâches assignées par employé et date
        const assignedTasksMap: AssignedTasks = {};
        tasksData.forEach(task => {
          if (task.id_user && task.datedebut) {
            const key = `${task.id_user}-${task.datedebut.substring(0, 10)}`;
            if (!assignedTasksMap[key]) {
              assignedTasksMap[key] = [];
            }
            assignedTasksMap[key].push(task);
          }
        });
        setAssignedTasks(assignedTasksMap);
      } else {
        toast.error("Erreur lors de la récupération des tâches.");
      }
    } catch (error) {
      toast.error("Erreur lors de la récupération des données.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Récupérer les projets depuis l'API
  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/projets");
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des projets");
      }
      const result = await response.json();
      const projectsData = Array.isArray(result.data) ? result.data : [];
      setProjects(projectsData);
      
      // Organiser les projets assignés par employé et date
      const assignedProjectsMap: {[key: string]: Project[]} = {};
      projectsData.forEach(project => {
        if (project.chef_projet && project.created_at) {
          // Utiliser une clé spéciale pour les projets pour les différencier des tâches
          const key = `project-${project.chef_projet}-${project.created_at.substring(0, 10)}`;
          if (!assignedProjectsMap[key]) {
            assignedProjectsMap[key] = [];
          }
          assignedProjectsMap[key].push(project);
        }
      });
      setAssignedProjects(assignedProjectsMap);
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Impossible de charger les projets");
    } finally {
      setIsLoading(false);
    }
  };

  // Chargement initial des données
  useEffect(() => {
    fetchUsers();
    fetchTasks();
    fetchProjects();
  }, []);

  // Fonction pour ajouter une tâche
  const handleAddTask = async (employeeId: number, date: Date, taskId: number) => {
    try {
      // Formater la date au format ISO
      const formattedDate = format(date, 'yyyy-MM-dd');
      
      const response = await fetch('/api/taches', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_user: employeeId,
          datedebut: formattedDate,
          id_tache: taskId
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        toast.success("Tâche assignée avec succès !");
        // Rafraîchir les tâches
        await fetchTasks();
        return true;
      } else {
        toast.error(`Erreur lors de l'attribution de la tâche: ${result.error}`);
        return false;
      }
    } catch (error) {
      toast.error("Erreur lors de la communication avec le serveur");
      console.error(error);
      return false;
    }
  };

  return {
    dbTasks,
    assignedTasks,
    assignedProjects,
    users,
    projects,
    isLoading,
    fetchUsers,
    fetchTasks,
    fetchProjects,
    handleAddTask
  };
};

import { format } from 'date-fns';