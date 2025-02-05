"use client";

import { useState } from "react";
import { Calendar, Home, Settings, Users } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    appTitle: "Mon Application",
    themeColor: "#3498db",
    notificationEnabled: true,
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSaveSettings = () => {
    console.log("Paramètres sauvegardés", settings);
    // Vous pouvez ajouter ici un appel à une API ou à une base de données pour sauvegarder les paramètres.
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth >= 1024) && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="fixed lg:static z-40 w-64 bg-white shadow-lg h-screen"
          >
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Calendar className="text-blue-500" /> Gestion Planning
              </h1>
            </div>
            <nav className="mt-8">
              <ul className="flex flex-col">
                <li>
                  <a
                    href="/admin"
                    className="flex items-center gap-3 py-2.5 px-4 rounded transition hover:bg-gray-200"
                  >
                    <Home /> Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="/admin/planning"
                    className="flex items-center gap-3 py-2.5 px-4 rounded transition hover:bg-gray-200"
                  >
                    <Calendar /> Plannings
                  </a>
                </li>
                <li>
                  <a
                    href="/admin/users"
                    className="flex items-center gap-3 py-2.5 px-4 rounded transition hover:bg-gray-200"
                  >
                    <Users /> Utilisateurs
                  </a>
                </li>
                <li>
                  <a
                    href="/admin/params"
                    className="flex items-center gap-3 py-2.5 px-4 rounded transition hover:bg-gray-200"
                  >
                    <Settings /> Paramètres
                  </a>
                </li>
              </ul>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">Paramètres de l'Application</h1>
        <div className="mb-4">
          <div className="mb-2">
            <label htmlFor="appTitle" className="block font-semibold">
              Titre de l'application
            </label>
            <input
              type="text"
              id="appTitle"
              value={settings.appTitle}
              onChange={(e) => setSettings({ ...settings, appTitle: e.target.value })}
              className="border p-2 mr-2 rounded-[15px] w-full"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="themeColor" className="block font-semibold">
              Couleur du thème
            </label>
            <input
              type="color"
              id="themeColor"
              value={settings.themeColor}
              onChange={(e) => setSettings({ ...settings, themeColor: e.target.value })}
              className="border p-2 mr-2 rounded-[15px] w-full"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="notificationEnabled" className="block font-semibold">
              Notifications activées
            </label>
            <input
              type="checkbox"
              id="notificationEnabled"
              checked={settings.notificationEnabled}
              onChange={(e) => setSettings({ ...settings, notificationEnabled: e.target.checked })}
              className="mr-2"
            />
            <span>Oui</span>
          </div>
          <button
            onClick={handleSaveSettings}
            className="mt-4 p-2 bg-blue-500 text-white rounded-[15px]"
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
}
