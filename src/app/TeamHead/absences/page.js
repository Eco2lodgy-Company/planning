"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, X, Loader2 } from 'lucide-react';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


// const sampleAbsences = [
//   { id: 1, employe: 'Jean Dupont', date: '2024-02-01', raison: 'Congé maladie' },
//   { id: 2, employe: 'Marie Martin', date: '2024-01-15', raison: 'Vacances' }
// ];


export default function AbsenceListPage() {
  const [loading, setLoading] = useState(true);
  const [absences, setAbsences] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newAbsence, setNewAbsence] = useState({ employe: '', date: '', raison: '' });
  const [agents, setAgents] = useState([]);

  const userIdd = localStorage.getItem('userId');

  

  useEffect(() => {

      const timer = setTimeout(() => setLoading(false), 1200);
      return () => clearTimeout(timer);
    }, []);


    useEffect(() => {

      const fetchAgents = async () => {
        try {
          const response = await fetch('/api/headside/agents/'+userIdd);
          if (!response.ok) throw new Error('Erreur lors de la récupération des informations');
          const data = await response.json();
          setAgents(data);
        } catch (error) {
          toast.error(error.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchAgents();
    },[]);


    //recuperation et affichage des abscences


    useEffect(() => {
      const userIdd=localStorage.getItem('userId');

      const fetchAbsence = async () => {
        try {
          const response = await fetch('/api/headside/absences/'+userIdd);
        
          if (!response.ok) throw new Error('Erreur lors de la récupération des informations');
          const data = await response.json();
          setAbsences(data);
        } catch (error) {
          toast.error(error.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchAbsence();
    },[]);

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
  
    // Envoi des données à l'API
    fetch('/api/headside/absences/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newAbsence), // Envoi des données sous forme de JSON
    })
      .then(response => response.json()) // Assurer que la réponse soit au format JSON
      .then(data => {
        // Après avoir reçu une réponse positive de l'API
        //setAbsences([...absences, { id: data.id, ...newAbsence }]); // Utilise l'ID de la réponse
        toast.success('Absence ajoutée avec succès');
        setShowModal(false);
        setNewAbsence({ employe: '', date: '', raison: '' });
        setSubmitting(false);
      })
      .catch(error => {
        // En cas d'erreur dans l'envoi des données
        toast.error('Erreur lors de l\'ajout de l\'absence');
        setSubmitting(false);
      });
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
                <th className="px-4 py-2 text-left">Employé</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Raison</th>
              </tr>
            </thead>
            <tbody>
              {absences.map((absence) => (
                <tr key={absence.id} className="border-t">
                  <td className="px-4 py-2">{absence.nom_complet}</td>
                  <td className="px-4 py-2">{absence.date_absence}</td>
                  <td className="px-4 py-2">{absence.motif}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.main>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.8 }} 
            className="bg-white p-6 rounded-lg shadow-lg w-96"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Nouvelle Absence</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-600 hover:text-gray-800">
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <select 
                name="employe" 
                value={newAbsence.employe} 
                onChange={handleInputChange} 
                className="border p-2 rounded-md w-full"
              >
                <option value="">Sélectionner un employé</option>
                {agents.map((emp, index) => (
                  <option key={index} value={emp.id_user}>{emp.nom_complet}</option>
                ))}
              </select>
              <input 
                type="date" 
                name="date" 
                value={newAbsence.date} 
                onChange={handleInputChange} 
                className="border p-2 rounded-md w-full"
              />
              <input 
                type="text" 
                name="raison" 
                value={newAbsence.raison} 
                onChange={handleInputChange} 
                placeholder="Raison de l'absence" 
                className="border p-2 rounded-md w-full"
              />
            </div>
            <div className="flex justify-end mt-4">
              <button 
                onClick={handleAddAbsence} 
                className={`flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={submitting}
              >
                {submitting ? <Loader2 className="animate-spin" size={20} /> : 'Ajouter'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
            <ToastContainer />

    </div>
  );
}
