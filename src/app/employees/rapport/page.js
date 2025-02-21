'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sun, Moon, Clock, AlertCircle, CheckCircle2, User, Plus } from 'lucide-react';

const WeeklyReports = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [reports, setReports] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false); // État pour gérer l'ouverture du formulaire
  const [formData, setFormData] = useState({
    user_name: '',
    taches: '',
    blockage: '',
    solution: '',
    temps: 'morning', // Par défaut, le rapport est pour le matin
    created_at: new Date().toISOString(), // Date actuelle par défaut
  });

  // Colors for different days with gradients for a more modern look
  const dayColors = {
    Monday: { bg: 'from-blue-50 to-blue-100', border: 'border-blue-200', header: 'from-blue-500 to-blue-600' },
    Tuesday: { bg: 'from-purple-50 to-purple-100', border: 'border-purple-200', header: 'from-purple-500 to-purple-600' },
    Wednesday: { bg: 'from-emerald-50 to-emerald-100', border: 'border-emerald-200', header: 'from-emerald-500 to-emerald-600' },
    Thursday: { bg: 'from-amber-50 to-amber-100', border: 'border-amber-200', header: 'from-amber-500 to-amber-600' },
    Friday: { bg: 'from-rose-50 to-rose-100', border: 'border-rose-200', header: 'from-rose-500 to-rose-600' }
  };

  // Get dates for the current week
  const getWeekDates = (date) => {
    const week = [];
    const monday = new Date(date);
    monday.setDate(date.getDate() - date.getDay() + 1);

    for (let i = 0; i < 5; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      week.push(day);
    }
    return week;
  };

  // Format date to YYYY-MM-DD
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Navigate between weeks
  const navigateWeek = (direction) => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newDate);
  };

  // Mock data fetching - replace with actual API call
  useEffect(() => {
    const fetchReports = async () => {
      const weekDates = getWeekDates(currentWeek);
      const startDate = formatDate(weekDates[0]);
      const endDate = formatDate(weekDates[4]);

      // API call - replace with actual implementation
      const fetchLate = async () => {
        const userId = localStorage.getItem('userId');
        try {
          const response = await fetch('/api/rapport/' + userId);
          if (!response.ok) throw new Error('Erreur lors de la récupération des informations');
          const data = await response.json();
          setReports(data);
        } catch (error) {
          console.error(error.message);
        }
      };

      fetchLate();
    };

    fetchReports();
  }, [currentWeek]);

  // Get reports for a specific date and time (morning/evening)
  const getDayReports = (date, isMorning) => {
    return reports.filter(report => {
      const reportDate = new Date(report.created_at).toISOString().split('T')[0];
      return reportDate === formatDate(date) && report.temps === isMorning;
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/rapport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Erreur lors de la soumission du rapport');
      const newReport = await response.json();
      setReports([...reports, newReport]); // Ajouter le nouveau rapport à la liste
      setIsFormOpen(false); // Fermer le formulaire
      setFormData({
        user_name: '',
        taches: '',
        blockage: '',
        solution: '',
        temps: 'morning',
        created_at: new Date().toISOString(),
      }); // Réinitialiser le formulaire
    } catch (error) {
      console.error(error.message);
    }
  };

  const ReportCard = ({ report }) => (
    <div className="p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start gap-3">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">User ID: {report.user_name}</span>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Tâches</h4>
            <p className="text-sm text-gray-600 mt-1">{report.taches}</p>
          </div>
          {report.blockage && (
            <div>
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-4 h-4" />
                <h4 className="font-medium">Blocage</h4>
              </div>
              <p className="text-sm text-red-600 mt-1">{report.blockage}</p>
            </div>
          )}
          {report.solution && (
            <div>
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                <h4 className="font-medium">Solution</h4>
              </div>
              <p className="text-sm text-green-600 mt-1">{report.solution}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const DayColumn = ({ date }) => {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const colors = dayColors[dayName];
    const morningReports = getDayReports(date, true);
    const eveningReports = getDayReports(date, false);

    return (
      <div className={`flex-1 rounded-lg bg-gradient-to-b ${colors.bg} ${colors.border} border overflow-hidden`}>
        <div className={`bg-gradient-to-r ${colors.header} p-3`}>
          <h3 className="text-white font-medium text-center">
            {date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' })}
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {/* Morning Section */}
          <div className="p-3 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-full bg-yellow-100">
                <Sun className="w-4 h-4 text-yellow-600" />
              </div>
              <h4 className="text-sm font-medium text-gray-700">Matin</h4>
            </div>
            <div className="space-y-2">
              {morningReports.length > 0 ? (
                morningReports.map(report => (
                  <ReportCard key={report.id} report={report} />
                ))
              ) : (
                <div className="text-center py-4 bg-white/50 rounded-lg">
                  <p className="text-sm text-gray-500">Aucun rapport</p>
                </div>
              )}
            </div>
          </div>

          {/* Evening Section */}
          <div className="p-3 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-full bg-indigo-100">
                <Moon className="w-4 h-4 text-indigo-600" />
              </div>
              <h4 className="text-sm font-medium text-gray-700">Soir</h4>
            </div>
            <div className="space-y-2">
              {eveningReports.length > 0 ? (
                eveningReports.map(report => (
                  <ReportCard key={report.id} report={report} />
                ))
              ) : (
                <div className="text-center py-4 bg-white/50 rounded-lg">
                  <p className="text-sm text-gray-500">Aucun rapport</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Rapports Hebdomadaires</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateWeek('prev')}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Semaine précédente"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">
                {getWeekDates(currentWeek)[0].toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} - 
                {getWeekDates(currentWeek)[4].toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
            <button
              onClick={() => navigateWeek('next')}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Semaine suivante"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
            <button
              onClick={() => setIsFormOpen(true)}
              className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              aria-label="Soumettre un rapport"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Weekly grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {getWeekDates(currentWeek).map((date) => (
            <DayColumn key={date.toISOString()} date={date} />
          ))}
        </div>
      </div>

      {/* Formulaire de soumission de rapport */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Soumettre un rapport</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
                <input
                  type="text"
                  name="user_name"
                  value={formData.user_name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tâches</label>
                <textarea
                  name="taches"
                  value={formData.taches}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Blocage</label>
                <textarea
                  name="blockage"
                  value={formData.blockage}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Solution</label>
                <textarea
                  name="solution"
                  value={formData.solution}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Temps</label>
                <select
                  name="temps"
                  value={formData.temps}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="morning">Matin</option>
                  <option value="evening">Soir</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Soumettre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyReports;