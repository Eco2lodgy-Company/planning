"use client";
import { useEffect, useState } from "react";
import { format, startOfWeek, addDays } from "date-fns";
import { FaTasks, FaCheckCircle, FaHourglassHalf, FaCheck } from "react-icons/fa";

export default function TaskCalendar() {
    const [tasks, setTasks] = useState([]);
    const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        fetch(`/api/tache/${userId}`)
            .then(res => res.json())
            .then(data => setTasks(data))
            .catch(err => console.error("Error fetching tasks:", err));
    }, [currentWeekStart]);

    const nextWeek = () => setCurrentWeekStart(addDays(currentWeekStart, 7));
    const prevWeek = () => setCurrentWeekStart(addDays(currentWeekStart, -7));

    const handleMarkComplete = (taskId) => {
        // Mettre à jour le statut de la tâche
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId ? { ...task, status: "Terminé" } : task
            )
        );

        // Optionnel: mettre à jour l'API avec la tâche mise à jour
        fetch(`/api/tache/update/${taskId}`, {
            method: "PUT",
            body: JSON.stringify({ status: "Terminé" }),
            headers: {
                "Content-Type": "application/json",
            },
        }).catch(err => console.error("Error updating task:", err));
    };

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
                            <th className="p-4 text-left">Tâche</th>
                            <th className="p-4 text-left">Département</th>
                            <th className="p-4 text-left">Échéance</th>
                            <th className="p-4 text-left">Début</th>
                            <th className="p-4 text-left">Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task) => (
                            <tr key={task.id} className="border-b hover:bg-gray-100">
                                <td className="p-4 flex items-center gap-2 font-medium text-gray-900"><FaTasks className="text-gray-600" /> {task.libelle}</td>
                                <td className="p-4">
                                    <span className="px-3 py-1 rounded-full text-white text-sm font-semibold" style={{ backgroundColor: '#4a90e2' }}>{task.departement}</span>
                                </td>
                                <td className="p-4 font-medium text-gray-800">{task.echeance}</td>
                                <td className="p-4 text-gray-700">{task.datedebut}</td>
                                <td className="p-4 flex items-center gap-2">
                                    <span className={`flex items-center gap-2 px-3 py-1 text-white text-sm font-semibold rounded-full ${task.status === "En cours" ? "bg-orange-500" : task.status === "Prêt à commencer" ? "bg-blue-500" : "bg-gray-500"}`}>
                                        {task.status === "En cours" ? <FaHourglassHalf /> : <FaCheckCircle />} {task.status}
                                    </span>
                                    {task.status !== "Terminé" && (
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
            </div>
        </div>
    );
}
