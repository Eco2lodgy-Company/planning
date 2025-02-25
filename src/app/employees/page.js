'use client';
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ResponsiveContainer } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, CartesianGrid } from 'recharts';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import {
  Home,
  Calendar,
  CircleCheckBig,    
  Users,
  ClipboardMinus,
  Settings,
  PlusCircle,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  Shield,
  PieChart,
  ListTodo
} from "lucide-react";

export default function EmployeeDashboard() {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const [onGoingTasks, setOnGoingTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [totalTasks, setTotalTasks] = useState([]);
  const [PendingTasks, setPendingTasks]= useState([]);
  const [taskList, setTaskList]= useState([]);


  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const tasks = {
    enCours: onGoingTasks,
    terminees: completedTasks,
    enRetard: overdueTasks,
    total: totalTasks
  };

  const statusData = [
    { status: 'Retard', total: overdueTasks },
    { status: 'En cours', total: onGoingTasks },
    { status: 'Terminés', total: completedTasks },
    { status: 'En attente', total: PendingTasks },
  ];

  //appel de toutes les apis qui vont contribuer à l'affichage des donnees dynamique de la page

  useEffect(() => {
    const userIdd=localStorage.getItem('userId');
    const fetchProgressTask = async () => {
      try {
        const response = await fetch('/api/userSide/tasks/progress/' + userIdd);
        if (!response.ok) throw new Error('Erreur lors de la récupération des informations');
        const data = await response.json();
        setOnGoingTasks(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressTask();


    //appel api pour recuperer les taches terminer

    const fetchDoneTasks = async () => {
      try {
        const response = await fetch('/api/userSide/tasks/done/' + userIdd);
        if (!response.ok) throw new Error('Erreur lors de la récupération des informations');
        const data = await response.json();
        setCompletedTasks(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoneTasks();


    //appel api recuperer le nombre de taches en retard

    const fetchLateTasks = async () => {
      try {
        const response = await fetch('/api/userSide/tasks/late/' + userIdd);
        if (!response.ok) throw new Error('Erreur lors de la récupération des informations');
        const data = await response.json();
        setOverdueTasks(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLateTasks();


    //appel api pour recuperer le total des taches

    const fetchTotalTasks = async () => {
      try {
        const response = await fetch('/api/userSide/tasks/list/' + userIdd);
        if (!response.ok) throw new Error('Erreur lors de la récupération des informations');
        const data = await response.json();
        setTotalTasks(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalTasks();


    //appel api pour recuperele nombre de taches en cours

    const fetchPendingTasks = async () => {
      try {
        const response = await fetch('/api/userSide/tasks/pending/' + userIdd);
        if (!response.ok) throw new Error('Erreur lors de la récupération des informations');
        const data = await response.json();
        setPendingTasks(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingTasks();

    //appel api pour recupererla liste taches

    const fetchTaskList = async () => {
      try {
        const response = await fetch('/api/userSide/tasks/tasks/' + userIdd);
        if (!response.ok) throw new Error('Erreur lors de la récupération des informations');
        const data = await response.json();
        setTaskList(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskList();
  }, []);


 

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
          <h2 className="text-xl font-bold text-gray-800">Vue d'ensemble des tâches</h2>
          
        </header>

        {/* Main Section */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex-1 p-6 overflow-y-auto"
        >
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tâches en cours</p>
                  <h3 className="text-2xl font-bold text-blue-600">{tasks.enCours}</h3>
                </div>
                <Clock className="h-10 w-10 text-blue-500" aria-hidden="true" />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tâches terminées</p>
                  <h3 className="text-2xl font-bold text-green-600">{tasks.terminees}</h3>
                </div>
                <CheckCircle className="h-10 w-10 text-green-500" aria-hidden="true" />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tâches en retard</p>
                  <h3 className="text-2xl font-bold text-red-600">{tasks.enRetard}</h3>
                </div>
                <AlertCircle className="h-10 w-10 text-red-500" aria-hidden="true" />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total des tâches</p>
                  <h3 className="text-2xl font-bold text-purple-600">{tasks.total}</h3>
                </div>
                <ListTodo className="h-10 w-10 text-purple-500" aria-hidden="true" />
              </div>
            </motion.div>
          </div>

          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
               {/* Diagramme en barres pour les totaux par statut */}
               
<motion.div
  whileHover={{ scale: 1.01 }}
  className="bg-white p-6 rounded-lg shadow-lg"
>
  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
    <BarChart3 className="h-6 w-6 text-blue-500" />
    Statut des tâches
  </h3>
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={statusData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="status" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="total" fill="#4caf50" />
    </BarChart>
  </ResponsiveContainer>
</motion.div>
                        {/* Diagramme en courbes pour les totaux par statut */}
                        <motion.div
  whileHover={{ scale: 1.01 }}
  className="bg-white p-6 rounded-lg shadow-lg"
>
  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
    <PieChart className="h-6 w-6 text-blue-500" />
    Évolution des tâches
  </h3>
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={statusData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="status" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="total" stroke="#4caf50" />
    </LineChart>
  </ResponsiveContainer>
</motion.div>

                   </div>

          {/* Current Tasks */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4">Tâches en cours</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tâche</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date limite</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Echéance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priorité</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {taskList.map((task) => (
                    <tr key={task.id_tache}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.libelle}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {task.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.datedebut} </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.echeance}  jours</td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          task.priorite === "Haute" ? "bg-red-100 text-red-800" :
                          task.priorite === "Moyenne" ? "bg-yellow-100 text-yellow-800" :
                          "bg-green-100 text-green-800"
                        }`}>
                          {task.priorite}
                        </span>
                      </td>

                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-red-600 hover:text-red-900 mr-4">
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.main>
      </div>
      <ToastContainer />

    </div>
  );
}