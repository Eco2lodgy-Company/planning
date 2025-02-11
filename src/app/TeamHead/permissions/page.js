'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

// Données d'exemple pour les demandes de permission
const sampleRequests = [
  {
    id: 1,
    nomComplet: 'Jean Dupont',
    motif: 'Congé maladie',
    dateDebut: '2024-02-10',
    dateFin: '2024-02-15',
    statut: 'En attente'
  },
  {
    id: 2,
    nomComplet: 'Marie Martin',
    motif: 'Congé annuel',
    dateDebut: '2024-03-01',
    dateFin: '2024-03-10',
    statut: 'En attente'
  }
];

const statusColors = {
  'En attente': 'bg-yellow-100 text-yellow-800',
  'Approuvée': 'bg-green-100 text-green-800',
  'Refusée': 'bg-red-100 text-red-800'
};

export default function PermissionRequestsPage() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState(sampleRequests);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleAction = (id, newStatus) => {
    setRequests(
      requests.map(req => req.id === id ? { ...req, statut: newStatus } : req)
    );
    toast(`Demande ${newStatus.toLowerCase()} avec succès`);
  };

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
        <h2 className="text-lg font-semibold text-gray-800">Demandes de Permissions</h2>
      </header>

      <motion.main className="flex-1 mt-4 overflow-y-auto">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-black font-medium mb-4">Liste des Demandes</h3>
          <table className="w-full border-collapse text-sm text-gray-800">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="px-4 py-2 text-left">Nom Complet</th>
                <th className="px-4 py-2 text-left">Motif</th>
                <th className="px-4 py-2 text-left">Début</th>
                <th className="px-4 py-2 text-left">Fin</th>
                <th className="px-4 py-2 text-left">Statut</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="border-t">
                  <td className="px-4 py-2">{req.nomComplet}</td>
                  <td className="px-4 py-2">{req.motif}</td>
                  <td className="px-4 py-2">{req.dateDebut}</td>
                  <td className="px-4 py-2">{req.dateFin}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[req.statut]}`}>
                      {req.statut}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      {req.statut === 'En attente' && (
                        <>
                          <button 
                            onClick={() => handleAction(req.id, 'Approuvée')}
                            className="text-green-600 hover:text-green-800"
                            title="Accepter"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button 
                            onClick={() => handleAction(req.id, 'Refusée')}
                            className="text-red-600 hover:text-red-800"
                            title="Refuser"
                          >
                            <XCircle size={18} />
                          </button>
                        </>
                      )}
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
