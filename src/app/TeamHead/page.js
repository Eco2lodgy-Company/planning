'use client';
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, CartesianGrid } from 'recharts';

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

export default function TeamLeaderDashboard() {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const [userData, setUserData] = useState([]);
  const [user, setLocalUser] = useState('');
  const [toastShown, setToastShown] = useState(false); // Nouvelle variable pour empêcher le double affichage
  const [countUsers, setCountUsers] = useState([]);
  const [progressProjects, setProgressProjects] = useState([]);
  const [doneProjects, setDoneProjects] = useState([]);
  const [pendingProjects, setPendingProjects] = useState([]);


  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    
    return () => clearTimeout(timer);

  }, []);

  //recuperation des information de l'utilisateur connecté
  useEffect(() => {
    
    const userIdd=localStorage.getItem('userId');
    const connectedUser = async () => {
      try {
        const response = await fetch('/api/profile/' + userIdd);
        if (!response.ok) throw new Error('Erreur lors de la récupération des informations');
        const data = await response.json();
        setUserData(data);
        

        if (!toastShown) {
          toast.success(`bienvenu dans le systeme`);
          toast.success(`Vous êtes connecter en tant que ${data.nom_complet}`);
          setToastShown(true);
        }

      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    connectedUser();


  //appel de l'api pour recuperer le nombre d'agents

  const userCounter = async () => {
    try {
      const response = await fetch('/api/headside/agents/count/' + userIdd);
      if (!response.ok) throw new Error('Erreur lors de la récupération des informations');
      const data = await response.json();
      setCountUsers(data);

    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  userCounter();


  //appel api pour recuperer le nombre de projets en cours

  const inprogressProjects = async () => {
    try {
      const response = await fetch('/api/headside/projets/count/progress/' + userIdd);
      if (!response.ok) throw new Error('Erreur lors de la récupération des informations');
      const data = await response.json();
      setProgressProjects(data);

    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  inprogressProjects();


//appel api pour recuperer les projets terminer

const doneProjects = async () => {
  try {
    const response = await fetch('/api/headside/projets/count/done/' + userIdd);
    if (!response.ok) throw new Error('Erreur lors de la récupération des informations');
    const data = await response.json();
    setDoneProjects(data);

  } catch (error) {
    toast.error(error.message);
  } finally {
    setLoading(false);
  }
};

doneProjects();

//appel api pour recuperer les projets en attente

//appel api pour recuperer les projets terminer

const pendingProjects = async () => {
  try {
    const response = await fetch('/api/headside/projets/count/pending/' + userIdd);
    if (!response.ok) throw new Error('Erreur lors de la récupération des informations');
    const data = await response.json();
    setPendingProjects(data);

  } catch (error) {
    toast.error(error.message);
  } finally {
    setLoading(false);
  }
};

pendingProjects();


  },[toastShown]); 
  




  

  const statusData = [
    { status: 'En attente', total: pendingProjects },
    { status: 'En cours', total: progressProjects },
    { status: 'Terminés', total: doneProjects },
  ];
  const tasks = {
    enCours: 8,
    terminees: 15,
    enRetard: 3,
    total: 26
  };

 
  const currentTasks = [
    { id: 1, title: "Mise à jour du site web", status: "En cours", deadline: "2024-03-20", priority: "Haute" },
    { id: 2, title: "Réunion client", status: "En cours", deadline: "2024-03-18", priority: "Moyenne" },
    { id: 3, title: "Rapport mensuel", status: "En cours", deadline: "2024-03-25", priority: "Haute" },
    { id: 4, title: "Test qualité", status: "En cours", deadline: "2024-03-19", priority: "Basse" },
    { id: 5, title: "Documentation API", status: "En cours", deadline: "2024-03-22", priority: "Moyenne" }
  ];
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
          <h2 className="text-xl font-bold text-gray-800">Bienvenue  {userData.nom_complet}</h2>
          <button className="py-2 px-4 flex items-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <PlusCircle aria-hidden="true" /> Nouvelle tâche
          </button>
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
            {/* Employees Overview */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Employés</p>
                  <h3 className="text-2xl font-bold text-blue-600">{countUsers}</h3>
                </div>
                <Users className="h-10 w-10 text-blue-500" aria-hidden="true" />
              </div>
            </motion.div>

            {/* Projects Overview */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Projets en cours</p>
                  <h3 className="text-2xl font-bold text-green-600">{progressProjects}</h3>
                </div>
                <ClipboardMinus className="h-10 w-10 text-green-500" aria-hidden="true" />
              </div>
            </motion.div>

            {/* Tasks Overview */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Projets terminés</p>
                  <h3 className="text-2xl font-bold text-purple-600">{doneProjects}</h3>
                </div>
                <ListTodo className="h-10 w-10 text-purple-500" aria-hidden="true" />
              </div>
            </motion.div>

            {/* Tasks in Delay */}
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
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Diagramme en barres pour les totaux par statut */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-white p-6 rounded-lg shadow-lg"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BarChart3 className="text-blue-500" aria-hidden="true" /> Projets par statut
        </h3>
        <BarChart
          width={500}
          height={300}
          data={statusData}
          margin={{ top: 25, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" /> {/* Axe des X basé sur le statut */}
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#3b82f6" /> {/* Barre pour le total */}
        </BarChart>
      </motion.div>

               {/* Diagramme en courbes pour les totaux par statut */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-white p-6 rounded-lg shadow-lg"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BarChart3 className="text-blue-500" aria-hidden="true" /> Performance par statut
        </h3>
        <LineChart
          width={500}
          height={300}
          data={statusData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" /> {/* Axe des X basé sur le statut */}
          <YAxis />
          <Tooltip />
          <Legend />
          {/* Ligne pour les totaux */}
          <Line
            type="monotone"
            dataKey="total"
            stroke="#3b82f6" // Couleur bleue
            activeDot={{ r: 8 }}
          />
        </LineChart>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priorité</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentTasks.map((task) => (
                    <tr key={task.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {task.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.deadline}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          task.priority === "Haute" ? "bg-red-100 text-red-800" :
                          task.priority === "Moyenne" ? "bg-yellow-100 text-yellow-800" :
                          "bg-green-100 text-green-800"
                        }`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-red-600 hover:text-red-900 mr-4">
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </td>
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