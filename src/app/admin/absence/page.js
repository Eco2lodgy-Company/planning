"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, X, Loader2, Search, ChevronDown } from 'lucide-react';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AbsenceListPage() {
  const [loading, setLoading] = useState(true);
  const [absences, setAbsences] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newAbsence, setNewAbsence] = useState({ employe: '', date: '', raison: '' });
  const [agents, setAgents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const userIdd = localStorage.getItem('userId');

    const fetchAgents = async () => {
      try {
        const response = await fetch('/api/headside/agents/' + userIdd);
        if (!response.ok) throw new Error('Erreur lors de la récupération des agents');
        const data = await response.json();
        setAgents(data);
      } catch (error) {
        toast.error(error.message);
      }
    };

    const fetchAbsence = async () => {
      try {
        const response = await fetch('/api/headside/absences/' + userIdd);
        if (!response.ok) throw new Error('Erreur lors de la récupération des absences');
        const data = await response.json();
        console.log('Données des absences:', data); // Log pour vérifier les données
        setAbsences(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
    fetchAbsence();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAbsence({ ...newAbsence, [name]: value });
  };

  const handleAddAbsence = () => {
    if (!newAbsence.employe || !newAbsence.date || !newAbsence.raison) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    setSubmitting(true);

    fetch('/api/headside/absences/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newAbsence),
    })
      .then(response => response.json())
      .then(data => {
        setAbsences([...absences, data]);
        toast.success('Absence ajoutée avec succès');
        setShowModal(false);
        setNewAbsence({ employe: '', date: '', raison: '' });
      })
      .catch(error => {
        toast.error('Erreur lors de l\'ajout de l\'absence');
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const filteredAbsences = absences
  .filter((absence) => {
    // Vérifier que `absence` est un objet valide
    if (!absence) return false;

    const employeeName = absence.nom_complet ? absence.nom_complet.toLowerCase() : '';
    const matchesSearch = employeeName.includes(searchTerm.toLowerCase());
    const matchesDate = filterDate === '' || absence.date_absence === filterDate;
    return matchesSearch && matchesDate;
  })
  .filter((absence) => absence && absence.nom_complet && absence.date_absence && absence.motif); // Filtrer les absences incomplètes
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 font-medium">Chargement des absences...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <ToastContainer position="top-right" />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between p-6 bg-white shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Gestion des Absences</h2>
            <p className="text-gray-500 mt-1">Suivez et gérez les absences de vos employés</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            Ajouter une absence
          </motion.button>
        </header>

        {/* Filtres et recherche */}
        <div className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher par employé..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Liste des absences */}
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employé</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Raison</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAbsences.map((absence) => (
                    <motion.tr
                      key={absence.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {absence.nom_complet || 'Non spécifié'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {absence.date_absence || 'Non spécifié'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {absence.motif || 'Non spécifié'}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {filteredAbsences.length === 0 && (
                <div className="text-center py-12">
                  <Search className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune absence trouvée</h3>
                  <p className="mt-1 text-sm text-gray-500">Essayez d'ajuster votre recherche ou vos filtres.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modal pour ajouter une absence */}
      <AnimatePresence>
        {showModal && (
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
                <h3 className="text-lg font-semibold">Nouvelle Absence</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <select
                  name="employe"
                  value={newAbsence.employe}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionner un employé</option>
                  {agents.map((emp) => (
                    <option key={emp.id_user} value={emp.id_user}>{emp.nom_complet}</option>
                  ))}
                </select>
                <input
                  type="date"
                  name="date"
                  value={newAbsence.date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="text"
                  name="raison"
                  value={newAbsence.raison}
                  onChange={handleInputChange}
                  placeholder="Raison de l'absence"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleAddAbsence}
                  disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors"
                >
                  {submitting ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Ajouter'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}