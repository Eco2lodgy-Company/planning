
"use client"// pages/index.js
import { useState, useEffect, AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from 'react';
import Head from 'next/head';
import { addDays, format, startOfWeek, getMonth, getYear, setMonth, setYear } from 'date-fns';
import { fr } from 'date-fns/locale';
import { PDFDownloadLink, Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';

// Exemple de données des employés
const employees = [
  { id: 1, name: 'Sophie Martin' },
  { id: 2, name: 'Thomas Dubois' },
  { id: 3, name: 'Camille Laurent' },
  { id: 4, name: 'Antoine Bernard' },
  { id: 5, name: 'Emma Petit' },
];

interface user {
    id_user: number;
    nom_complet: string;
}
// Liste prédéfinie des tâches
const predefinedTasks = [
  "Développement frontend",
  "Développement backend",
  "Design UI/UX",
  "Réunion client",
  "Tests fonctionnels",
  "Revue de code",
  "Documentation",
  "Planification sprint",
  "Correction de bugs",
  "Déploiement",
  "Formation",
  "Analyse des besoins",
  "Recherche",
  "Support client",
  "Optimisation"
];

// Composant principal
export default function ProjectPlanning() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<{ [key: string]: string[] }>({});
  const [selectedMonth, setSelectedMonth] = useState(getMonth(new Date()));
  const [selectedYear, setSelectedYear] = useState(getYear(new Date()));
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [modalData, setModalData] = useState({ employeeId: null, day: null });
  const [selectedTask, setSelectedTask] = useState('');

  // Années disponibles (de l'année courante à +5 ans)
  const years = Array.from({ length: 6 }, (_, i) => getYear(new Date()) + i - 2);

  // Générer les jours de la semaine
  const days = Array.from({ length: 5 }).map((_, i) => {
    const date = addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), i);
    return {
      date,
      label: format(date, 'EEEE', { locale: fr }),
      formattedDate: format(date, 'dd/MM/yyyy')
    };
  });

  // Changer de semaine
  const changeWeek = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction * 7));
    
    // Si le mois ou l'année de la nouvelle date ne correspond pas aux sélections,
    // et que les filtres sont actifs, ne pas changer de semaine
    if (
      (selectedMonth !== null && getMonth(newDate) !== selectedMonth) ||
      (selectedYear !== null && getYear(newDate) !== selectedYear)
    ) {
      return;
    }
    
    setCurrentDate(newDate);
  };

  // Changer de mois
  const handleMonthChange = (e: { target: { value: string; }; }) => {
    const month = parseInt(e.target.value, 10);
    setSelectedMonth(month);
    
    // Mettre à jour la date courante pour correspondre au premier lundi du mois/année sélectionnés
    updateCurrentDateForFilters(month, selectedYear);
  };

  // Changer d'année
  const handleYearChange = (e: { target: { value: string; }; }) => {
    const year = parseInt(e.target.value, 10);
    setSelectedYear(year);
    
    // Mettre à jour la date courante pour correspondre au premier lundi du mois/année sélectionnés
    updateCurrentDateForFilters(selectedMonth, year);
  };

  // Mettre à jour la date courante en fonction des filtres
  const updateCurrentDateForFilters = (month: number, year: number) => {
    const newDate = new Date(year, month, 1);
    const firstMonday = startOfWeek(newDate, { weekStartsOn: 1 });
    setCurrentDate(firstMonday);
  };

  // Afficher le modal d'ajout de tâche
  const handleCellClick = (employeeId: number, day: { date: any; label?: string; formattedDate?: string; }) => {
    const key = `${employeeId}-${format(day.date, 'yyyy-MM-dd')}`;
    const currentTasks = tasks[key] || [];
    
    // Vérifier si le nombre maximum de tâches est atteint
    if (currentTasks.length >= 3) {
      alert('Maximum 3 tâches par jour et par employé');
      return;
    }
    
    setModalData({ employeeId, day });
    setSelectedTask(predefinedTasks[0]);
    setShowTaskModal(true);
  };

  // Ajouter une tâche
  const handleAddTask = () => {
    if (!selectedTask) return;
    
    const { employeeId, day } = modalData;
    const key = `${employeeId}-${format(day.date, 'yyyy-MM-dd')}`;
    
    setTasks(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), selectedTask]
    }));
    
    setSelectedTask('');
    setShowTaskModal(false);
  };

  // Récupérer les tâches pour une cellule donnée
  const getTasksForCell = (employeeId: number, day: { date: any; label?: string; formattedDate?: string; }) => {
    const key = `${employeeId}-${format(day.date, 'yyyy-MM-dd')}`;
    return tasks[key] || [];
  };

  // Styles pour le PDF
  const pdfStyles = StyleSheet.create({
    page: {
      padding: 30,
      backgroundColor: '#ffffff'
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
      textAlign: 'center'
    },
    subtitle: {
      fontSize: 14,
      marginBottom: 20,
      textAlign: 'center'
    },
    table: {
      display: 'flex',
      width: 'auto',
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: '#bfbfbf',
      marginBottom: 20
    },
    tableRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#bfbfbf',
    },
    tableHeader: {
      backgroundColor: '#f2f2f2',
      fontWeight: 'bold'
    },
    tableCell: {
      width: '16.67%',
      padding: 5,
      borderRightWidth: 1,
      borderRightColor: '#bfbfbf',
    },
    employeeCell: {
      width: '16.67%',
      padding: 5,
      borderRightWidth: 1,
      borderRightColor: '#bfbfbf',
      backgroundColor: '#f8f8f8'
    },
    taskItem: {
      fontSize: 10,
      marginBottom: 2
    }
  });

  // Composant PDF
  const PlanningPDF = () => (
    <Document>
      <Page size="A4" orientation="landscape" style={pdfStyles.page}>
        <Text style={pdfStyles.title}>
          Planning du {format(days[0].date, 'dd/MM/yyyy')} au {format(days[4].date, 'dd/MM/yyyy')}
        </Text>
        <Text style={pdfStyles.subtitle}>
          {format(days[0].date, 'MMMM yyyy', { locale: fr })}
        </Text>
        <View style={pdfStyles.table}>
          <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]}>
            <Text style={pdfStyles.tableCell}>Employés</Text>
            {days.map((day, i) => (
              <Text key={i} style={pdfStyles.tableCell}>
                {day.label} {format(day.date, 'dd/MM')}
              </Text>
            ))}
          </View>
          {employees.map(employee => (
            <View key={employee.id} style={pdfStyles.tableRow}>
              <Text style={pdfStyles.employeeCell}>{employee.name}</Text>
              {days.map((day, i) => {
                const cellTasks = getTasksForCell(employee.id, day);
                return (
                  <View key={i} style={pdfStyles.tableCell}>
                    {cellTasks.map((task: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined, j: Key | null | undefined) => (
                      <Text key={j} style={pdfStyles.taskItem}>
                        • {task}
                      </Text>
                    ))}
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );

  // Affichage principal de l'application
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Gestion de Planning de Projet</title>
        <meta name="description" content="Application de gestion de planning de projet" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Planning Hebdomadaire</h1>
        
        <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => changeWeek(-1)} 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              ← Semaine précédente
            </button>
            
            <div className="text-lg font-medium">
              Semaine du {format(days[0].date, 'dd MMMM', { locale: fr })} au {format(days[4].date, 'dd MMMM yyyy', { locale: fr })}
            </div>
            
            <button 
              onClick={() => changeWeek(1)} 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Semaine suivante →
            </button>
          </div>
          
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <label htmlFor="month-select" className="font-medium">Mois:</label>
              <select 
                id="month-select" 
                value={selectedMonth}
                onChange={handleMonthChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="0">Janvier</option>
                <option value="1">Février</option>
                <option value="2">Mars</option>
                <option value="3">Avril</option>
                <option value="4">Mai</option>
                <option value="5">Juin</option>
                <option value="6">Juillet</option>
                <option value="7">Août</option>
                <option value="8">Septembre</option>
                <option value="9">Octobre</option>
                <option value="10">Novembre</option>
                <option value="11">Décembre</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <label htmlFor="year-select" className="font-medium">Année:</label>
              <select 
                id="year-select" 
                value={selectedYear}
                onChange={handleYearChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <PDFDownloadLink 
              document={<PlanningPDF />} 
              fileName={`planning-${format(days[0].date, 'dd-MM-yyyy')}.pdf`}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              {({ loading }) => (loading ? 'Préparation du PDF...' : 'Exporter en PDF')}
            </PDFDownloadLink>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="grid grid-cols-6 border-b">
            <div className="p-4 font-bold text-gray-700 bg-gray-100">Employés</div>
            {days.map((day, i) => (
              <div key={i} className="p-4 font-bold text-gray-700 bg-gray-100 text-center">
                {day.label} <br/> <span className="text-sm">{day.formattedDate}</span>
              </div>
            ))}
          </div>
          
          {employees.map(employee => (
            <div key={employee.id} className="grid grid-cols-6 border-b">
              <div className="p-4 font-medium bg-gray-50">{employee.name}</div>
              {days.map((day, i) => {
                const cellTasks = getTasksForCell(employee.id, day);
                return (
                  <div 
                    key={i} 
                    className="p-3 min-h-24 border-l cursor-pointer hover:bg-blue-50 transition"
                    onClick={() => handleCellClick(employee.id, day)}
                  >
                    {cellTasks.map((task: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined, j: Key | null | undefined) => (
                      <div key={j} className="mb-1 p-2 bg-blue-100 rounded text-sm">
                        {task}
                      </div>
                    ))}
                    {cellTasks.length < 3 && (
                      <div className="text-blue-500 mt-1 text-xs font-medium text-center">
                        {cellTasks.length > 0 ? 'Ajouter une tâche' : 'Cliquez pour ajouter'}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </main>

      {/* Modal d'ajout de tâche */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              Ajouter une tâche pour {employees.find(e => e.id === modalData.employeeId)?.name}
              <br/>
              <span className="text-sm font-normal text-gray-600">
                {modalData.day.label} {modalData.day.formattedDate}
              </span>
            </h3>
            
            <div className="mb-4">
              <label htmlFor="task" className="block mb-2 font-medium">Sélectionner une tâche</label>
              <select
                id="task"
                value={selectedTask}
                onChange={(e) => setSelectedTask(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>Choisir une tâche</option>
                {predefinedTasks.map((task, index) => (
                  <option key={index} value={task}>{task}</option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowTaskModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Annuler
              </button>
              <button
                onClick={handleAddTask}
                disabled={!selectedTask}
                className={`px-4 py-2 rounded-lg transition ${
                  selectedTask 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}