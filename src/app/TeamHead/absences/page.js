'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

const sampleAbsences = [
  {
    id: 1,
    matricule: 'A001',
    nomComplet: 'Jean Dupont',
    dateDebut: '2024-02-01',
    dateFin: '2024-02-03',
    raison: 'Congé maladie'
  },
  {
    id: 2,
    matricule: 'A002',
    nomComplet: 'Marie Martin',
    dateDebut: '2024-01-15',
    dateFin: '2024-01-20',
    raison: 'Vacances'
  }
];

export default function AbsenceListPage() {
  const [loading, setLoading] = useState(true);
  const [absences, setAbsences] = useState(sampleAbsences);
  const [showModal, setShowModal] = useState(false);
  const [newAbsence, setNewAbsence] = useState({ matricule: '', nomComplet: '', dateDebut: '', dateFin: '', raison: '' });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleAddAbsence = () => {
    if (!newAbsence.matricule || !newAbsence.nomComplet || !newAbsence.dateDebut || !newAbsence.dateFin || !newAbsence.raison) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    setAbsences([...absences, { id: absences.length + 1, ...newAbsence }]);
    toast.success('Absence ajoutée avec succès');
    setShowModal(false);
    setNewAbsence({ matricule: '', nomComplet: '', dateDebut: '', dateFin: '', raison: '' });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-6">
      <header className="flex items-center justify-between p-4 bg-white shadow rounded-md">
        <h2 className="text-lg font-semibold text-gray-800">Gestion des Absences</h2>
        <button 
  onClick={() => setShowModal(true)} 
  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition"
>
  <PlusCircle size={20} /> Ajouter une absence
</button>

      </header>

      <motion.main className="flex-1 mt-4 overflow-y-auto">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-black font-medium mb-4">Liste des Absences</h3>
          <table className="w-full border-collapse text-sm text-gray-800">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="px-4 py-2 text-left">Matricule</th>
                <th className="px-4 py-2 text-left">Nom Complet</th>
                <th className="px-4 py-2 text-left">Date Début</th>
                <th className="px-4 py-2 text-left">Date Fin</th>
                <th className="px-4 py-2 text-left">Raison</th>
              </tr>
            </thead>
            <tbody>
              {absences.map((absence) => (
                <tr key={absence.id} className="border-t">
                  <td className="px-4 py-2">{absence.matricule}</td>
                  <td className="px-4 py-2">{absence.nomComplet}</td>
                  <td className="px-4 py-2">{absence.dateDebut}</td>
                  <td className="px-4 py-2">{absence.dateFin}</td>
                  <td className="px-4 py-2">{absence.raison}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.main>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-lg font-semibold mb-4">Ajouter une absence</h3>
            <input type="text" placeholder="Matricule" className="w-full p-2 mb-2 border rounded" value={newAbsence.matricule} onChange={(e) => setNewAbsence({ ...newAbsence, matricule: e.target.value })} />
            <input type="text" placeholder="Nom Complet" className="w-full p-2 mb-2 border rounded" value={newAbsence.nomComplet} onChange={(e) => setNewAbsence({ ...newAbsence, nomComplet: e.target.value })} />
            <input type="date" className="w-full p-2 mb-2 border rounded" value={newAbsence.dateDebut} onChange={(e) => setNewAbsence({ ...newAbsence, dateDebut: e.target.value })} />
            <input type="date" className="w-full p-2 mb-2 border rounded" value={newAbsence.dateFin} onChange={(e) => setNewAbsence({ ...newAbsence, dateFin: e.target.value })} />
            <input type="text" placeholder="Raison" className="w-full p-2 mb-4 border rounded" value={newAbsence.raison} onChange={(e) => setNewAbsence({ ...newAbsence, raison: e.target.value })} />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded">Annuler</button>
              <button onClick={handleAddAbsence} className="px-4 py-2 bg-blue-600 text-white rounded">Ajouter</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
