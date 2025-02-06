"use client"; // Indique que ce composant est client

import { usePathname } from "next/navigation";
import EmpSidebar from "./EmpSidebar";

export default function SidebarWrapper() {
  const pathname = usePathname(); // Récupérer l'URL actuelle
  const isEmployeesPage = pathname.startsWith("/employees"); // Vérifie si l'URL commence par /employees

  if (!isEmployeesPage) return null; // N'affiche rien si on n'est pas dans /employees

  return <EmpSidebar />;
}
