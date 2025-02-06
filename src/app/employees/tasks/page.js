'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation'; // ✅ Next.js
import Link from 'next/link'; // ✅ Next.js
import {
  Home,
  Calendar,
  CircleCheckBig,
  Users,
  Settings,
  List,
  Grid,
  Shield,
  ClipboardMinus,
  CheckCircle,
  Trash,
} from 'lucide-react';
import { toast } from 'sonner';

export default function TaskPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([
    {
      id: '1',
      title: 'Réunion équipe',
      description: 'Discussion sur les objectifs de l\'équipe.',
      dueDate: '2024-03-18',
      status: 'En cours',
    },
    {
      id: '2',
      title: 'Formation sécurité',
      description: 'Formation sur les bonnes pratiques en sécurité.',
      dueDate: '2024-03-20',
      status: 'À faire',
    },
    {
      id: '3',
      title: 'Maintenance système',
      description: 'Maintenance préventive des systèmes informatiques.',
      dueDate: '2024-03-22',
      status: 'Complété',
    },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleMarkComplete = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: 'Complété' } : task
      )
    );
    toast('Tâche marquée comme complétée');
  };

  const handleDeleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    toast('Tâche supprimée');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'À faire':
        return 'bg-blue-500 text-white';
      case 'En cours':
        return 'bg-yellow-500 text-white';
      case 'Complété':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-transparent">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
}

  return (
    <div className="flex h-screen bg-gray-100">
     

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between p-6 bg-white shadow">
          <h2 className="text-xl font-bold text-gray-800">Tâches des employés</h2>
        </header>

        {/* Main Section */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex-1 p-6 overflow-y-auto"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Liste des tâches</h3>
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b">Tâche</th>
                  <th className="px-4 py-2 border-b">Description</th>
                  <th className="px-4 py-2 border-b">Date limite</th>
                  <th className="px-4 py-2 border-b">Statut</th>
                  <th className="px-4 py-2 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id} className="text-sm">
                    <td className="px-4 py-2 border-b text-gray-800">{task.title}</td>
                    <td className="px-4 py-2 border-b text-gray-600">{task.description}</td>
                    <td className="px-4 py-2 border-b text-gray-600">{task.dueDate}</td>
                    <td className="px-4 py-2 border-b">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          task.status
                        )}`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b">
                      <button
                        onClick={() => handleMarkComplete(task.id)}
                        className="bg-blue-500 text-white p-2 rounded-full mr-2"
                      >
                        <CheckCircle />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="bg-red-500 text-white p-2 rounded-full"
                      >
                        <Trash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.main>
      </div>
    </div>
  );
}
