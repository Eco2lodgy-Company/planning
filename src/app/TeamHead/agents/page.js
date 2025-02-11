'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const statusColors = {
  'Actif': 'bg-green-100 text-green-800',
  'Inactif': 'bg-gray-100 text-gray-800'
};

export default function AgentListPage() {
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState([]);
  const userIdd=localStorage.getItem('userId');

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch('/api/headside/agents/'+userIdd);
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

  // const handleEditAgent = (matricule: string) => {
  //   toast(`Modifier l'agent ${matricule}`);
  // };

  // const handleDeleteAgent = (matricule: string) => {
  //   if (window.confirm('Êtes-vous sûr de vouloir supprimer cet agent ?')) {
  //     setAgents(agents.filter(agent => agent.matricule !== matricule));
  //     toast('Agent supprimé avec succès');
  //   }
  // };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-transparent">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-6">
      <header className="flex items-center justify-between p-4 bg-white shadow rounded-md">
        <h2 className="text-lg font-semibold text-gray-800">Liste des Agents</h2>
      </header>

      <motion.main className="flex-1 mt-4 overflow-y-auto">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-black font-medium mb-4">Liste des Agents</h3>
          <table className="w-full border-collapse text-sm text-gray-800">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="px-4 py-2 text-left">Matricule</th>
                <th className="px-4 py-2 text-left">Nom Complet</th>
                <th className="px-4 py-2 text-left">Poste</th>
                <th className="px-4 py-2 text-left">Département</th>
                <th className="px-4 py-2 text-left">Telephone</th>
                <th className="px-4 py-2 text-left">Statut</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {agents.length > 0 ? (
                agents.map((agent) => (
                  <tr key={agent.matricule} className="border-t">
                    <td className="px-4 py-2">{agent.matricule}</td>
                    <td className="px-4 py-2">{agent.nom_complet}</td>
                    <td className="px-4 py-2">{agent.poste}</td>
                    <td className="px-4 py-2">{agent.departement}</td>
                    <td className="px-4 py-2">{agent.tel}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[agent.status]}`}>
                        {agent.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditAgent(agent.matricule)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Modifier"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteAgent(agent.matricule)}
                          className="text-red-600 hover:text-red-800"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-2 text-center text-gray-500">Aucun agent trouvé</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.main>
    </div>
  );
}
