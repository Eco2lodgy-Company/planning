"use client";
import { useEffect, useState } from "react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { FaTasks, FaCheckCircle, FaHourglassHalf } from "react-icons/fa";

export default function TaskCalendar() {
    const [tasks, setTasks] = useState([]);
    const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        fetch(`/api/tache/${userId}`)
            .then(res => res.json())
            .then(data => setTasks(data))
            .catch(err => console.error("Error fetching tasks:", err));
            setLoading(false);

    }, [currentWeekStart]);
    const nextWeek = () => setCurrentWeekStart(addDays(currentWeekStart, 7));
    const prevWeek = () => setCurrentWeekStart(addDays(currentWeekStart, -7));

    // Calcul des jours de la semaine
    const daysOfWeek = Array.from({ length: 7 }).map((_, index) => addDays(currentWeekStart, index));

    // Organiser les tâches par jour
    const tasksByDay = daysOfWeek.map(day => ({
        date: day,
        tasks: tasks.filter(task => isSameDay(new Date(task.datedebut), day))
    }));
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
                <h2 className="text-2xl font-semibold text-gray-800">Semaine du {format(currentWeekStart, "dd/MM/yyyy")}</h2>
                <button onClick={nextWeek} className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700">Suivant</button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700">
                            {daysOfWeek.map(day => (
                                <th key={day} className="p-4 text-left">
                                    <div className="font-semibold">{format(day, "EEEE")}</div> {/* Jour de la semaine */}
                                    <div className="text-sm text-gray-600">{format(day, "dd/MM")}</div> {/* Date */}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {tasksByDay.map((day, index) => (
                                <td key={index} className="p-4 border">
                                    {day.tasks.map(task => (
                                        <div key={task.id} className="mb-2 p-2 rounded-lg shadow-sm" style={{ backgroundColor: getTaskColor(task.status) }}>
                                            <div className="font-medium text-gray-900">{task.libelle}</div>
                                            <div className="text-sm text-gray-600">{task.departement}</div>
                                            <div className="text-sm text-white">
                                                {task.status === "En cours" ? <FaHourglassHalf className="inline mr-1" /> : <FaCheckCircle className="inline mr-1" />} {task.status}
                                            </div>
                                        </div>
                                    ))}
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Fonction pour obtenir la couleur en fonction du statut de la tâche
const getTaskColor = (status) => {
    switch (status) {
        case "canceled":
            return "#F97316"; // Orange
        case "in progress":
            return "#FED7AA"; // orange
        case "done":
            return "#BBF7D0"; // Bleu
        default:
            return "#6B7280"; // Gris
    }
};