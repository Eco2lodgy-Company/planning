"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, Calendar, FolderKanban, CheckCircle, Users, Shield, ClipboardMinus, Timer, User, AlarmClock 
} from "lucide-react";

const navigationItems = [
  { name: "Dashboard", icon: Home, path: "/TeamHead" },
  { name: "Plannings", icon: Calendar, path: "/TeamHead/plannings" },
  { name: "Projets", icon: FolderKanban, path: "/TeamHead/projects" },
  { name: "Tâches", icon: CheckCircle, path: "/TeamHead/tasks" },
  { name: "Employés", icon: Users, path: "/TeamHead/agents" },
  { name: "Permissions", icon: Shield, path: "/TeamHead/permissions" },
  { name: "Absences", icon: ClipboardMinus, path: "/TeamHead/absences" },
  { name: "Retards", icon: AlarmClock, path: "/TeamHead/retards" },
  { name: "Rapports", icon: ClipboardMinus, path: "/TeamHead/rapports" },
  { name: "Profil", icon: User, path: "/TeamHead/profile" },
];

export default function RespSidebar() {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ x: -200 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 60 }}
      className="w-72 bg-gray-900 text-white shadow-lg p-6 flex flex-col"
    >
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Calendar className="text-blue-500" /> ECO2LODGY
      </h1>
      <nav className="mt-8 space-y-4">
        {navigationItems.map((item) => {
          const Icon = item.icon; 
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-3 py-3 px-4 rounded-lg transition ${
                pathname === item.path ? "bg-blue-600" : "bg-gray-800 hover:bg-blue-600"
              }`}
            >
              <Icon aria-hidden="true" /> {item.name}
            </Link>
          );
        })}
      </nav>
    </motion.aside>
  );
}
