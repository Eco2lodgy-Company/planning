'use client';
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from '@fullcalendar/timegrid';
import { useRouter, usePathname } from "next/navigation"; // ✅ Next.js
import Link from "next/link"; // ✅ Next.js
import {
  Home,
  Calendar,
  CircleCheckBig,
  Users,
  Settings,
  List,
  Grid,
  Shield
} from "lucide-react";
import frLocale from '@fullcalendar/core/locales/fr';
import { toast } from "sonner";

export default function PlanningPage() {
  const router = useRouter();
  const pathname = usePathname(); // ✅ Remplace useLocation()
  
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('dayGridMonth');
  const [events, setEvents] = useState([
    {
      id: '1',
      title: 'Réunion équipe',
      start: '2024-03-18T10:00:00',
      end: '2024-03-18T12:00:00',
      color: '#3B82F6'
    },
    {
      id: '2',
      title: 'Formation sécurité',
      start: '2024-03-20T14:00:00',
      end: '2024-03-20T17:00:00',
      color: '#10B981'
    },
    {
      id: '3',
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
    toast("Date sélectionnée", { description: arg.dateStr });
  };
  
  const handleEventClick = (clickInfo) => {
    toast("Détails de l'événement", {
      description: `${clickInfo.event.title} - ${new Date(clickInfo.event.start).toLocaleTimeString('fr-FR')} à ${new Date(clickInfo.event.end).toLocaleTimeString('fr-FR')}`
    });
  };

  const navigationItems = [
    { name: "Dashboard", icon: Home, path: "/dashboard" },
    { name: "Plannings", icon: Calendar, path: "/" },
    { name: "Tâches", icon: CircleCheckBig, path: "/tasks" },
    { name: "Utilisateurs", icon: Users, path: "/users" },
    { name: "Permissions", icon: Shield, path: "/permissions" },
    { name: "Paramètres", icon: Settings, path: "/settings" },
  ];

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
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.path} // ✅ Next.js
              className={`flex items-center gap-3 py-3 px-4 rounded-lg transition ${
                pathname === item.path ? "bg-blue-600" : "bg-gray-800 hover:bg-blue-600"
              }`}
            >
              <item.icon aria-hidden="true" /> {item.name}
            </Link>
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
              className={`py-2 px-4 flex items-center gap-2 text-white rounded-lg transition ${
                currentView === 'dayGridMonth' ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
              onClick={() => setCurrentView('dayGridMonth')}
            >
              <Grid size={18} /> Mois
            </button>
            <button 
              className={`py-2 px-4 flex items-center gap-2 text-white rounded-lg transition ${
                currentView === 'timeGridWeek' ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
              onClick={() => setCurrentView('timeGridWeek')}
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
              plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
              initialView={currentView}
              events={events}
              locale={frLocale}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
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
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              }}
              selectable={true}
              editable={true}
              droppable={true}
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
