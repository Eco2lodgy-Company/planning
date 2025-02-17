"use client"
import { useState, useEffect, useMemo } from "react";
import { format, startOfWeek, addDays, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Download, FileDown } from "lucide-react";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";
// import { XLSX } from "xlsx";

interface Rapport {
  id: number;
  taches: string;
  blockage: string;
  solution: string;
  date: string;
  temps: boolean;
  userId: number | null;
}

interface User {
  id_user: number;
  nom_complet: string;
}

export default function WeeklyReports() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [reports, setReports] = useState<Rapport[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async (id_utilisateur: number) => {
    try {
      const response = await fetch("/api/users/byid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_user: id_utilisateur }),
      });
      const result = await response.json();
      if (response.ok) {
        return result.user;
      } else {
        console.error(`Erreur pour id_utilisateur ${id_utilisateur}:`, result.message);
        return { id_user: id_utilisateur, nom_complet: "Utilisateur inconnu" };
      }
    } catch (error) {
      console.error(`Erreur réseau pour id_utilisateur ${id_utilisateur}:`, error);
      return { id_user: id_utilisateur, nom_complet: "Erreur réseau" };
    }
  };

  const fetchUsersForReports = async (reports: Rapport[]) => {
    const uniqueIds = [...new Set(reports.map((report) => report.userId).filter(Boolean))];
    const usersData = await Promise.all(uniqueIds.map((id) => fetchUser(id as number)));
    return usersData;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const start = format(startOfWeek(currentWeek, { weekStartsOn: 1 }), "yyyy-MM-dd");
        const end = format(addDays(startOfWeek(currentWeek, { weekStartsOn: 1 }), 6), "yyyy-MM-dd");

        const response = await fetch(`/api/rapport?start=${start}&end=${end}`);
        const result = await response.json();

        if (response.ok) {
          setReports(result);
          const usersData = await fetchUsersForReports(result || []);
          setUsers(usersData);
        } else {
          setError("Erreur lors de la récupération des rapports.");
        }
      } catch (error) {
        setError("Erreur lors de la récupération des données.");
        toast.error("Erreur lors de la récupération des données.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentWeek]);

  const filteredReports = useMemo(() => {
    if (!selectedUserId) return reports;
    return reports.filter((report) => report.userId === selectedUserId);
  }, [reports, selectedUserId]);

  const reportsByDayAndTime = useMemo(() => {
    const result: { [key: string]: { morning: Rapport[]; evening: Rapport[] } } = {};
    filteredReports.forEach((report) => {
      if (!report || typeof report.date !== "string") {
        console.warn("Rapport invalide :", report);
        return;
      }
      const reportDate = parseISO(report.date);
      const dateKey = format(reportDate, "yyyy-MM-dd");
      if (!result[dateKey]) {
        result[dateKey] = { morning: [], evening: [] };
      }
      if (report.temps) {
        result[dateKey].morning.push(report);
      } else {
        result[dateKey].evening.push(report);
      }
    });
    return result;
  }, [filteredReports]);

  const getWeekDays = () => {
    const start = startOfWeek(currentWeek, { weekStartsOn: 1 });
    return Array.from({ length: 5 }).map((_, i) => addDays(start, i));
  };

  const getReportsForDay = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    return reportsByDayAndTime[dateKey] || { morning: [], evening: [] };
  };

  const getUserName = (id_utilisateur: number | null) => {
    const user = users.find((user) => user.id_user === id_utilisateur);
    return user ? user.nom_complet : "Utilisateur inconnu";
  };

  // const exportToCSV = () => {
  //   const csvContent = "data:text/csv;charset=utf-8," 
  //     + "ID,Tâches,Blocage,Solution,Date,Temps,Utilisateur\n" 
  //     + filteredReports.map(report => 
  //         `${report.id},${report.taches || "Non spécifiées"},${report.blockage || "Aucun"},` +
  //         `${report.solution || "Aucune"},${report.date || "Non spécifiée"},` +
  //         `${report.temps ? "Matin" : "Soir"},${getUserName(report.userId) || "Non assigné"}`
  //       ).join("\n");
  
  //   const encodedUri = encodeURI(csvContent);
  //   const link = document.createElement("a");
  //   link.setAttribute("href", encodedUri);
  //   link.setAttribute("download", "rapports.csv");
  //   document.body.appendChild(link);
  //   link.click();
  // };
//   const XLSX = require('xlsx');

// const exportToCSV = () => {
//   // Données simulées basées sur la fonction exportToCSV
//   const filteredReports = [
//     {
//       id: 1,
//       taches: "Finalisation du parcours sécurité",
//       blockage: "Aucun",
//       solution: "Aucune",
//       date: "12/19/2019",
//       temps: true,
//       userId: 1
//     },
//     {
//       id: 2,
//       taches: "Purification des esters d'acides gras",
//       blockage: "Pollution par la thiochimie",
//       solution: "Date de décontamination non arrêtée",
//       date: "12/19/2019",
//       temps: false,
//       userId: 1
//     }
//   ];

//   const getUserName = () => {
//     // Simuler une fonction pour obtenir le nom d'utilisateur
//     return "James Thomson";
//   };

//   // Créer un nouveau classeur
//   const workbook = XLSX.utils.book_new();

//   // Créer une feuille de calcul avec les données
//   const worksheetData = [
//     ["Semaine du", "", "12/19/2019", "", "SUIVI HEBDOMADAIRE", "", "", "", "", "", "", "", ""],
//     ["Agent :", "", "James Thomson", "", "", "", "", "", "", "", "", "", ""],
//     ["HORAIRE", "", "", "", "", "", "", "", "", "", "", "", ""],
//     ["Lundi", "", "Mardi", "", "Mercredi", "", "Jeudi", "", "Vendredi", "", "Samedi", "", "Dimanche"],
//     ["8h-12h", "13h-17h", "9h-12h", "13h-17h", "7h-12h", "13h30-16h", "7h-12h", "13h-17h", "9h-11h30", "14h-16h", "", "", ""],
//     ["FICHE DE TRAVAIL", "", "", "", "", "", "", "", "", "", "", "", ""],
//     ["Titre", "", "", "Tâches", "", "", "", "", "", "", "", "", ""],
//     ["Tâches administratives", "", "", "Finalisation du parcours sécurité", "", "", "", "", "", "", "", "", ""],
//     ["", "", "", "Enregistrement sur la base de données ICGM", "", "", "", "", "", "", "", "", ""],
//     ["", "", "", "Etc…", "", "", "", "", "", "", "", "", ""],
//     ["Tâches scientifiques", "", "", "Purification des esters d'acides gras (stéarate, oléate, linoéate) par cristallisation dans un mélange eau/éthanol à doser", "", "", "", "", "", "", "", "", ""],
//     ["", "", "", "Recherche bibliographique sur les procédés de réduction des esters en éthers, amorce de la rédaction du rapport afférent", "", "", "", "", "", "", "", "", ""],
//     ["", "", "", "Etc…", "", "", "", "", "", "", "", "", ""],
//     ["Tâches techniques", "", "", "Montage de la rampe à vide avec le régulateur ACOVACUUM X342F", "", "", "", "", "", "", "", "", ""],
//     ["", "", "", "Commande de la résine Amberlite échangeuse d'ions pour future époxydation", "", "", "", "", "", "", "", "", ""],
//     ["", "", "", "Commande et réception de la verrerie (tricols, erlens, béchers) pour phase de réduction", "", "", "", "", "", "", "", "", ""],
//     ["", "", "", "Etc…", "", "", "", "", "", "", "", "", ""],
//     ["Difficultés rencontrées mais résolues", "", "", "La pompe à vide primaire n'est pas assez performante", "", "", "", "", "", "", "", "", ""],
//     ["", "", "", "Casse du robinet de la rampe => transmission au verrier pour réparation", "", "", "", "", "", "", "", "", ""],
//     ["", "", "", "Etc…", "", "", "", "", "", "", "", "", ""],
//     ["Points bloquants ou à résoudre", "", "", "Pollution par la thiochimie de l'espace de travail => date de décontamination non arrêtée", "", "", "", "", "", "", "", "", ""],
//     ["", "", "", "Purification incomplète du lot SP021 : protocole à redimensionner", "", "", "", "", "", "", "", "", ""],
//     ["", "", "", "Etc…", "", "", "", "", "", "", "", "", ""],
//     ["Actions à court terme (- de 7 jours d'intervention)", "", "", "Vidange de la pompe à vide secondaire", "", "", "", "", "", "", "", "", ""],
//     ["", "", "", "Finaliser le rapport 'éthérification'", "", "", "", "", "", "", "", "", ""],
//     ["", "", "", "Etc…", "", "", "", "", "", "", "", "", ""]
//   ];

//   const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

//   // Ajouter la feuille de calcul au classeur
//   XLSX.utils.book_append_sheet(workbook, worksheet, "Feuille1");

//   // Écrire le fichier Excel dans un buffer
//   const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

//   // Créer un Blob à partir du buffer
//   const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

//   // Créer un lien de téléchargement
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement('a');
//   link.href = url;
//   link.download = 'modeleFT_JamesThomson_19122019.xlsx';
//   document.body.appendChild(link);
//   link.click();

//   // Nettoyer
//   document.body.removeChild(link);
//   URL.revokeObjectURL(url);
// };

// // Appeler la fonction pour tester
// exportToCSV();
  
//   const exportToPDF = () => {
//     const doc = new jsPDF();
//     doc.text("Rapports Hebdomadaires", 10, 10);
  
//     let y = 20;
  
//     filteredReports.forEach(report => {
//       if (y > 280) {
//         doc.addPage();
//         y = 20;
//       }
  
//       doc.text(`ID: ${report.id}`, 10, y);
//       doc.text(`Tâches: ${report.taches || "Non spécifiées"}`, 10, y + 10);
//       doc.text(`Blocage: ${report.blockage || "Aucun"}`, 10, y + 20);
//       doc.text(`Solution: ${report.solution || "Aucune"}`, 10, y + 30);
//       doc.text(`Date: ${report.date || "Non spécifiée"}`, 10, y + 40);
//       doc.text(`Temps: ${report.temps ? "Matin" : "Soir"}`, 10, y + 50);
//       doc.text(`Utilisateur: ${getUserName(report.userId) || "Non assigné"}`, 10, y + 60);
  
//       y += 70;
//     });
  
//     doc.save("rapports.pdf");
//   };
  

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Rapports hebdomadaires</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentWeek((prev) => addDays(prev, -7))}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-medium">
              Semaine du {format(getWeekDays()[0], "d MMMM yyyy", { locale: fr })}
            </span>
            <button
              onClick={() => setCurrentWeek((prev) => addDays(prev, 7))}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="mb-6 flex justify-between items-center">
          <select
            value={selectedUserId || ""}
            onChange={(e) => setSelectedUserId(e.target.value ? Number(e.target.value) : null)}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
          >
            <option value="">Tous les utilisateurs</option>
            {users.map((user) => (
              <option key={user.id_user} value={user.id_user}>
                {user.nom_complet}
              </option>
            ))}
          </select>
          <div className="flex gap-3">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <FileDown className="w-4 h-4" />
              CSV
            </button>
            <button
              onClick={exportToPDF}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              PDF
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="grid grid-cols-5 border-b">
              {getWeekDays().map((day) => (
                <div
                  key={day.toString()}
                  className="p-4 font-medium text-gray-700 text-center border-r last:border-r-0 bg-gray-50"
                >
                  {format(day, "EEEE d/MM", { locale: fr })}
                </div>
              ))}
            </div>

            <div className="divide-y">
              {/* Section Matin */}
              <div>
                <div className="grid grid-cols-5">
                  {getWeekDays().map((day) => {
                    const dayReports = getReportsForDay(day);
                    return (
                      <div key={`morning-${day}`} className="p-4 border-r last:border-r-0">
                        <div className="mb-2 text-sm font-medium text-gray-500">Matin</div>
                        <div className="space-y-3">
                          {dayReports.morning.length > 0 ? (
                            dayReports.morning.map((report) => (
                              <div
                                key={report.id}
                                className="p-3 rounded-lg bg-blue-50 border border-blue-100"
                              >
                                <div className="font-medium text-gray-900 mb-1 break-words whitespace-normal">
                                  {report.taches}
                                </div>
                                {report.blockage && (
                                  <div className="text-sm text-red-600 mb-1">
                                    <span className="font-medium">Blocage:</span> {report.blockage}
                                  </div>
                                )}
                                {report.solution && (
                                  <div className="text-sm text-green-600 mb-1">
                                    <span className="font-medium">Solution:</span> {report.solution}
                                  </div>
                                )}
                                <div className="text-xs text-gray-500">
                                  {getUserName(report.userId)}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-gray-400 text-center py-2">
                              Aucun rapport
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section Soir */}
              <div>
                <div className="grid grid-cols-5">
                  {getWeekDays().map((day) => {
                    const dayReports = getReportsForDay(day);
                    return (
                      <div key={`evening-${day}`} className="p-4 border-r last:border-r-0">
                        <div className="mb-2 text-sm font-medium text-gray-500">Soir</div>
                        <div className="space-y-3">
                          {dayReports.evening.length > 0 ? (
                            dayReports.evening.map((report) => (
                              <div
                                key={report.id}
                                className="p-3 rounded-lg bg-purple-50 border border-purple-100"
                              >
                                <div className="font-medium text-gray-900 mb-1">
                                  {report.taches}
                                </div>
                                {report.blockage && (
                                  <div className="text-sm text-red-600 mb-1">
                                    <span className="font-medium">Blocage:</span> {report.blockage}
                                  </div>
                                )}
                                {report.solution && (
                                  <div className="text-sm text-green-600 mb-1">
                                    <span className="font-medium">Solution:</span> {report.solution}
                                  </div>
                                )}
                                <div className="text-xs text-gray-500">
                                  {getUserName(report.userId)}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-gray-400 text-center py-2">
                              Aucun rapport
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}