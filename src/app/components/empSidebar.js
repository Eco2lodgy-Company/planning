'use client';
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, Calendar, CircleCheckBig, Users, Shield, ClipboardMinus, LogOut 
} from "lucide-react";

const navigationItems = [
  { name: 'Dashboard', icon: Home, path: '/employees' },
  { name: 'Plannings', icon: Calendar, path: '/employees/plannings' },
  { name: 'Tâches', icon: CircleCheckBig, path: '/employees/tasks' },
  { name: 'Permissions', icon: Shield, path: '/employees/permission' },
  { name: 'Rapports', icon: ClipboardMinus, path: '/employees/rapport' },
  { name: 'Profile', icon: Users, path: '/employees/profile' },
];

export default function EmpSidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('userId');
    window.location.href = '/login';
  };

  return (
    <motion.aside
      initial={{ x: -200 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 60 }}
      className="w-full max-w-72 bg-gray-900 text-white shadow-lg p-6 flex flex-col justify-between h-screen sm:w-72"
    >
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="text-blue-500" /> ECO2LODGY
        </h1>
        <nav className="mt-8 space-y-4">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-3 py-3 px-4 rounded-lg transition ${
                pathname === item.path ? "bg-blue-600" : "bg-gray-800 hover:bg-blue-600"
              }`}
            >
              <item.icon aria-hidden="true" /> {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Bouton de déconnexion ergonomique */}
      <div className="border-t border-gray-700 mt-4 pt-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 py-3 px-4 rounded-lg bg-red-600 hover:bg-red-700 transition text-white w-full"
        >
          <LogOut aria-hidden="true" /> Déconnexion
        </button>
      </div>
    </motion.aside>
  );
}
