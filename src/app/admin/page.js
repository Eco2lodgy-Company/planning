"use client"
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Calendar, Users, Settings, PlusCircle, Trash2 } from "lucide-react";

export default function PlanningDashboard() {
  const [loading, setLoading] = useState(true);

  // Simulate loading time
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -200 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 60 }}
        className="w-64 bg-white shadow-lg"
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Calendar className="text-blue-500" /> Gestion Planning
          </h1>
        </div>
        <nav className="mt-8">
          <ul>
            <li>
              <a
                href="#"
                className="flex items-center gap-3 py-2.5 px-4 rounded transition hover:bg-gray-200"
              >
                <Home /> Dashboard
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-3 py-2.5 px-4 rounded transition hover:bg-gray-200"
              >
                <Calendar /> Plannings
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-3 py-2.5 px-4 rounded transition hover:bg-gray-200"
              >
                <Users /> Utilisateurs
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-3 py-2.5 px-4 rounded transition hover:bg-gray-200"
              >
                <Settings /> Paramètres
              </a>
            </li>
          </ul>
        </nav>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-6 bg-white shadow">
          <h2 className="text-xl font-bold text-gray-800">Tableau de bord</h2>
          <button className="py-2 px-4 flex items-center gap-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            <PlusCircle /> Ajouter un planning
          </button>
        </header>

        {/* Main Section */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex-1 p-6"
        >
          {/* Calendar Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Planning hebdomadaire</h3>
            <div className="grid grid-cols-7 gap-4">
              {[
                "Lundi",
                "Mardi",
                "Mercredi",
                "Jeudi",
                "Vendredi",
                "Samedi",
                "Dimanche",
              ].map((day, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200 shadow hover:shadow-lg transition"
                >
                  <h4 className="text-md font-semibold text-gray-600">{day}</h4>
                  <p className="text-sm text-gray-500 mt-2">Aucune tâche</p>
                  <button className="mt-4 py-1 px-3 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
                    Ajouter
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Task List Section */}
          <div className="mt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Tâches à venir</h3>
            <div className="bg-white rounded-lg shadow">
              <ul>
                {[
                  { id: 1, task: "Réunion avec l'équipe", time: "Lundi - 10h" },
                  { id: 2, task: "Présentation client", time: "Mercredi - 14h" },
                  { id: 3, task: "Préparation rapport", time: "Vendredi - 16h" },
                ].map((item) => (
                  <motion.li
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    className="flex justify-between items-center p-4 border-b last:border-none"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-700">{item.task}</p>
                      <p className="text-xs text-gray-500">{item.time}</p>
                    </div>
                    <button className="py-1 px-3 flex items-center gap-1 bg-red-500 text-white text-xs rounded hover:bg-red-600">
                      <Trash2 /> Supprimer
                    </button>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </motion.main>
      </div>
    </div>
  );
}
