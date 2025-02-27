'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation'; 
import Link from 'next/link'; 
import { User, Mail, Shield, Settings, Edit, Calendar,Loader2, CircleCheckBig, Save } from 'lucide-react';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProfilePage() {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState([]);
  const [lastLogin, setLastLogin] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmail, setEditedEmail] = useState(user.email);
  const [editedPassword, setEditedPassword] = useState('');
  const [onGoingTasks, setOnGoingTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        router.push("/login");
      }
    }
  }, [router]);

  //convert last login date format from timestamp to date and time
  const dateObj = new Date(lastLogin);
  dateObj.setHours(dateObj.getHours() + 1);
  const loginDate = dateObj.toLocaleDateString(); // "21/02/2025" 
  const loginTime = dateObj.toLocaleTimeString();

  //convert user created date format from timestamp to date and hour
  const dateObj2 = new Date(user.created_at);
  dateObj2.setHours(dateObj2.getHours() + 1);
  const createdDate = dateObj2.toLocaleDateString(); // "21/02/2025"
  const createdTime = dateObj2.toLocaleTimeString();


  useEffect(() => {
    const userIdd = localStorage.getItem('userId');
    const fetchAgents = async () => {
      try {
        const response = await fetch('/api/profile/' + userIdd);
        if (!response.ok) throw new Error('Erreur lors de la récupération des informations');
        const data = await response.json();
        setUser(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();

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
  }, []);

  useEffect(() => {
    const userIdd = localStorage.getItem('userId');
    const lastLogin = async () => {
      try {
        const response = await fetch('/api/logs/' + userIdd);
        if (!response.ok) throw new Error('Erreur lors de la récupération des informations');
        const data = await response.json();
        setLastLogin(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    lastLogin();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    const userIdd = localStorage.getItem('userId');

    try {
      const response = await fetch('/api/profile/update/' + userIdd, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: editedEmail,
          password: editedPassword,
        }),
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour du profil');

      setUser((prevUser) => ({
        ...prevUser,
        email: editedEmail,
      }));

      setIsEditing(false);
      toast.success('Profil mis à jour');
f    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="text-gray-600 font-medium">Chargement des informations du profile...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between p-6 bg-white shadow">
          <h2 className="text-xl font-bold text-gray-800">Profil de l'utilisateur</h2>
        </header>

        {/* Main Section */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex-1 p-6 overflow-y-auto"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-green-800">Informations personnelles</h3>
            <div className="space-y-4">
              {/* <div className="flex items-center">
                <User className="w-5 h-5 mr-2 text-gray-600" />
                {isEditing ? (
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="border rounded p-2"
                  />
                ) : (
                  <span className="text-gray-800">{user.nom_complet}</span>
                )}
              </div> */}
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-2 text-gray-600" />
                {isEditing ? (
                  <input
                    type="email"
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                    className="border rounded p-2"
                  />
                ) : (
                  <span className="text-gray-800">{user.mail}</span>
                )}
              </div>
              {isEditing && (
                <div className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-gray-600" />
                  <input
                    type="password"
                    value={editedPassword}
                    onChange={(e) => setEditedPassword(e.target.value)}
                    className="border rounded p-2"
                    placeholder="Nouveau mot de passe"
                  />
                </div>
              )}
              <div className="flex items-center">
                <User className="w-5 h-5 mr-2 text-gray-600" />
                <span className="text-gray-800">{user.nom_complet}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-gray-600" />
                <span className="text-gray-800">Membre depuis le {createdDate} à {createdTime}</span>
              </div>
              <div className="flex items-center">
                <CircleCheckBig className="w-5 h-5 mr-2 text-gray-600" />
                <span className="text-gray-800">Dernière connexion le {loginDate} à {loginTime}</span>
              </div>
            </div>
            <div className="mt-6">
              {isEditing ? (
                <button
                  onClick={handleSave}
                  className="bg-green-500 text-white p-2 rounded-full flex items-center"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Enregistrer
                </button>
              ) : (
                <button
                  onClick={handleEdit}
                  className="bg-blue-500 text-white p-2 rounded-full flex items-center"
                >
                  <Edit className="w-5 h-5 mr-2" />
                  Modifier
                </button>
              )}
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-800">Statistiques</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-800">Tâches complétées</h4>
                <p className="text-2xl font-bold text-blue-800">{completedTasks}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-green-800">Tâches en cours</h4>
                <p className="text-2xl font-bold text-green-800">{onGoingTasks}</p>
              </div>
            </div>
          </div>
        </motion.main>
      </div>
      <ToastContainer />

    </div>
  );
}