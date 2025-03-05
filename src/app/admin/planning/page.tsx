"use client"
import { useState, useEffect } from 'react';
import { addDays, format, startOfWeek, getMonth, getYear } from 'date-fns';
import { fr } from 'date-fns/locale';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import { 
  ChevronLeft, 
  ChevronRight, 
  FileDown, 
  Plus 
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaskModal } from '@/app/components/TaskModal';
import { TaskCard } from '@/app/components/TaskCard';
import { toast } from "sonner";

// Définition des interfaces
interface User {
  id_user: number;
  nom_complet: string;
  color?: string;
  pdfColor?: string;
}

interface Task {
  id_tache: number;
  libelle: string;
  niveau: number;
  id_user: number;
  id_projet: number;
  echeance: number;
  datedebut: string;
  status: string;
  nom_departement: string;
  priorite: number;
}
interface Project {
  id_projet: number;
  project_name: string;
  project_type: number;
  partenaire: string;
  echeance: number;
  chef_projet: number;
  created_at: string;
  status: string;
  departement: number;
  datedebut:string;
}


// Type pour les tâches assignées
interface AssignedTasks {
  [key: string]: Task[];
}
interface AssignedProjects {
  [key: string]: Project[];
}

// Couleurs par défaut pour les utilisateurs
const defaultColors = [
  { color: 'bg-blue-100 border-blue-200 text-blue-800', pdfColor: '#ebf8ff' },
  { color: 'bg-emerald-100 border-emerald-200 text-emerald-800', pdfColor: '#e6fffa' },
  { color: 'bg-purple-100 border-purple-200 text-purple-800', pdfColor: '#faf5ff' },
  { color: 'bg-amber-100 border-amber-200 text-amber-800', pdfColor: '#fffaf0' },
  { color: 'bg-rose-100 border-rose-200 text-rose-800', pdfColor: '#fff5f5' },
  { color: 'bg-sky-100 border-sky-200 text-sky-800', pdfColor: '#e6f7ff' },
  { color: 'bg-lime-100 border-lime-200 text-lime-800', pdfColor: '#f0fff4' }
];

// Couleurs associées aux tâches pour le PDF
const taskColors = {
  "Développement frontend": { color: '#2b6cb0', bgColor: '#ebf8ff' },
  "Développement backend": { color: '#2c7a7b', bgColor: '#e6fffa' },
  "Design UI/UX": { color: '#6b46c1', bgColor: '#faf5ff' },
  "Réunion client": { color: '#c05621', bgColor: '#fffaf0' },
  "Tests fonctionnels": { color: '#c53030', bgColor: '#fff5f5' },
  "Revue de code": { color: '#2f855a', bgColor: '#f0fff4' },
  "Documentation": { color: '#6b46c1', bgColor: '#faf5ff' },
  "Planification sprint": { color: '#2b6cb0', bgColor: '#ebf8ff' },
  "Correction de bugs": { color: '#c53030', bgColor: '#fff5f5' },
  "Déploiement": { color: '#2c7a7b', bgColor: '#e6fffa' },
  "Formation": { color: '#c05621', bgColor: '#fffaf0' },
  "Analyse des besoins": { color: '#6b46c1', bgColor: '#faf5ff' },
  "Recherche": { color: '#2f855a', bgColor: '#f0fff4' },
  "Support client": { color: '#2b6cb0', bgColor: '#ebf8ff' },
  "Optimisation": { color: '#2c7a7b', bgColor: '#e6fffa' }
};

// Nouvelles couleurs pour les projets dans le PDF
const projectColors = {
  "Refonte site web": { color: '#1a365d', bgColor: '#e2e8f0' },
  "Application mobile": { color: '#276749', bgColor: '#e6fffa' },
  "Dashboard analytique": { color: '#44337a', bgColor: '#e9d8fd' },
  "Plateforme e-commerce": { color: '#975a16', bgColor: '#feebc8' },
  "Système CRM": { color: '#702459', bgColor: '#fed7e2' },
  "Intranet d'entreprise": { color: '#2a4365', bgColor: '#bee3f8' },
  "API REST": { color: '#285e61', bgColor: '#b2f5ea' },
  "Développement": { color: '#2b6cb0', bgColor: '#ebf8ff' },
  "Réunion": { color: '#c05621', bgColor: '#fffaf0' },
  "Conception": { color: '#6b46c1', bgColor: '#faf5ff' },
  "Tests": { color: '#c53030', bgColor: '#fff5f5' },
  "Documentation": { color: '#2f855a', bgColor: '#f0fff4' }
};

