"use client"
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Home, Menu, Settings, Users, X, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";

export default function SIDEBAR() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Gestion du mode sombre
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div>
      {/* Bouton pour ouvrir/fermer la sidebar */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed z-50 top-4 left-4 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth >= 1024) && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="fixed lg:static z-40 w-64 bg-white dark:bg-gray-900 text-gray-800 dark:text-white shadow-lg h-screen"
          >
            <div className="p-6 flex items-center justify-between">
              {/* Titre de la sidebar */}
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Calendar className="text-blue-500" /> Gestion Planning
              </h1>
              {/* Bouton jour/nuit */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-lg transition hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
            <nav className="mt-8">
              <ul className="flex flex-col">
                <li>
                  <a
                    href="/admin"
                    className="flex items-center gap-3 py-2.5 px-4 rounded transition hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <Home /> Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="/admin/planning"
                    className="flex items-center gap-3 py-2.5 px-4 rounded transition hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <Calendar /> Plannings
                  </a>
                </li>
                <li>
                  <a
                    href="/admin/projects"
                    className="flex items-center gap-3 py-2.5 px-4 rounded transition hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <Calendar /> Projets
                  </a>
                </li>
                <li>
                  <a
                    href="/admin/rapport"
                    className="flex items-center gap-3 py-2.5 px-4 rounded transition hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <Users /> Utilisateurs
                  </a>
                </li>
                <li>
                  <a
                    href="/admin/users"
                    className="flex items-center gap-3 py-2.5 px-4 rounded transition hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <Users /> Rapport
                  </a>
                </li>
                <li>
                  <a
                    href="/admin/params"
                    className="flex items-center gap-3 py-2.5 px-4 rounded transition hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <Settings /> Paramètres
                  </a>
                </li>
              </ul>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
