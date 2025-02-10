"use client"
import { useState } from "react";
import { Calendar, Home, Menu, Settings, Users, X, Eye, EyeOff } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    appTitle: "Mon Application",
    themeColor: "#3498db",
    notificationEnabled: true,
    email: "user@example.com",
    password: "",
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSaveSettings = () => {
    console.log("Paramètres sauvegardés", settings);
    // Ajoutez ici un appel à une API ou à une base de données pour sauvegarder les paramètres.
  };

  return (
    <div className="flex h-screen bg-gray-100">
      

      {/* Main Content */}
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">Paramètres de l'Application</h1>
        {/* Titre de l'application */}
        <div className="mb-4">
          <label htmlFor="appTitle" className="block font-semibold">
            
          </label>
         
        </div>
        

        {/* Changer d'adresse e-mail */}
        <div className="mb-4">
          <label htmlFor="email" className="block font-semibold">
            Adresse e-mail
          </label>
          <input
            type="email"
            id="email"
            value={settings.email}
            onChange={(e) => setSettings({ ...settings, email: e.target.value })}
            className="border p-2 rounded-[15px] w-full"
          />
        </div>

        {/* Modifier le mot de passe */}
        <div className="mb-4">
          <label htmlFor="password" className="block font-semibold">
            Mot de passe
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={settings.password}
              onChange={(e) => setSettings({ ...settings, password: e.target.value })}
              className="border p-2 rounded-[15px] w-full"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Sauvegarder les paramètres */}
        <button
          onClick={handleSaveSettings}
          className="mt-4 p-2 bg-blue-500 text-white rounded-[15px]"
        >
          Sauvegarder
        </button>
      </div>
    </div>
  );
}
