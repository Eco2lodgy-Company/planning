"use client";
import { useState, useEffect, useMemo } from "react";
import { format, startOfWeek, addDays, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";

interface Rapport {
  id: number;
  taches: string;
  blockage: string;
  solution: string;
  date: string;
  temps: boolean; // true pour matin, false pour soir
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
    const days = Array.from({ length: 5 }).map((_, i) => addDays(start, i)); // Se limitant à 5 jours
    return days;
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
    const csvContent = "data:text/csv;charset=utf-8,"
      + "ID,Tâches,Blocage,Solution,Date,Temps,Utilisateur\n"
      + filteredReports.map(report =>
        `${report.id},${report.taches},${report.blockage},${report.solution},${report.date},${report.temps ? "Matin" : "Soir"},${getUserName(report.userId)}`
      ).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "rapports.csv");
    document.body.appendChild(link);
    link.click();
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Rapports Hebdomadaires", 10, 10);
    let y = 20;
    filteredReports.forEach(report => {
      doc.text(`ID: ${report.id}`, 10, y);
      doc.text(`Tâches: ${report.taches}`, 10, y + 10);
      doc.text(`Blocage: ${report.blockage}`, 10, y + 20);
      doc.text(`Solution: ${report.solution}`, 10, y + 30);  {/* Ajout du champ Solution */}
      doc.text(`Date: ${report.date}`, 10, y + 40);
      doc.text(`Temps: ${report.temps ? "Matin" : "Soir"}`, 10, y + 50);
      doc.text(`Utilisateur: ${getUserName(report.userId)}`, 10, y + 60);
      y += 70;
    });
    doc.save("rapports.pdf");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Rapports hebdomadaires</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentWeek((prev) => addDays(prev, -7))}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-medium">
              Semaine du {format(getWeekDays()[0], "d MMMM yyyy", { locale: fr })}
            </span>
            <button
              onClick={() => setCurrentWeek((prev) => addDays(prev, 7))}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="flex justify-between mb-4">
          <select
            value={selectedUserId || ""}
            onChange={(e) => setSelectedUserId(e.target.value ? Number(e.target.value) : null)}
            className="p-2 border rounded"
          >
            <option value="">Tous les utilisateurs</option>
            {users.map((user) => (
              <option key={user.id_user} value={user.id_user}>
                {user.nom_complet}
              </option>
            ))}
          </select>
          <div className="space-x-2">
            <button
              onClick={exportToCSV}
              className="p-2 bg-blue-500 text-white rounded"
            >
              Exporter en CSV
            </button>
            <button
              onClick={exportToPDF}
              className="p-2 bg-green-500 text-white rounded"
            >
              Exporter en PDF
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            {/* Grille pour les jours de la semaine */}
            <div className="grid grid-cols-6 gap-4 text-center p-2 font-medium text-gray-500 bg-gray-100">
              <div></div> {/* Case vide pour le titre */}
              {getWeekDays().map((day) => (
                <div key={day.toString()} className="border-b p-2">
                  {format(day, "iiii", { locale: fr })}
                </div>
              ))}
            </div>

            {/* Lignes pour le matin */}
            <div className="grid grid-cols-6 gap-4 p-2">
              <div className="font-semibold text-center">Matin</div>
              {getWeekDays().map((day) => {
                const dayReports = getReportsForDay(day);
                return (
                  <div key={day.toString()} className="p-2 border-b">
                    {dayReports.morning.length > 0 ? (
                      dayReports.morning.map((report) => (
                        <div key={report.id} className="p-2 rounded border bg-gray-50">
                          <div className="font-medium break-words">
                            <strong>Tâches:</strong> {report.taches}
                          </div>
                          <div className="text-sm text-gray-500 break-words">
                            <strong>Blocage:</strong> {report.blockage}
                          </div>
                          <div className="text-sm text-gray-500 break-words">
                            <strong>Solution:</strong> {report.solution}
                          </div>
                          <div className="text-xs text-gray-400 break-words">
                            <strong>Utilisateur:</strong> {getUserName(report.userId)}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-500">Aucun rapport</div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Lignes pour le soir */}
            <div className="grid grid-cols-6 gap-4 p-2">
              <div className="font-semibold text-center">Soir</div>
              {getWeekDays().map((day) => {
                const dayReports = getReportsForDay(day);
                return (
                  <div key={day.toString()} className="p-2 border-b">
                    {dayReports.evening.length > 0 ? (
                      dayReports.evening.map((report) => (
                        <div key={report.id} className="p-2 rounded border bg-gray-50">
                          <div className="font-medium break-words">
                            <strong>Tâches:</strong> {report.taches}
                          </div>
                          <div className="text-sm text-gray-500 break-words">
                            <strong>Blocage:</strong> {report.blockage}
                          </div>
                          <div className="text-sm text-gray-500 break-words">
                            <strong>Solution:</strong> {report.solution}
                          </div>
                          <div className="text-xs text-gray-400 break-words">
                            <strong>Utilisateur:</strong> {getUserName(report.userId)}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-500">Aucun rapport</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
