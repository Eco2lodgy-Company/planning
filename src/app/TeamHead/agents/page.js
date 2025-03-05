'use client';
import { useState, useEffect } from 'react';
import { supabase } from "@/lib/SupabaseClient";
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, Search, ChevronDown } from 'lucide-react';
import { toast } from 'sonner' ;

const statusColors = {
  'Actif': 'bg-green-100 text-green-800',
  'Inactif': 'bg-gray-100 text-red-800'
};
 
export default function AgentListPage() {
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

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
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  const handleEditAgent = (matricule) => {
    toast(`Modifier l'agent ${matricule}`);
  };

  const handleDeleteAgent = async (matricule) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet agent ?')) return;
  
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('matricule', matricule);
  
      if (error) {
        console.error('Erreur lors de la suppression:', error);
        toast.error('Erreur lors de la suppression de l’agent.');
        return;
      }
  
      // Met à jour l'état local en supprimant l'agent de la liste
      setAgents((prevAgents) => prevAgents.filter(agent => agent.matricule !== matricule));
      toast.success('Agent supprimé avec succès !');
      
    } catch (err) {
      console.error('Erreur inattendue:', err);
      toast.error('Une erreur inattendue est survenue.');
    }
  };
  // Filtrage des agents
  const filteredAgents = agents.filter((agent) => {
    const agentName = agent.nom_complet ? agent.nom_complet.toLowerCase() : '';
    const matchesSearch = agentName.includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || agent.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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
          <p className="text-gray-600 font-medium">Chargement des agents...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between p-6 bg-white shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Liste des Agents</h2>
            <p className="text-gray-500 mt-1">Gérez vos agents efficacement</p>
          </div>
        </header>

        {/* Filtres et recherche */}
        <div className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher par nom..."
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
                <option value="Actif">Actif</option>
                <option value="Inactif">Inactif</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          {/* Liste des agents */}
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matricule</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom Complet</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poste</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Département</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAgents.map((agent) => (
                    <motion.tr
                      key={agent.matricule}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{agent.matricule}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.nom_complet}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.poste}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.departement}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.tel}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[agent.status]}`}>
                          {agent.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditAgent(agent.matricule)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteAgent(agent.matricule)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {filteredAgents.length === 0 && (
                <div className="text-center py-12">
                  <Search className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun agent trouvé</h3>
                  <p className="mt-1 text-sm text-gray-500">Essayez d'ajuster votre recherche ou vos filtres.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}