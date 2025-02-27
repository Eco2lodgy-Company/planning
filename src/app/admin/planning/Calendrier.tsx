"use client";
import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, addDays } from 'date-fns';
import frLocale from 'date-fns/locale/fr'; // Importer la locale française
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Configurer le localisateur avec la locale française
const locales = {
  fr: frLocale,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), // Semaine commence le lundi
  getDay,
  locales,
});

const Calendrier = ({ taches, utilisateurs }) => {
  const [events, setEvents] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [date, setDate] = useState(new Date()); // État pour gérer la date actuelle du calendrier

  useEffect(() => {
    if (selectedUser && Array.isArray(taches)) {
      const filteredTasks = taches.filter(tache => tache.id_user === selectedUser);
      const events = filteredTasks.flatMap(tache => {
        const startDate = new Date(tache.datedebut);
        const endDate = addDays(startDate, tache.echeance);
        const days = [];
        let currentDate = startDate;

        while (currentDate <= endDate) {
          if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) { // Exclure les weekends
            days.push({
              title: tache.libelle,
              start: currentDate,
              end: currentDate,
              allDay: true,
              resource: {
                niveau: tache.niveau,
                joursRestants: Math.ceil((endDate - currentDate) / (1000 * 60 * 60 * 24)),
              },
            });
          }
          currentDate = addDays(currentDate, 1);
        }
        return days;
      });

      setEvents(events);
    }
  }, [selectedUser, taches]);

  const eventStyleGetter = (event) => {
    let backgroundColor;
    switch (event.resource.niveau) {
      case 1:
        backgroundColor = '#90EE90'; // Vert clair pour les tâches faciles
        break;
      case 2:
        backgroundColor = '#FFD700'; // Or pour les tâches moyennes
        break;
      case 3:
        backgroundColor = '#FF6347'; // Rouge pour les tâches difficiles
        break;
      default:
        backgroundColor = '#3174ad'; // Bleu par défaut
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        color: 'black',
        border: 'none',
      },
    };
  };

  // Gestion de la navigation (avancer/reculer)
  const handleNavigate = (newDate) => {
    setDate(newDate); // Mettre à jour la date actuelle du calendrier
  };

  return (
    <div >
      <select onChange={(e) => setSelectedUser(Number(e.target.value))}>
        <option value="">Sélectionner un utilisateur</option>
        {utilisateurs && utilisateurs.map(user => (
          <option key={user.id_user} value={user.id_user}>
            {user.nom_complet}
          </option>
        ))}
      </select>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="week"
        views={['week']}
        date={date} // Utiliser la date actuelle pour le calendrier
        onNavigate={handleNavigate} // Gérer la navigation
        min={new Date(0, 0, 0, 0, 0, 0)} // Début de la journée à minuit
        max={new Date(0, 0, 0, 23, 59, 59)} // Fin de la journée à 23h59
        timeslots={24} // Afficher une seule colonne par jour (pas d'heures)
        step={60} // Pas de division horaire
        showMultiDayTimes // Afficher les événements sur plusieurs jours
        eventPropGetter={eventStyleGetter}
        components={{
          event: ({ event }) => (
            <div>
              <strong>{event.title}</strong>
              <div>Jours restants: {event.resource.joursRestants}</div>
            </div>
          ),
        }}
        messages={{
          today: "Aujourd'hui",
          previous: 'Précédent',
          next: 'Suivant',
          week: 'Semaine',
          day: 'Jour',
          agenda: 'Agenda',
          date: 'Date',
          time: 'Heure',
          event: 'Événement',
          noEventsInRange: 'Aucun événement dans cette plage.',
        }}
      />
    </div>
  );
};

export default Calendrier;