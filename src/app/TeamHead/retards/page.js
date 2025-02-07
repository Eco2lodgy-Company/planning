'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

// Données d'exemple pour les retards
const sampleDelays = [
  {
    id: 1,
    matricule: 'A001',
    nomComplet: 'Jean Dupont',
    date: '2024-02-01',
    motif: 'Embouteillage',
  },
  {
    id: 2,
    matricule: 'A002',
    nomComplet: 'Marie Martin',
    date: '2024-02-05',
    motif: 'Panne de voiture',
  }
];

export default function RetardListPage() {
  const [loading, setLoading] = useState(true);
  const [delays, setDelays] = useState(sampleDelays);
  const [showModal, setShowModal] = useState(false);
  const [newDelay, setNewDelay] = useState({ matricule: '', nomComplet: '', date: '', motif: '' });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleAddDelay = () => {
    if (!newDelay.matricule || !newDelay.nomComplet || !newDelay.date || !newDelay.motif) {
      toast.error('Veuillez remplir tous les champs.');
      return;
    }
    setDelays([...delays, { ...newDelay, id: delays.length + 1 }]);
    toast.success('Retard ajouté avec succès');
    setShowModal(false);
    setNewDelay({ matricule: '', nomComplet: '', date: '', motif: '' });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-6">
      <header className="flex items-center justify-between p-4 bg-white shadow rounded-md">
        <h2 className="text-lg font-semibold text-gray-800">Liste des Retards</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <PlusCircle size={18} /> Ajouter un Retard
        </button>
      </header>

      <motion.main className="flex-1 mt-4 overflow-y-auto">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-black font-medium mb-4">Liste des Retards</h3>
          <table className="w-full border-collapse text-sm text-gray-800">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="px-4 py-2 text-left">Matricule</th>
                <th className="px-4 py-2 text-left">Nom Complet</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Motif</th>
              </tr>
            </thead>
            <tbody>
              {delays.map((delay) => (
                <tr key={delay.id} className="border-t">
                  <td className="px-4 py-2">{delay.matricule}</td>
                  <td className="px-4 py-2">{delay.nomComplet}</td>
                  <td className="px-4 py-2">{delay.date}</td>
                  <td className="px-4 py-2">{delay.motif}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.main>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Ajouter un Retard</h3>
            <input type="text" placeholder="Matricule" className="w-full p-2 mb-2 border rounded" 
              value={newDelay.matricule} 
              onChange={(e) => setNewDelay({ ...newDelay, matricule: e.target.value })}
            />
            <input type="text" placeholder="Nom Complet" className="w-full p-2 mb-2 border rounded" 
              value={newDelay.nomComplet} 
              onChange={(e) => setNewDelay({ ...newDelay, nomComplet: e.target.value })}
            />
            <input type="date" className="w-full p-2 mb-2 border rounded" 
              value={newDelay.date} 
              onChange={(e) => setNewDelay({ ...newDelay, date: e.target.value })}
            />
            <input type="text" placeholder="Motif" className="w-full p-2 mb-2 border rounded" 
              value={newDelay.motif} 
              onChange={(e) => setNewDelay({ ...newDelay, motif: e.target.value })}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-400 text-white rounded-md">Annuler</button>
              <button onClick={handleAddDelay} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Ajouter</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
