import { AnimatePresence, motion } from "framer-motion";
import { div } from "framer-motion/client";
import { Calendar, Home, Menu, Settings, Users } from "lucide-react";
import { useState } from "react";

export default function SIDEBAR(){
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    return(
       <div>
      <AnimatePresence>

        <motion.aside
        initial={{ x: -200 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 60 }}
        className="w-72 bg-gray-900 text-white shadow-lg p-6 flex flex-col"
      >
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="text-blue-500" aria-hidden="true" /> Tableau de bord
        </h1>
        <nav className="mt-8 space-y-4">
          {["Dashboard", "Plannings", "Utilisateurs", "Paramètres"].map((item, index) => (
            <a
              key={item} // Utilisez un identifiant unique si possible
              href="#"
              className="flex items-center gap-3 py-3 px-4 rounded-lg transition bg-gray-800 hover:bg-blue-600"
            >
              {[<Home aria-hidden="true" />, <Calendar aria-hidden="true" />, <Users aria-hidden="true" />, <Settings aria-hidden="true" />][index]} {item}
            </a>
          ))}
        </nav>
      </motion.aside>
      </AnimatePresence>

       </div>
    )
}