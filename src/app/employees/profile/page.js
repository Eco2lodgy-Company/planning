'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation'; 
import Link from 'next/link'; 
import { User, Mail, Shield, Settings, Edit, Calendar, CircleCheckBig, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState([]);
  const [userId, setUserId] = useState('');
  const [lastLogin, setLastLogin] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user.name);
  const [editedEmail, setEditedEmail] = useState(user.email);
  const [editedPassword, setEditedPassword] = useState('');
  const [onGoingTasks, setOnGoingTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

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
    } catch (error) {
      toast.error(error.message);
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
            <h3 className="text-lg font-semibold mb-4">Informations personnelles</h3>
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
                <Shield className="w-5 h-5 mr-2 text-gray-600" />
                <span className="text-gray-800">{user.role}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-gray-600" />
                <span className="text-gray-800">Membre depuis le {user.created_at}</span>
              </div>
              <div className="flex items-center">
                <CircleCheckBig className="w-5 h-5 mr-2 text-gray-600" />
                <span className="text-gray-800">Dernière connexion le {lastLogin}</span>
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
            <h3 className="text-lg font-semibold mb-4">Statistiques</h3>
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
    </div>
  );
}