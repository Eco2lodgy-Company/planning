"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'sonner';
import { Plus, Calendar, Clock, FileText, X, Loader2, Filter, Search, ChevronDown } from 'lucide-react';
import { format, differenceInDays, isAfter, isBefore, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function PermissionPage() {
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [newPermission, setNewPermission] = useState({
    motif: '',
    datedebut: '',
    datefin: '',
    type: 'Congé annuel',
    id_user: ''
  });

  const permissionTypes = [
    'Congé annuel',
    'Congé maladie',
    'Congé sans solde',
    'Permission exceptionnelle',
  ];

  useEffect(() => {
    const user = localStorage.getItem("userId");
    console.log("UserId from localStorage:", user);
    if (user) {
      setNewPermission((prevData) => ({
        ...prevData,
        id_user: user,
      }));
    }
  }, []);
  

  useEffect(() => {
    const timer = setTimeout(() => {
      // Ajouter des données d'exemple

      const fetchLeaves = async () => {
        const userId = localStorage.getItem("userId");
            try {
              const response = await fetch('/api/employees/permissions/' + userId);
              if (!response.ok) throw new Error('Erreur lors de la récupération des informations');
              const data = await response.json();
              setPermissions(data);
            } catch (error) {
              toast.error(error.message);
            } finally {
              setLoading(false);
            }
          };
      
          fetchLeaves();
      
     
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const fetchLeaves = async () => {
    const userId = localStorage.getItem("userId");
    try {
      const response = await fetch('/api/employees/permissions/' + userId);
      if (!response.ok) throw new Error('Erreur lors de la récupération des informations');
      const data = await response.json();
      setPermissions(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  





  const filteredPermissions = permissions.filter(permission => {
    const matchesSearch = permission.motif.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permission.type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || permission.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleRequestPermission = () => {
    setIsPopupOpen(true);
  };

  const validateDates = (debut, fin) => {
    const startDate = parseISO(debut);
    const endDate = parseISO(fin);
    
    if (isAfter(startDate, endDate)) {
      toast.error('La date de fin doit être postérieure à la date de début');
      return false;
    }
    
    if (isBefore(startDate, new Date())) {
      toast.error('La date de début ne peut pas être dans le passé');
      return false;
    }
    
    return true;
  };

  const handleSubmitPermission = async () => {
    if (!newPermission.motif || !newPermission.datedebut || !newPermission.datefin || !newPermission.type) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
  
    if (!validateDates(newPermission.datedebut, newPermission.datefin)) {
      return;
    }
  
    const duration = differenceInDays(
      parseISO(newPermission.datefin),
      parseISO(newPermission.datedebut)
    ) + 1;
  
    try {
      const response = await fetch('/api/employees/permissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPermission),
      });
  
      if (!response.ok) {
        throw new Error('Erreur lors de la soumission de la permission');
      }
  
      const data = await response.json();
  
      // setPermissions(prev => [
      //   ...prev,
      //   {
      //     id: data.id_user, // Utilise l'ID retourné par l'API
      //     ...newPermission,
      //     status: 'En attente',
      //   },
      // ]);
  
      setIsPopupOpen(false);
      setNewPermission({ motif: '', datedebut: '', datefin: '', type: 'Congé annuel', id_user: '' });
      toast.success(`Permission demandée pour ${duration} jour${duration > 1 ? 's' : ''}`);
      fetchLeaves();
    } catch (error) {
      toast.error('Erreur lors de la soumission de la permission');
      console.error(error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'En attente':
        return 'bg-yellow-500 text-white';
      case 'Accordé':
        return 'bg-green-500 text-white';
      case 'Refusé':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
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
          <p className="text-gray-600 font-medium">Chargement des permissions...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between p-6 bg-white shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Gestion des Permissions</h2>
            <p className="text-gray-500 mt-1">Gérez vos demandes de congés et permissions</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRequestPermission}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nouvelle demande
          </motion.button>
        </header>

        <div className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher par motif ou type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="En attente">En attente</option>
                <option value="Accordé">Accordé</option>
                <option value="Refusé">Refusé</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motif</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Période</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durée</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPermissions.map((permission) => {
                    const duration = differenceInDays(
                      parseISO(permission.datefin),
                      parseISO(permission.datedebut)
                    ) + 1;
                    
                    return (
                      <motion.tr
                        key={permission.id_user}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {permission.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {permission.motif}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(parseISO(permission.datedebut), 'dd MMM yyyy', { locale: fr })} - {format(parseISO(permission.datefin), 'dd MMM yyyy', { locale: fr })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {duration} jour{duration > 1 ? 's' : ''}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(permission.status)}`}>
                            {permission.status}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
              
              {filteredPermissions.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune permission trouvée</h3>
                  <p className="mt-1 text-sm text-gray-500">Essayez d'ajuster votre recherche ou vos filtres.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isPopupOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Nouvelle demande de permission</h3>
                <button onClick={() => setIsPopupOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type de permission</label>
                  <select
                    value={newPermission.type}
                    onChange={(e) => setNewPermission({ ...newPermission, type: e.target.value })}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    {permissionTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Motif</label>
                  <input
                    type="text"
                    value={newPermission.motif}
                    onChange={(e) => setNewPermission({ ...newPermission, motif: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date de début</label>
                  <input
                    type="date"
                    value={newPermission.datedebut}
                    onChange={(e) => setNewPermission({ ...newPermission, datedebut: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date de fin</label>
                  <input
                    type="date"
                    value={newPermission.datefin}
                    onChange={(e) => setNewPermission({ ...newPermission, datefin: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <button
                  onClick={handleSubmitPermission}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors"
                >
                  Soumettre
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}