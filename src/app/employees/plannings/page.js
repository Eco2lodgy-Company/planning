'use client';
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Home,
  Calendar,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  List,
  Grid
} from "lucide-react";
import frLocale from '@fullcalendar/core/locales/fr';

export default function PlanningPage() {
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('dayGridMonth');
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Réunion équipe',
      start: '2024-03-18T10:00:00',
      end: '2024-03-18T12:00:00',
      color: '#3B82F6'
    },
    {
      id: 2,
      title: 'Formation sécurité',
      start: '2024-03-20T14:00:00',
      end: '2024-03-20T17:00:00',
      color: '#10B981'
    },
    {
      id: 3,
      title: 'Maintenance système',
      start: '2024-03-22T09:00:00',
      end: '2024-03-22T12:30:00',
      color: '#EF4444'
    }
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleDateClick = (arg) => {
    alert('Date cliquée: ' + arg.dateStr);
  };

  const handleEventClick = (clickInfo) => {
    alert(`Événement: ${clickInfo.event.title}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -200 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 60 }}
        className="w-72 bg-gray-900 text-white shadow-lg p-6 flex flex-col"
      >
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="text-blue-500" /> Planning
        </h1>
        <nav className="mt-8 space-y-4">
          {["Tableau de bord", "Plannings", "Utilisateurs", "Paramètres"].map((item, index) => (
            <a
              key={item}
              href="#"
              className="flex items-center gap-3 py-3 px-4 rounded-lg transition bg-gray-800 hover:bg-blue-600"
            >
              {[<Home />, <Calendar />, <Users />, <Settings />][index]} {item}
            </a>
          ))}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between p-6 bg-white shadow">
          <h2 className="text-xl font-bold text-gray-800">Calendrier des interventions</h2>
          <div className="flex gap-2">
            <button 
              className="py-2 px-4 flex items-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              onClick={() => setCurrentView('dayGridMonth')}
            >
              <Grid size={18} /> Mois
            </button>
            <button 
              className="py-2 px-4 flex items-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              onClick={() => setCurrentView('dayGridWeek')}
            >
              <List size={18} /> Semaine
            </button>
          </div>
        </header>

        {/* Main Section */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex-1 p-6 overflow-y-auto"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView={currentView}
              events={events}
              locale={frLocale}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,dayGridWeek,dayGridDay'
              }}
              dateClick={handleDateClick}
              eventClick={handleEventClick}
              height="70vh"
              buttonText={{
                today: "Aujourd'hui",
                month: 'Mois',
                week: 'Semaine',
                day: 'Jour'
              }}
              customButtons={{
                prev: { text: <ChevronLeft /> },
                next: { text: <ChevronRight /> }
              }}
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              }}
            />
          </div>

          {/* Légende */}
          <div className="mt-6 p-4 bg-white rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-3">Légende du planning :</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span>Réunions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Formations</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>Maintenance</span>
              </div>
            </div>
          </div>
        </motion.main>
      </div>
    </div>
  );
}