'use client';
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, Calendar, CircleCheckBig, Users, Shield, ClipboardMinus, Settings 
} from "lucide-react";

const navigationItems = [
  { name: 'Dashboard', icon: Home, path: '/employees' },
  { name: 'Plannings', icon: Calendar, path: '/employees/plannings' },
  { name: 'Tâches', icon: CircleCheckBig, path: '/employees/tasks' },
  { name: 'Utilisateurs', icon: Users, path: '/users' },
  { name: 'Permissions', icon: Shield, path: '/permissions' },
  { name: 'Rapports', icon: ClipboardMinus, path: '/permissions' },
  { name: 'Paramètres', icon: Settings, path: '/settings' },
];

export default function EmpSidebar() {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ x: -200 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 60 }}
      className="w-72 bg-gray-900 text-white shadow-lg p-6 flex flex-col"
    >
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Calendar className="text-blue-500" /> Planning
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
    </motion.aside>
  );
}
