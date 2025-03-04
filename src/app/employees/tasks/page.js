"use client";
import { useEffect, useState } from "react";
import { format, startOfWeek, addDays, isWithinInterval, parseISO, endOfWeek } from "date-fns";
import { FaTasks, FaCheckCircle, FaHourglassHalf, FaCheck } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Loader2, ChevronLeft, ChevronRight, Filter, Search } from "lucide-react";
import { toast, Toaster } from "sonner";

export default function TaskCalendar() {
  const [tasks, setTasks] = useState([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        router.push("/login");
      }
    }
  }, [router]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    const fetchTasks = async () => {
      try {
        const response = await fetch(`/api/tache/${userId}`);
        if (!response.ok) throw new Error("Erreur lors de la récupération des informations");
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const nextWeek = () => setCurrentWeekStart(addDays(currentWeekStart, 7));
  const prevWeek = () => setCurrentWeekStart(addDays(currentWeekStart, -7));

  const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });

  const filteredTasks = tasks.filter((task) => {
    const taskStart = typeof task.datedebut === "string" ? parseISO(task.datedebut) : new Date(task.datedebut);
    const taskEnd = typeof task.echeance === "string" ? parseISO(task.echeance) : new Date(task.echeance);

    const matchesSearch = task.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.departement.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "all" || task.status === filterStatus;
    const matchesDepartment = filterDepartment === "all" || task.departement === filterDepartment;

    return (
      (isWithinInterval(taskStart, { start: currentWeekStart, end: weekEnd }) ||
      isWithinInterval(taskEnd, { start: currentWeekStart, end: weekEnd })
    ) && matchesSearch && matchesStatus && matchesDepartment);
  });

  const handleMarkComplete = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? { ...task, status: "done" } : task))
    );

    fetch(`/api/tache/update/${taskId}`, {
      method: "PUT",
      body: JSON.stringify({ status: "done" }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(() => {
        toast.success("Tâche marquée comme terminée");
      })
      .catch((err) => console.error("Error updating task:", err));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "canceled":
        return "bg-red-500 text-white";
      case "in progress":
        return "bg-yellow-500 text-white";
      case "done":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
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
            <h2 className="text-2xl font-bold text-gray-800">Calendrier des Tâches</h2>
            <p className="text-gray-500 mt-1">Gérez vos tâches pour la semaine en cours</p>
          </div>
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={prevWeek}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Précédent
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={nextWeek}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
            >
              Suivant
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </header>

        <div className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher par tâche ou département..."
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
                <option value="in progress">En cours</option>
                <option value="done">Terminé</option>
                <option value="canceled">Annulé</option>
              </select>
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous les départements</option>
                {Array.from(new Set(tasks.map((task) => task.departement))).map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="space-y-4 p-6">
              {filteredTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <FaTasks className="text-gray-600" />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{task.libelle}</h3>
                        <p className="text-sm text-gray-500">{task.departement}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
                        {task.status === "in progress" ? <FaHourglassHalf /> : <FaCheckCircle />} {task.status}
                      </span>
                      {task.status !== "done" && (
                        <button
                          onClick={() => handleMarkComplete(task.id)}
                          className="text-green-500 hover:text-green-700"
                          title="Marquer comme terminée"
                        >
                          <FaCheck />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <p>Début: {task.datedebut}</p>
                    <p>Échéance: {task.echeance}</p>
                  </div>
                </motion.div>
              ))}
              {filteredTasks.length === 0 && (
                <div className="text-center py-12">
                  <FaTasks className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune tâche trouvée</h3>
                  <p className="mt-1 text-sm text-gray-500">Essayez de changer de semaine ou d'ajuster vos filtres.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}