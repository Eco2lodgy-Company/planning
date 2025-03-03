"use client"
// types/index.ts
export interface User {
    id_user: number;
    nom_complet: string;
    
    email?: string;
    // Ajoutez d'autres champs selon votre structure de données
  }
  
  export interface Log {
    id: number;
    user: number;
    login_time: string;
    logoutTime: string;
    // Ajoutez d'autres champs selon votre structure de données
  }
  
  // pages/connection-history.tsx
  import { useState, useEffect } from 'react';
  
  export default function ConnectionHistory() {
    const [logs, setLogs] = useState<Log[]>([]);
    const [users, setUsers] = useState<Record<number, string>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
  
    useEffect(() => {
      async function fetchData() {
        try {
          // Récupérer les utilisateurs via votre endpoint
          const usersResponse = await fetch('/api/users');
          if (!usersResponse.ok) throw new Error('Erreur lors de la récupération des utilisateurs');
          
          const usersData: User[] = await usersResponse.json();
          
          // Créer un dictionnaire d'utilisateurs
          const usersDict: Record<number, string> = {};
          usersData.forEach(user => {
            usersDict[user.id_user] = `${user.nom_complet}`;
          });
          setUsers(usersDict);
          
          // Récupérer les logs via votre endpoint
          const logsResponse = await fetch('/api/history');
          if (!logsResponse.ok) throw new Error('Erreur lors de la récupération des logs');
          
          const logsData: Log[] = await logsResponse.json();
          setLogs(logsData);
        } catch (error) {
          console.error('Erreur lors du chargement des données:', error);
          setError('Impossible de charger les données. Veuillez réessayer plus tard.');
        } finally {
          setLoading(false);
        }
      }
  
      fetchData();
    }, []);
  
    // Formater la date et l'heure
    const formatDateTime = (dateTime: string): string => {
      if (!dateTime) return 'N/A';
      return new Date(dateTime).toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    };
  
    // Formater l'heure
    const formatTime = (time: string): string => {
      if (!time) return 'N/A';
      return time.substring(0, 8); // Format HH:MM:SS
    };
  
    // Calculer la durée de la session
    const calculateDuration = (loginTime: string, logoutTime: string): string => {
      if (!loginTime || !logoutTime) return 'N/A';
      
      const login = new Date(loginTime);
      
      // Créer une date à partir de l'heure de déconnexion et la date de connexion
      const logout = new Date(login);
      const [hours, minutes, seconds] = logoutTime.split(':');
      logout.setHours(parseInt(hours, 10));
      logout.setMinutes(parseInt(minutes, 10));
      logout.setSeconds(parseInt(seconds, 10));
      
      // Si la déconnexion est avant la connexion, c'est probablement le jour suivant
      if (logout < login) {
        logout.setDate(logout.getDate() + 1);
      }
      
      const diffMs = logout.getTime() - login.getTime();
      const diffHrs = Math.floor(diffMs / 3600000);
      const diffMins = Math.floor((diffMs % 3600000) / 60000);
      
      return `${diffHrs}h ${diffMins}min`;
    };
  
    // Filtrer les logs côté client
    const filteredLogs = logs.filter(log => {
      const userName = users[log.user] || '';
      const loginDate = log.login_time ? new Date(log.login_time) : null;
      
      // Filtre par nom d'utilisateur
      const nameMatch = userName.toLowerCase().includes(filter.toLowerCase());
      
      // Filtre par date si une date est spécifiée
      let dateMatch = true;
      if (dateFilter && loginDate) {
        const filterDate = new Date(dateFilter);
        dateMatch = (
          loginDate.getFullYear() === filterDate.getFullYear() &&
          loginDate.getMonth() === filterDate.getMonth() &&
          loginDate.getDate() === filterDate.getDate()
        );
      }
      
      return nameMatch && dateMatch;
    });
  
    if (loading) return <div className="flex justify-center p-8">Chargement...</div>;
    if (error) return <div className="bg-red-100 p-4 rounded-md">{error}</div>;
  
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Historique des Connexions</h1>
        
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="name-filter" className="block mb-2">Filtrer par nom</label>
            <input
              id="name-filter"
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="Rechercher un employé..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label htmlFor="date-filter" className="block mb-2">Filtrer par date</label>
            <input
              id="date-filter"
              type="date"
              className="w-full p-2 border rounded-md"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </div>
  
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employé</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Connexion</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Déconnexion</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durée</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {users[log.user] || 'Utilisateur inconnu'}
                    </div>
                    <div className="text-sm text-gray-500">ID: {log.user}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDateTime(log.login_time)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatTime(log.logoutTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {calculateDuration(log.login_time, log.logoutTime)}
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    Aucun résultat trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          Total: {filteredLogs.length} enregistrements
        </div>
      </div>
    );
  }