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


  const exportToCSV = () => {
    if (filteredReports.length === 0) {
      toast.error("Aucun rapport à exporter.");
      return;
    }
  
    const headers = ["Date", "Tâches", "Blocage", "Solution", "Temps", "Utilisateur"];
    const rows = filteredReports.map((report) => {
      // Vérifier que report.date est défini et valide
      const date = report.date ? format(parseISO(report.date), "yyyy-MM-dd") : "Date inconnue";
      const temps = report.temps ? "Matin" : "Soir";
      const utilisateur = getUserName(report.userId);
      return [
        date,
        report.taches || "N/A", // Gérer les tâches manquantes
        report.blockage || "N/A", // Gérer les blocages manquants
        report.solution || "N/A", // Gérer les solutions manquantes
        temps,
        utilisateur,
      ];
    });
  
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(","))
    ].join("\n");
  
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `rapports_${format(currentWeek, "yyyy-MM-dd")}.csv`);
  };

  const exportToPDF = () => {
    if (filteredReports.length === 0) {
      toast.error("Aucun rapport à exporter.");
      return;
    }
  
    const doc = new jsPDF();
  
    doc.setFontSize(18);
    doc.text(`Rapports Hebdomadaires - Semaine du ${format(getWeekDays()[0], "d MMMM yyyy", { locale: fr })}`, 10, 10);
  
    let y = 20;
    filteredReports.forEach((report) => {
      // Vérifier que report.date est défini et valide
      const date = report.date ? format(parseISO(report.date), "yyyy-MM-dd") : "Date inconnue";
      const temps = report.temps ? "Matin" : "Soir";
      const utilisateur = getUserName(report.userId);
  
      doc.setFontSize(12);
      doc.text(`Date: ${date}`, 10, y);
      doc.text(`Temps: ${temps}`, 10, y + 10);
      doc.text(`Utilisateur: ${utilisateur}`, 10, y + 20);
      doc.text(`Tâches: ${report.taches || "N/A"}`, 10, y + 30); // Gérer les tâches manquantes
      if (report.blockage) {
        doc.text(`Blocage: ${report.blockage}`, 10, y + 40);
      }
      if (report.solution) {
        doc.text(`Solution: ${report.solution}`, 10, y + 50);
      }
      y += 60;
    });
  
    doc.save(`rapports_${format(currentWeek, "yyyy-MM-dd")}.pdf`);
  };

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