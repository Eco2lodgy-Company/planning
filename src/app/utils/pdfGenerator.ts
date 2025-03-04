import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from "sonner";
import { DayInfo, Task, User } from '@/types/planning';
import { taskColors, projectColors, hexToRgb, isProject, extractProjectName } from './colorUtils';

// Obtenir la couleur pour une tâche ou un projet dans le PDF
const getTaskOrProjectColor = (task: Task) => {
  if (isProject(task.libelle)) {
    const projectName = extractProjectName(task.libelle);
    return projectColors[projectName as keyof typeof projectColors] || 
           { color: '#4a5568', bgColor: '#f7fafc' };
  } else {
    return taskColors[task.libelle as keyof typeof taskColors] || 
           { color: '#4a5568', bgColor: '#f7fafc' };
  }
};

export const generatePDF = (days: DayInfo[], users: User[], getTasksForCell: (employeeId: number, day: DayInfo) => Task[]) => {
  // Afficher un toast pour indiquer que la génération est en cours
  toast.info("Génération du PDF en cours...");
  
  try {
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
            
            cellTasks.forEach((task) => {
              const taskColor = getTaskOrProjectColor(task);
              if (taskColor) {
                const { r, g, b } = hexToRgb(taskColor.bgColor);
                doc.setFillColor(r, g, b);
                
                doc.roundedRect(data.cell.x + 2, yOffset - 2, data.cell.width - 4, 7, 1, 1, 'F');
                
                if (isProject(task.libelle)) {
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
    
    // Ajout de la légende
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
    legendTasks.forEach((task) => {
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
    legendProjects.forEach((project) => {
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
    
    users.forEach((user) => {
      if (user.pdfColor) {
        const { r, g, b } = hexToRgb(user.pdfColor);
        doc.setFillColor(r, g, b);
        doc.roundedRect(legendX, currentY - 2, 35, 5, 1, 1, 'F');
        
        doc.setTextColor(45, 55, 72);
        doc.text(user.nom_complet, legendX + 2, currentY + 1);
        
        currentY += 7;
      }
    });
    
    // Ajout du pied de page
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      const footerText = `Document généré le ${format(new Date(), 'dd MMMM yyyy à HH:mm', { locale: fr })} - Page ${i} sur ${pageCount}`;
      doc.text(footerText, 149, 200, { align: 'center' });
    }
    
    // Télécharger le PDF avec un nom plus descriptif
    const fileName = `planning-${format(days[0].date, 'dd-MM-yyyy')}-au-${format(days[6].date, 'dd-MM-yyyy')}.pdf`;
    doc.save(fileName);
    
    // Afficher une notification de succès
    toast.success("Le PDF a été généré et téléchargé avec succès !");
  } catch (error) {
    console.error("Erreur lors de la génération du PDF:", error);
    toast.error("Une erreur est survenue lors de la génération du PDF");
  }
};
