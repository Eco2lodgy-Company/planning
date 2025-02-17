"use client"; // Indique que ce composant est client

import { usePathname } from "next/navigation";
import EmpSidebar from "./empSidebar";
import RespSidebar from "./teamHeadSidebar";

export default function SidebarWrapper() {
  const pathname = usePathname(); // Récupérer l'URL actuelle
  const isEmployeesPage = pathname.startsWith("/employees"); // Vérifie si l'URL commence par /employees
  const isResponsiblePage = pathname.startsWith("/TeamHead");
  if (!(isEmployeesPage || isResponsiblePage)) {return null;} // N'affiche rien si on n'est pas dans /employees
    if (isResponsiblePage) {return <RespSidebar />;}
    else{ return <EmpSidebar />;}

}
