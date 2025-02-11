"use client";

import { useState, useEffect, useMemo } from "react";
import { format, startOfWeek, addDays, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface Task {
  id: number;
  libelle: string;
  niveau: number;
  id_user: number | null;
  id_projet: number | null;
  departement: string | null;
  echeance: number;
  datedebut: string;
  status: string;
}

interface User {
  id_user: number;
  nom_complet: string;
}

export default function Calendar() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch a single user by id_user
  const fetchUser = async (id_user: number) => {
    try {
      const response = await fetch("/api/users/byid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_user }),
      });
      const result = await response.json();
      if (response.ok) {
        return result.user;
      } else {
        console.error(`Erreur pour id_user ${id_user}:`, result.message);
        return { id_user, nom_complet: "Utilisateur inconnu" };
      }
    } catch (error) {
      console.error(`Erreur réseau pour id_user ${id_user}:`, error);
      return { id_user, nom_complet: "Erreur réseau" };
    }
  };

  // Fetch all unique users for tasks
  const fetchUsersForTasks = async (tasks: Task[]) => {
    const uniqueIds = [...new Set(tasks.map((task) => task.id_user).filter(Boolean))];
    const usersData = await Promise.all(uniqueIds.map((id) => fetchUser(id as number)));
    return usersData;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch tasks
        const tasksResponse = await fetch("/api/tache");
        const tasksResult = await tasksResponse.json();
        if (tasksResult.data) setTasks(tasksResult.data);

        // Fetch users for tasks
        const usersData = await fetchUsersForTasks(tasksResult.data || []);
        setUsers(usersData);
      } catch (error) {
        setError("Erreur lors de la récupération des données.");
        toast.error("Erreur lors de la récupération des données.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const tasksByDay = useMemo(() => {
    const result: { [date: string]: Task[] } = {};
    tasks.forEach((task) => {
      const taskDate = parseISO(task.datedebut);
      const dateKey = format(taskDate, "yyyy-MM-dd");
      if (!result[dateKey]) {
        result[dateKey] = [];
      }
      result[dateKey].push(task);
    });
    return result;
  }, [tasks]);

  const getWeekDays = () => {
    const start = startOfWeek(currentWeek, { weekStartsOn: 1 });
    return Array.from({ length: 5 }).map((_, i) => addDays(start, i));
  };

  const getTasksForDay = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    return tasksByDay[dateKey] || [];
  };

  const getPriorityColor = (niveau: number) => {
    switch (niveau) {
      case 1:
        return "bg-red-100 border-red-200";
      case 2:
        return "bg-orange-100 border-orange-200";
        default:
        return "bg-green-100 border-green-200";
      
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in_progress":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getUserName = (userId: number | null) => {
    const user = users.find((user) => user.id_user === userId);
    return user ? user.nom_complet : "Utilisateur inconnu";
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
            <div className="grid grid-cols-6 border-b">
              {getWeekDays().map((day) => (
                <div
                  key={day.toString()}
                  className="p-4 font-medium text-gray-500 text-center border-r"
                >
                  {format(day, "EEEE d/MM", { locale: fr })}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-6 border-b">
              {getWeekDays().map((day) => {
                const dayTasks = getTasksForDay(day);
                return (
                  <div key={day.toString()} className="p-2 border-r min-h-[120px]">
                    {dayTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`mb-2 p-2 rounded border ${getPriorityColor(task.niveau)}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{task.libelle}</span>
                          <span
                            className={`w-2 h-2 rounded-full ${getStatusColor(task.status)}`}
                          />
                        </div>
                        <span className="text-xs text-gray-500 block mt-1">
                          {getUserName(task.id_user)}
                        </span>
                        {task.departement && (
                          <span className="text-xs text-gray-500">{task.departement}</span>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
