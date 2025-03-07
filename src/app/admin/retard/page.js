'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


// Données d'exemple pour les retards


export default function RetardListPage() {
  const [loading, setLoading] = useState(true);
  //const [lateList, setlateList] = useState(samplelateList);
  const [showModal, setShowModal] = useState(false);
  const [usersList, setUserList] = useState([]);
  const [lateList, setLateList] = useState([]);
  const [newDelay, setNewDelay] = useState({ employe: '', date: '', minutes: '', motif: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);  // Ajouter un état pour la soumission

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    const userIdd=localStorage.getItem('userId');
    const fetchAgents = async () => {
      try {
        const response = await fetch('/api/headside/agents/'+userIdd);
        if (!response.ok) throw new Error('Erreur lors de la récupération des informations');
        const data = await response.json();
        setUserList(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
 
    const fetchLate = async () => {
      try {
        const response = await fetch('/api/headside/retards');
        if (!response.ok) throw new Error('Erreur lors de la récupération des informations');
        const data = await response.json();
        setLateList(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLate();
  },[]);

  const handleAddDelay = async () => {
    if (!newDelay.employe || !newDelay.date || !newDelay.minutes || !newDelay.motif) {
      toast.error('Veuillez remplir tous les champs.');
      return;
    }

    setIsSubmitting(true);  // Démarrer l'animation de chargement

    // Envoi des données au backend
    try {
      const response = await fetch('/api/headside/retards', {  // URL de l'API pour ajouter un retard
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDelay),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'ajout du retard');
      }

      // Ajouter le retard à la liste locale si la requête réussie
      const data = await response.json();
      //setlateList([...lateList, { ...data, id: lateList.length + 1 }]);

      toast.success('Retard ajouté avec succès');
      setShowModal(false);
      setNewDelay({ employe: '', date: '', minutes: '', motif: '' });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);  // Arrêter l'animation de chargement
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
                <th className="px-4 py-2 text-left">Employé</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Minutes</th>
                <th className="px-4 py-2 text-left">Motif</th>
              </tr>
            </thead>
            <tbody>
              {lateList.map((delay) => (
                <tr key={delay.id} className="border-t">
                  <td className="px-4 py-2">{delay.nomcomplet}</td>
                  <td className="px-4 py-2">{delay.date_retard}</td>
                  <td className="px-4 py-2">{delay.temps}</td>
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
            <select className="w-full p-2 mb-2 border rounded" 
              value={newDelay.employe} 
              onChange={(e) => setNewDelay({ ...newDelay, employe: e.target.value })}>
              <option value="">Sélectionner un employé</option>
              {usersList.map(emp => (
                <option key={emp.id_user} value={emp.id_user}>{emp.nom_complet}</option>
              ))}
            </select>
            <input type="date" className="w-full p-2 mb-2 border rounded" 
              value={newDelay.date} 
              onChange={(e) => setNewDelay({ ...newDelay, date: e.target.value })}
            />
            <input type="number" placeholder="Nombre de minutes" className="w-full p-2 mb-2 border rounded" 
              value={newDelay.minutes} 
              onChange={(e) => setNewDelay({ ...newDelay, minutes: e.target.value })}
            />
            <input type="text" placeholder="Motif" className="w-full p-2 mb-2 border rounded" 
              value={newDelay.motif} 
              onChange={(e) => setNewDelay({ ...newDelay, motif: e.target.value })}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-400 text-white rounded-md">Annuler</button>
              <button onClick={handleAddDelay} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                {isSubmitting ? (
                  <div className="animate-spin h-5 w-5 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                ) : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ajoutez le ToastContainer ici */}
      <ToastContainer />
    </div>
  );
}