'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation'; // ✅ Next.js
import Link from 'next/link'; // ✅ Next.js
import {
  Home,
  Calendar,
  CircleCheckBig,
  Users,
  Settings,
  Shield,
  ClipboardMinus,
  Plus,
  FileText,
  Trash,
} from 'lucide-react';
import { toast } from 'sonner';

export default function ReportPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([
    {
      id: '1',
      title: 'Rapport mensuel',
      description: 'Rapport sur les performances de l\'équipe pour le mois de mars.',
      date: '2024-03-18',
      status: 'Publié',
    },
    {
      id: '2',
      title: 'Rapport de sécurité',
      description: 'Rapport sur les incidents de sécurité pour le trimestre.',
      date: '2024-03-20',
      status: 'En révision',
    },
    {
      id: '3',
      title: 'Rapport financier',
      description: 'Rapport sur les dépenses et les revenus pour le mois de février.',
      date: '2024-03-22',
      status: 'Brouillon',
    },
  ]);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newReport, setNewReport] = useState({
    title: '',
    description: '',
    date: '',
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleCreateReport = () => {
    setIsPopupOpen(true);
  };

  const handleSubmitReport = () => {
    if (newReport.title && newReport.description && newReport.date) {
      setReports((prevReports) => [
        ...prevReports,
        {
          id: (prevReports.length + 1).toString(),
          ...newReport,
          status: 'Brouillon',
        },
      ]);
      setIsPopupOpen(false);
      setNewReport({ title: '', description: '', date: '' });
      toast('Rapport créé avec succès');
    } else {
      toast('Veuillez remplir tous les champs');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Brouillon':
        return 'bg-yellow-500 text-white';
      case 'En révision':
        return 'bg-blue-500 text-white';
      case 'Publié':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
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
    <div className="flex h-screen bg-gray-100">
    

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between p-6 bg-white shadow">
          <h2 className="text-xl font-bold text-gray-800">Rapports des employés</h2>
          <button
            onClick={handleCreateReport}
            className="bg-blue-500 text-white p-2 rounded-lg flex items-center gap-2"
          >
            <Plus /> Créer un rapport
          </button>
        </header>

        {/* Main Section */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex-1 p-6 overflow-y-auto"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Liste des rapports</h3>
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b">Titre</th>
                  <th className="px-4 py-2 border-b">Description</th>
                  <th className="px-4 py-2 border-b">Date</th>
                  <th className="px-4 py-2 border-b">Statut</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id} className="text-sm">
                    <td className="px-4 py-2 border-b text-gray-800">{report.title}</td>
                    <td className="px-4 py-2 border-b text-gray-600">{report.description}</td>
                    <td className="px-4 py-2 border-b text-gray-600">{report.date}</td>
                    <td className="px-4 py-2 border-b">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          report.status
                        )}`}
                      >
                        {report.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.main>
      </div>

      {/* Popup Formulaire */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Créer un rapport</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Titre du rapport</label>
                <input
                  type="text"
                  value={newReport.title}
                  onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={newReport.description}
                  onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  value={newReport.date}
                  onChange={(e) => setNewReport({ ...newReport, date: e.target.value })}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsPopupOpen(false)}
                  className="bg-gray-500 text-white p-2 rounded-lg mr-2"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleSubmitReport}
                  className="bg-blue-500 text-white p-2 rounded-lg"
                >
                  Soumettre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}