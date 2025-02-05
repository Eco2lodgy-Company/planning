"use client"
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Calendar as CalendarIcon, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Users,
  Clock,
  Calendar as CalendarLucide
} from "lucide-react";

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 8:00 to 19:00

type Task = {
  id: string;
  title: string;
  start: number;
  duration: number;
  assignee: string;
  color: string;
};

const SAMPLE_TASKS: Task[] = [
  {
    id: '1',
    title: 'Réunion équipe',
    start: 9,
    duration: 1,
    assignee: 'Marie L.',
    color: 'bg-blue-500'
  },
  {
    id: '2',
    title: 'Formation React',
    start: 14,
    duration: 2,
    assignee: 'Jean D.',
    color: 'bg-green-500'
  },
  {
    id: '3',
    title: 'Review projet',
    start: 11,
    duration: 1.5,
    assignee: 'Sophie M.',
    color: 'bg-purple-500'
  }
];

export default function Planning() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const getWeekDates = () => {
    const dates = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <CalendarIcon className="text-blue-500" />
            Planning hebdomadaire
          </h1>
          <div className="flex items-center gap-2 bg-white rounded-lg shadow px-3 py-2">
            <button
              onClick={goToPreviousWeek}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-medium">
              {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={goToNextWeek}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition">
          <Plus size={20} />
          Nouvelle tâche
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg shadow overflow-auto">
        {/* Days header */}
        <div className="grid grid-cols-8 border-b">
          <div className="p-4 font-medium text-gray-500 border-r">Heures</div>
          {DAYS.map((day, index) => (
            <div key={day} className="p-4 font-medium text-gray-800 text-center border-r last:border-r-0">
              <div>{day}</div>
              <div className="text-sm text-gray-500">
                {getWeekDates()[index].getDate()}/{getWeekDates()[index].getMonth() + 1}
              </div>
            </div>
          ))}
        </div>

        {/* Time slots */}
        <div className="relative">
          {HOURS.map((hour) => (
            <div key={hour} className="grid grid-cols-8">
              <div className="p-4 border-r text-sm text-gray-500">
                {hour}:00
              </div>
              {DAYS.map((day, dayIndex) => (
                <div
                  key={`${hour}-${day}`}
                  className="p-2 border-r last:border-r-0 border-b min-h-[100px] relative"
                >
                  {SAMPLE_TASKS.filter(task => task.start === hour).map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`absolute left-2 right-2 ${task.color} rounded-lg p-2 cursor-pointer`}
                      style={{
                        height: `${task.duration * 100}px`,
                        top: '0'
                      }}
                      onClick={() => setSelectedTask(task)}
                    >
                      <div className="text-white font-medium text-sm">{task.title}</div>
                      <div className="flex items-center gap-1 text-white/90 text-xs mt-1">
                        <Users size={12} />
                        {task.assignee}
                      </div>
                      <div className="flex items-center gap-1 text-white/90 text-xs">
                        <Clock size={12} />
                        {task.duration}h
                      </div>
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedTask(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">{selectedTask.title}</h3>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CalendarLucide size={20} className="text-gray-500" />
                <span>{selectedTask.start}:00 - {selectedTask.start + selectedTask.duration}:00</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={20} className="text-gray-500" />
                <span>{selectedTask.assignee}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={20} className="text-gray-500" />
                <span>{selectedTask.duration} heures</span>
              </div>
              <div className="flex gap-2 mt-6">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                  Modifier
                </button>
                <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded transition">
                  Supprimer
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}