const Index = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dbTasks, setDbTasks] = useState<Task[]>([]);
  const [dbProject, setDbProject] = useState<Project[]>([]);
  const [assignedTasks, setAssignedTasks] = useState<AssignedTasks>({});
  const [assignedProjects, setAssignedProjects] = useState<AssignedProjects>({});
  const [selectedMonth, setSelectedMonth] = useState(getMonth(new Date()));
  const [selectedYear, setSelectedYear] = useState(getYear(new Date()));
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [modalData, setModalData] = useState<{ employeeId: number | null, day: any }>({ employeeId: null, day: null });
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Récupérer les utilisateurs depuis l'API
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/users");
      const result = await response.json();
      if (response.ok) {
        // Assigner des couleurs aux utilisateurs
        const usersWithColors = result.map((user: User, index: number) => ({
          ...user,
          color: defaultColors[index % defaultColors.length].color,
          pdfColor: defaultColors[index % defaultColors.length].pdfColor
        }));
        setUsers(usersWithColors);
      } else {
        toast.error("Erreur lors de la récupération des utilisateurs");
        console.error("Erreur lors de la récupération des utilisateurs:", result.message);
      }
    } catch (error) {
      toast.error("Erreur réseau lors de la récupération des utilisateurs");
      console.error("Erreur réseau lors de la récupération des utilisateurs:", error);
    } finally {
      setIsLoading(false);
    }
  };
   
  // Récupérer les tâches depuis l'API
  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/tache", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });
      const result = await response.json();
      console.log("Fetched tasks:", result);
  
      if (response.ok) {
        const tasksData = Array.isArray(result.data) ? result.data : [];
        setDbTasks(tasksData);
  
        // Recalculer les tâches assignées
        const assignedTasksMap: AssignedTasks = {};
        tasksData.forEach((task: Task) => {
          if (task.id_user && task.datedebut) {
            const key = `${task.id_user}-${task.datedebut.substring(0, 10)}`;
            if (!assignedTasksMap[key]) {
              assignedTasksMap[key] = [];
            }
            assignedTasksMap[key].push(task);
          }
        });
        setAssignedTasks(assignedTasksMap); // Mise à jour complète
      } else {
        toast.error("Erreur lors de la récupération des tâches.");
      }
    } catch (error) {
      toast.error("Erreur lors de la récupération des données.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  


  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/projects");
      const result = await response.json();
      console.log("API Response:", result);
      
      if (response.ok) {
        // Extraire les données de tâches depuis la réponse API
        const ProjectsData = Array.isArray(result.data) ? result.data : [];
        setDbProject(ProjectsData);
        
        // Organiser les tâches assignées par employé et date
        const assignedProjectsMap: AssignedProjects = {};
        ProjectsData.forEach(pro => {
          if (pro.chef_projet && pro.datedebut) {
            const key = `${pro.chef_projet}-${pro.datedebut.substring(0, 10)}`;
            if (!assignedProjectsMap[key]) {
              assignedProjectsMap[key] = [];
            }
            assignedProjectsMap[key].push(pro);
          }
        });
        setAssignedProjects(assignedProjectsMap);
      } else {
        toast.error("Erreur lors de la récupération des tâches.");
      }
    } catch (error) {
      toast.error("Erreur lors de la récupération des données.");
      console.error(error);
    } finally {
      setIsLoading(false);
      // fetchProjects();
    }
  };

  // Charger les données au chargement du composant
  useEffect(() => {
    fetchUsers();
    fetchTasks();
    fetchProjects();
  }, []);

  const years = Array.from({ length: 6 }, (_, i) => getYear(new Date()) + i - 2);

  const days = Array.from({ length: 7 }).map((_, i) => {
    const date = addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), i);
    return {
      date,
      label: format(date, 'EEEE', { locale: fr }),
      formattedDate: format(date, 'dd/MM/yyyy'),
      isWeekend: i >= 5 // Samedi (5) et dimanche (6) sont des week-ends
    };
  });

  const changeWeek = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction * 7));
    
    if (
      (selectedMonth !== null && getMonth(newDate) !== selectedMonth) ||
      (selectedYear !== null && getYear(newDate) !== selectedYear)
    ) {
      return;
    }
    
    setCurrentDate(newDate);
  };

  const handleMonthChange = (value: string) => {
    const month = parseInt(value, 10);
    setSelectedMonth(month);
    updateCurrentDateForFilters(month, selectedYear);
  };

  const handleYearChange = (value: string) => {
    const year = parseInt(value, 10);
    setSelectedYear(year);
    updateCurrentDateForFilters(selectedMonth, year);
  };

  const updateCurrentDateForFilters = (month: number, year: number) => {
    const newDate = new Date(year, month, 1);
    const firstMonday = startOfWeek(newDate, { weekStartsOn: 1 });
    setCurrentDate(firstMonday);
  };

  const handleCellClick = (employeeId: number, day: any) => {
    const key = `${employeeId}-${format(day.date, 'yyyy-MM-dd')}`;
    const currentTasks = assignedTasks[key] || [];
    
    // Vérifier si le nombre maximum de tâches est atteint
    if (currentTasks.length >= 3) {
      toast.warning('Maximum 3 tâches par jour et par employé');
      return;
    }
    
    setModalData({ employeeId, day });
    setSelectedTaskId(dbTasks.length > 0 ? dbTasks[0].id_tache : null);
    setShowTaskModal(true);
  };

  const handleAddTask = async () => {
    if (!selectedTaskId || !modalData.employeeId || !modalData.day) return;
  
    const { employeeId, day } = modalData;
    const formattedDate = format(day.date, "yyyy-MM-dd");
  
    const newTask = dbTasks.find((task) => task.id_tache === selectedTaskId);
    if (!newTask) return;
  
    try {
      // Mise à jour optimiste
      const key = `${employeeId}-${formattedDate}`;
      const updatedTask = { ...newTask, datedebut: formattedDate };
  
      // Mise à jour des tâches assignées
      setAssignedTasks((prev) => ({
        ...prev,
        [key]: [...(prev[key] || []), updatedTask],
      }));
  
      // Mise à jour de la liste complète des tâches (optionnel, si nécessaire)
      setDbTasks((prev) => [...prev.map(t => t.id_tache === selectedTaskId ? updatedTask : t)]);
  
      // Appel API pour persister les changements
      const response = await fetch("/api/tache/attribuate", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_user: employeeId,
          datedebut: formattedDate,
          id_tache: selectedTaskId,
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        toast.success("Tâche assignée avec succès !");
        // Rafraîchir les données depuis le serveur pour garantir la synchronisation
        await fetchTasks();
      } else {
        toast.error(`Erreur lors de l'attribution de la tâche: ${result.error}`);
        // Revenir à l'état précédent en cas d'échec
        setAssignedTasks((prev) => {
          const newTasks = { ...prev };
          newTasks[key] = newTasks[key].filter(t => t.id_tache !== selectedTaskId);
          return newTasks;
        });
      }
    } catch (error) {
      toast.error("Erreur lors de la communication avec le serveur");
      console.error(error);
      // Revenir à l'état précédent en cas d'erreur réseau
      setAssignedTasks((prev) => {
        const newTasks = { ...prev };
        newTasks[key] = newTasks[key].filter(t => t.id_tache !== selectedTaskId);
        return newTasks;
      });
    }
  
    setSelectedTaskId(null);
    setShowTaskModal(false);
  };

  const getTasksForCell = (employeeId: number, day: any) => {
    const key = `${employeeId}-${format(day.date, 'yyyy-MM-dd')}`;
    return assignedTasks[key] || [];
  };
  const getProjectsForCell = (employeeId: number, day: any) => {
    const key = `${employeeId}-${format(day.date, 'yyyy-MM-dd')}`;
    return assignedProjects[key] || [];
  };

  // Vérifier si une tâche est un projet (version modifiée pour Task)
  const isProject = (task: Task): boolean => {
    return task.libelle.startsWith('Projet:') || task.libelle.includes(' - Projet');
  };

  // Extraire le nom du projet d'une tâche (version modifiée pour Task)
  const extractProjectName = (task: Task): string => {
    if (task.libelle.startsWith('Projet:')) {
      return task.libelle.substring(8).trim();
    } else if (task.libelle.includes(' - Projet')) {
      return task.libelle.split(' - Projet')[0].trim();
    }
    return task.libelle;
  };

  // Obtenir la couleur pour une tâche ou un projet dans le PDF (version modifiée pour Task)
  const getTaskOrProjectColor = (task: Task) => {
    if (isProject(task)) {
      const projectName = extractProjectName(task);
      return projectColors[projectName as keyof typeof projectColors] || 
             { color: '#4a5568', bgColor: '#f7fafc' };
    } else {
      return taskColors[task.libelle as keyof typeof taskColors] || 
             { color: '#4a5568', bgColor: '#f7fafc' };
    }
  };

  const generatePDF = () => {
    // Initialisation du document PDF
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    doc.setFont("helvetica");
    doc.setFontSize(22);
    doc.setTextColor("#2c5282");
    doc.text("Planning Hebdomadaire", 149, 15, { align: "center" });
    
    doc.setFontSize(12);
    doc.setTextColor("#4a5568");
    const subtitle = `Semaine du ${format(days[0].date, 'dd MMMM', { locale: fr })} au ${format(days[6].date, 'dd MMMM yyyy', { locale: fr })}`;
    doc.text(subtitle, 149, 25, { align: "center" });
    
    doc.setDrawColor("#2c5282");
    doc.setLineWidth(0.5);
    doc.line(20, 30, 277, 30);
    
    // Création de l'en-tête du tableau
    const tableHead = [
      ["Employés", ...days.map(day => `${format(day.date, 'EEEE', { locale: fr })}\n${format(day.date, 'dd/MM')}`)]
    ];
    
    // Création du corps du tableau 
    const tableBody = users.map(user => {
      const userRow = [user.nom_complet];
      for (const day of days) {
        const cellTasks = getTasksForCell(user.id_user, day);
        // Utiliser libelle au lieu du task object entier
        userRow.push(cellTasks.map(task => task.libelle).join("\n\n"));
      }
      return userRow;
    });

    // Utilisation de autoTable avec type casting pour résoudre l'erreur
    (doc as any).autoTable({
      head: tableHead,
      body: tableBody,
      startY: 40,
      styles: {
        fontSize: 9,
        cellPadding: 4,
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [66, 153, 225],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center',
        cellPadding: 5,
      },
      columnStyles: {
        0: {
          fillColor: [240, 244, 248],
          textColor: [45, 55, 72],
          fontStyle: 'bold',
          cellWidth: 35,
          halign: 'left',
        },
      },
      didDrawCell: (data) => {
        if (data.section === 'body' && data.column.index > 0) {
          const rowIndex = data.row.index;
          const colIndex = data.column.index;
          const user = users[rowIndex];
          const day = days[colIndex - 1];
          
          if (day.isWeekend) {
            doc.setFillColor(251, 240, 240);
            doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
          } else if (user && user.pdfColor) {
            const { r, g, b } = hexToRgb(user.pdfColor);
            doc.setFillColor(r, g, b);
            doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
          }
          
          const cellTasks = getTasksForCell(user.id_user, day);
          
          if (cellTasks.length > 0) {
            let yOffset = data.cell.y + 5;
            
            cellTasks.forEach((task, i) => {
              const taskColor = getTaskOrProjectColor(task);
              if (taskColor) {
                const { r, g, b } = hexToRgb(taskColor.bgColor);
                doc.setFillColor(r, g, b);
                
                doc.roundedRect(data.cell.x + 2, yOffset - 2, data.cell.width - 4, 7, 1, 1, 'F');
                
                if (isProject(task)) {
                  const projectColor = hexToRgb(taskColor.color);
                  doc.setFillColor(projectColor.r, projectColor.g, projectColor.b);
                  doc.circle(data.cell.x + 5, yOffset + 1.5, 1.5, 'F');
                  
                  doc.setTextColor(projectColor.r, projectColor.g, projectColor.b);
                  doc.setFontSize(7);
                  doc.setFont("helvetica", "bold");
                  
                  let displayText = task.libelle;
                  if (task.libelle.startsWith('Projet:')) {
                    displayText = `📋 ${task.libelle.substring(8).trim()}`;
                  } else if (task.libelle.includes(' - Projet')) {
                    const [activity, _] = task.libelle.split(' - Projet');
                    displayText = `${activity} 📋`;
                  }
                  doc.text(displayText, data.cell.x + 8, yOffset + 2);
                  doc.setFont("helvetica", "normal");
                } else {
                  doc.setTextColor(hexToRgb(taskColor.color).r, hexToRgb(taskColor.color).g, hexToRgb(taskColor.color).b);
                  doc.setFontSize(7);
                  doc.text(`• ${task.libelle}`, data.cell.x + 4, yOffset + 2);
                }
                
                yOffset += 10;
              }
            });
          }
        }
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251]
      },
    });
    
    const legendY = (doc as any).autoTable.previous.finalY + 15;
    doc.setFontSize(10);
    doc.setTextColor(45, 55, 72);
    doc.text("Légende:", 20, legendY);
    
    let legendX = 20;
    let currentY = legendY + 5;
    
    doc.setFontSize(8);
    doc.text("Tâches:", legendX, currentY);
    currentY += 5;
    
    const legendTasks = ["Développement frontend", "Réunion client", "Documentation"];
    legendTasks.forEach((task, i) => {
      const taskColor = taskColors[task as keyof typeof taskColors];
      if (taskColor) {
        const { r, g, b } = hexToRgb(taskColor.bgColor);
        doc.setFillColor(r, g, b);
        doc.roundedRect(legendX, currentY - 2, 30, 5, 1, 1, 'F');
        
        doc.setTextColor(hexToRgb(taskColor.color).r, hexToRgb(taskColor.color).g, hexToRgb(taskColor.color).b);
        doc.text(`• ${task}`, legendX + 2, currentY + 1);
        
        currentY += 7;
      }
    });
    
    legendX = 70;
    currentY = legendY + 5;
    
    doc.setTextColor(45, 55, 72);
    doc.text("Projets:", legendX, currentY);
    currentY += 5;
    
    const legendProjects = ["Refonte site web", "Application mobile", "Dashboard analytique"];
    legendProjects.forEach((project, i) => {
      const projectColor = projectColors[project as keyof typeof projectColors];
      if (projectColor) {
        const { r, g, b } = hexToRgb(projectColor.bgColor);
        doc.setFillColor(r, g, b);
        doc.roundedRect(legendX, currentY - 2, 30, 5, 1, 1, 'F');
        
        const pColor = hexToRgb(projectColor.color);
        doc.setFillColor(pColor.r, pColor.g, pColor.b);
        doc.circle(legendX + 3, currentY + 0.5, 1.5, 'F');
        
        doc.setTextColor(pColor.r, pColor.g, pColor.b);
        doc.text(`📋 ${project}`, legendX + 6, currentY + 1);
        
        currentY += 7;
      }
    });
    
    legendX = 140;
    currentY = legendY + 5;
    
    doc.setTextColor(45, 55, 72);
    doc.text("Employés:", legendX, currentY);
    currentY += 5;
    
    users.forEach((user, i) => {
      if (user.pdfColor) {
        const { r, g, b } = hexToRgb(user.pdfColor);
        doc.setFillColor(r, g, b);
        doc.roundedRect(legendX, currentY - 2, 35, 5, 1, 1, 'F');
        
        doc.setTextColor(45, 55, 72);
        doc.text(user.nom_complet, legendX + 2, currentY + 1);
        
        currentY += 7;
      }
    });
    
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      const footerText = `Document généré le ${format(new Date(), 'dd MMMM yyyy à HH:mm', { locale: fr })} - Page ${i} sur ${pageCount}`;
      doc.text(footerText, 149, 200, { align: 'center' });
    }
    
    doc.save(`planning-${format(days[0].date, 'dd-MM-yyyy')}.pdf`);
    
    toast.success("Le PDF a été généré avec succès !");
  };

  const hexToRgb = (hex: string) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const months = [
    { value: "0", label: "Janvier" },
    { value: "1", label: "Février" },
    { value: "2", label: "Mars" },
    { value: "3", label: "Avril" },
    { value: "4", label: "Mai" },
    { value: "5", label: "Juin" },
    { value: "6", label: "Juillet" },
    { value: "7", label: "Août" },
    { value: "8", label: "Septembre" },
    { value: "9", label: "Octobre" },
    { value: "10", label: "Novembre" },
    { value: "11", label: "Décembre" }
  ];

  const getEmployeeBackgroundColor = (employeeId: number) => {
    const user = users.find(u => u.id_user === employeeId);
    if (!user || !user.color) return 'bg-slate-50/10';
    return user.color.split(' ')[0] + '/10';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col animate-fade-in">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="container mx-auto p-4 md:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-800">Planning Hebdomadaire</h1>
        </div>
      </header>

      <main className="container mx-auto p-4 md:px-6 lg:px-8 flex-1">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-slate-500">Chargement des données...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
            <div className="p-4 md:p-6 border-b border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => changeWeek(-1)}
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="text-lg font-medium text-slate-800">
                  Semaine du {format(days[0].date, 'dd MMMM', { locale: fr })} au {format(days[6].date, 'dd MMMM yyyy', { locale: fr })}
                </div>
                
                <Button 
                  onClick={() => changeWeek(1)}
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-700">Mois:</span>
                  <Select
                    value={selectedMonth.toString()}
                    onValueChange={handleMonthChange}
                  >
                    <SelectTrigger className="w-[140px] h-9">
                      <SelectValue placeholder="Sélectionner un mois" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month.value} value={month.value}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-700">Année:</span>
                  <Select
                    value={selectedYear.toString()}
                    onValueChange={handleYearChange}
                  >
                    <SelectTrigger className="w-[100px] h-9">
                      <SelectValue placeholder="Année" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(year => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* <Button 
                  variant="outline" 
                  className="h-9 gap-2" 
                  onClick={()=>{}}
                >
                  <FileDown className="h-4 w-4" />
                  <span>Exporter en PDF</span>
                </Button> */}
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[1000px]">
                <div className="grid grid-cols-8 border-b border-slate-200">
                  <div className="p-4 font-medium text-slate-700 bg-slate-50 border-r border-slate-200">
                    Employés
                  </div>
                  {days.map((day, i) => (
                    <div 
                      key={i} 
                      className={`p-4 font-medium text-slate-700 text-center border-r border-slate-200 last:border-r-0 ${
                        day.isWeekend ? 'bg-red-50/50' : 'bg-slate-50'
                      }`}
                    >
                      <div className="text-sm uppercase tracking-wide">{format(day.date, 'EEEE', { locale: fr })}</div>
                      <div className="text-lg">{format(day.date, 'dd')}</div>
                      <div className="text-xs text-slate-500">{format(day.date, 'MMMM yyyy', { locale: fr })}</div>
                    </div>
                  ))}
                </div>
                
                {users.map(user => (
                  <div key={user.id_user} className="grid grid-cols-8 border-b border-slate-200 last:border-b-0">
                    <div className={`p-4 font-medium border-r border-slate-200 flex items-center ${user.color || 'bg-gray-100 border-gray-200 text-gray-800'}`}>
                      {user.nom_complet}
                    </div>
                    {days.map((day, i) => {
                      const cellTasks = getTasksForCell(user.id_user, day);
                      const cellProjects = getProjectsForCell(user.id_user, day);
                      return (
                        <div 
                          key={i} 
                          className={`p-3 min-h-28 border-r border-slate-200 last:border-r-0 hover:bg-slate-50/75 transition-colors ${
                            day.isWeekend ? 'bg-red-50/20' : getEmployeeBackgroundColor(user.id_user)
                          }`}
                          onClick={() => handleCellClick(user.id_user, day)}
                        >
                          <div className="flex flex-col gap-2 h-full relative">
                            {cellTasks.map((task, j) => (
                              <TaskCard key={j} task={task.libelle} />
                            ))}
                              {cellProjects.map((pro, j) => (
                                <TaskCard key={j} task={pro.project_name} />
                              ))}
                            {(cellTasks.length + cellProjects.length)  < 3 && (
                              <button 
                                className="mt-auto text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center gap-1"
                              >
                                <Plus className="h-3 w-3" />
                                <span>{cellTasks.length > 0 ? 'Ajouter' : 'Ajouter une tâche'}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {showTaskModal && modalData.employeeId && modalData.day && (
        <TaskModal
          show={showTaskModal}
          onClose={() => setShowTaskModal(false)}
          employee={users.find(e => e.id_user === modalData.employeeId)?.id_user || 0}
          nameUser={users.find(e => e.id_user === modalData.employeeId)?.nom_complet || ''}
          day={modalData.day}
          tasks={dbTasks}
          selectedTask={selectedTaskId}
          OnAddProject={fetchProjects}
          onSelectTask={setSelectedTaskId}
          onAddTask={handleAddTask}
        />
      )}
    </div>
  );
};

export default Index;
