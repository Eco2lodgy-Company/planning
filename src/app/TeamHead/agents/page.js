'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

// Données d'exemple pour les agents
const sampleAgents = [
  {
    matricule: 'A001',
    nomComplet: 'Jean Dupont',
    poste: 'Développeur',
    departement: 'Informatique',
    dateEmbauche: '2022-01-15',
    status: 'Actif'
  },
  {
    matricule: 'A002',
    nomComplet: 'Marie Martin',
    poste: 'Chef de projet',
    departement: 'Marketing',
    dateEmbauche: '2021-07-20',
    status: 'Inactif'
  },
  {
    matricule: 'A003',
    nomComplet: 'Pierre Bernard',
    poste: 'Analyste',
    departement: 'Ressources Humaines',
    dateEmbauche: '2020-03-05',
    status: 'Actif'
  }
];

const statusColors = {
  'Actif': 'bg-green-100 text-green-800',
  'Inactif': 'bg-gray-100 text-gray-800'
};

export default function AgentListPage() {
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState(sampleAgents);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleEditAgent = (matricule) => {
    // Logic to edit agent details (to be implemented)
    toast(`Modifier l'agent ${matricule}`);
  };

  const handleDeleteAgent = (matricule) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet agent ?')) {
      setAgents(agents.filter(agent => agent.matricule !== matricule));
      toast('Agent supprimé avec succès');
    }
  };

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
                <th className="px-4 py-2 text-left">Date d'Embauche</th>
                <th className="px-4 py-2 text-left">Statut</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent.matricule} className="border-t">
                  <td className="px-4 py-2">{agent.matricule}</td>
                  <td className="px-4 py-2">{agent.nomComplet}</td>
                  <td className="px-4 py-2">{agent.poste}</td>
                  <td className="px-4 py-2">{agent.departement}</td>
                  <td className="px-4 py-2">{agent.dateEmbauche}</td>
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
              ))}
            </tbody>
          </table>
        </div>
      </motion.main>
    </div>
  );
}
