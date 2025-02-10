"use client"
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Calendar, Users, Settings, PlusCircle, Menu, X } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function App() {
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { title: "Employés actifs", value: 50, color: "bg-indigo-500" },
    { title: "Tâches assignées", value: 120, color: "bg-blue-500" },
    { title: "Projets terminés", value: 8, color: "bg-green-500" },
    { title: "Heures travaillées", value: 650, color: "bg-purple-500" },
  ];

  const projectData = [
    { name: "Projets terminés", value: 8 },
    { name: "Projets en cours", value: 5 },
    { name: "Projets en attente", value: 2 },
  ];

  const workloadData = [
    { name: "Lundi", Tâches: 10, Complétées: 6 },
    { name: "Mardi", Tâches: 12, Complétées: 9 },
    { name: "Mercredi", Tâches: 15, Complétées: 11 },
    { name: "Jeudi", Tâches: 8, Complétées: 7 },
    { name: "Vendredi", Tâches: 20, Complétées: 15 },
    { name: "Samedi", Tâches: 5, Complétées: 4 },
    { name: "Dimanche", Tâches: 2, Complétées: 1 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-center justify-between p-6 bg-white shadow gap-4">
          <div className="flex items-center w-full">
            <div className="lg:hidden w-8" /> {/* Spacer for mobile */}
            <h2 className="text-xl font-bold text-gray-800 ml-4">Tableau de bord</h2>
          </div>
          
        </header>

        {/* Main Section */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex-1 p-6 overflow-auto"
        >
          {/* Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className={`rounded-lg shadow-lg p-6 text-white ${stat.color}`}
              >
                <h3 className="text-lg font-bold">{stat.title}</h3>
                <p className="text-4xl font-semibold mt-4">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">État des projets</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer>
                  <BarChart data={projectData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Line Chart Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Évolution de la charge de travail</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer>
                  <LineChart data={workloadData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Tâches" stroke="#8884d8" />
                    <Line type="monotone" dataKey="Complétées" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </motion.main>
      </div>
    </div>
  );
}

export default App;