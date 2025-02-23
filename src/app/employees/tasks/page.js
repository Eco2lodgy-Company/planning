"use client";
import { useEffect, useState } from "react";
import { format, startOfWeek, addDays, isWithinInterval, parseISO, endOfWeek } from "date-fns";
import { FaTasks, FaCheckCircle, FaHourglassHalf, FaCheck } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function TaskCalendar() {
    const [tasks, setTasks] = useState([]);
    const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) return;
        const fetchTasks = async () => {
            try {
                const response = await fetch(`/api/tache/${userId}`);
                if (!response.ok) throw new Error('Erreur lors de la récupération des informations');
                const data = await response.json();
                setTasks(data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchTasks();
        
    }, []);

    const nextWeek = () => setCurrentWeekStart(addDays(currentWeekStart, 7));
    const prevWeek = () => setCurrentWeekStart(addDays(currentWeekStart, -7));

    // Déterminer les limites de la semaine sélectionnée
    const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });

    // Filtrer les tâches pour ne conserver que celles de la semaine en cours
    const filteredTasks = tasks.filter(task => {
        const taskStart = typeof task.datedebut === "string" ? parseISO(task.datedebut) : new Date(task.datedebut);
        const taskEnd = typeof task.echeance === "string" ? parseISO(task.echeance) : new Date(task.echeance);
    
        return isWithinInterval(taskStart, { start: currentWeekStart, end: weekEnd }) ||
               isWithinInterval(taskEnd, { start: currentWeekStart, end: weekEnd });
    });
    

    const handleMarkComplete = (taskId) => {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === taskId ? { ...task, status: "Terminé" } : task
            )
        );

        fetch(`/api/tache/update/${taskId}`, {
            method: "PUT",
            body: JSON.stringify({ status: "done" }),
            headers: {
                "Content-Type": "application/json",
            },
        }).then(() => {
            toast.success("Tâche marquée comme terminée");
        }).catch(err => console.error("Error updating task:", err));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "canceled": return "bg-orange-500";
            case "in progress": return "bg-orange-300";
            case "done": return "bg-green-300";
            default: return "bg-gray-500";
        }
    };

    if (loading) {
        return (
          <div className="flex items-center justify-center h-screen bg-transparent">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <button onClick={prevWeek} className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700">Précédent</button>
                <h2 className="text-2xl font-semibold text-gray-800">
                    Semaine du {format(currentWeekStart, "dd/MM/yyyy")} au {format(weekEnd, "dd/MM/yyyy")}
                </h2>
                <button onClick={nextWeek} className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700">Suivant</button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700">
                            <th className="p-4 text-left">Tâche</th>
                            <th className="p-4 text-left">Département</th>
                            <th className="p-4 text-left">Échéance</th>
                            <th className="p-4 text-left">Début</th>
                            <th className="p-4 text-left">Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTasks.map(task => (
                            <tr key={task.id} className="border-b hover:bg-gray-100">
                                <td className="p-4 flex items-center gap-2 font-medium text-gray-900"><FaTasks className="text-gray-600" /> {task.libelle}</td>
                                <td className="p-4">
                                    <span className="px-3 py-1 rounded-full text-white text-sm font-semibold bg-blue-400">
                                        {task.departement}
                                    </span>
                                </td>
                                <td className="p-4 font-medium text-gray-800">{task.echeance}</td>
                                <td className="p-4 text-gray-700">{task.datedebut}</td>
                                <td className="p-4 flex items-center gap-2">
                                    <span className={`flex items-center gap-2 px-3 py-1 text-white text-sm font-semibold rounded-full ${getStatusColor(task.status)}`}>
                                        {task.status === "in progress" ? <FaHourglassHalf /> : <FaCheckCircle />} {task.status}
                                    </span>
                                    {task.status !== "done" && (
                                        <button
                                            onClick={() => handleMarkComplete(task.id)}
                                            className="ml-2 text-green-500 hover:text-green-700"
                                            title="Marquer comme terminée"
                                        >
                                            <FaCheck />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredTasks.length === 0 && <p className="text-center text-gray-600 mt-4">Aucune tâche pour cette semaine.</p>}
            </div>
            <ToastContainer />

        </div>
    );
}
