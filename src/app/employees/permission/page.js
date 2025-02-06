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
  CheckCircle,
  Trash,
} from 'lucide-react';
import { toast } from 'sonner';

export default function PermissionPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState([
    {
      id: '1',
      type: 'Congé annuel',
      description: 'Demande de congé annuel pour raisons personnelles.',
      date: '2024-03-18',
      status: 'En attente',
    },
    {
      id: '2',
      type: 'Télétravail',
      description: 'Demande de télétravail pour raisons médicales.',
      date: '2024-03-20',
      status: 'Accordé',
    },
    {
      id: '3',
      type: 'Congé maladie',
      description: 'Demande de congé maladie pour une opération chirurgicale.',
      date: '2024-03-22',
      status: 'Refusé',
    },
  ]);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newPermission, setNewPermission] = useState({
    type: '',
    description: '',
    date: '',
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleRequestPermission = () => {
    setIsPopupOpen(true);
  };

  const handleSubmitPermission = () => {
    if (newPermission.type && newPermission.description && newPermission.date) {
      setPermissions((prevPermissions) => [
        ...prevPermissions,
        {
          id: (prevPermissions.length + 1).toString(),
          ...newPermission,
          status: 'En attente',
        },
      ]);
      setIsPopupOpen(false);
      setNewPermission({ type: '', description: '', date: '' });
      toast('Permission demandée avec succès');
    } else {
      toast('Veuillez remplir tous les champs');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'En attente':
        return 'bg-yellow-500 text-white';
      case 'Accordé':
        return 'bg-green-500 text-white';
      case 'Refusé':
        return 'bg-red-500 text-white';
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
          <h2 className="text-xl font-bold text-gray-800">Permissions des employés</h2>
          <button
            onClick={handleRequestPermission}
            className="bg-blue-500 text-white p-2 rounded-lg flex items-center gap-2"
          >
            <Plus /> Demander permission
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
            <h3 className="text-lg font-semibold mb-4">Liste des permissions</h3>
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b">Type</th>
                  <th className="px-4 py-2 border-b">Description</th>
                  <th className="px-4 py-2 border-b">Date</th>
                  <th className="px-4 py-2 border-b">Statut</th>
                </tr>
              </thead>
              <tbody>
                {permissions.map((permission) => (
                  <tr key={permission.id} className="text-sm">
                    <td className="px-4 py-2 border-b text-gray-800">{permission.type}</td>
                    <td className="px-4 py-2 border-b text-gray-600">{permission.description}</td>
                    <td className="px-4 py-2 border-b text-gray-600">{permission.date}</td>
                    <td className="px-4 py-2 border-b">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          permission.status
                        )}`}
                      >
                        {permission.status}
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
            <h2 className="text-xl font-bold mb-4">Demander une permission</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Type de permission</label>
                <input
                  type="text"
                  value={newPermission.type}
                  onChange={(e) => setNewPermission({ ...newPermission, type: e.target.value })}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={newPermission.description}
                  onChange={(e) => setNewPermission({ ...newPermission, description: e.target.value })}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  value={newPermission.date}
                  onChange={(e) => setNewPermission({ ...newPermission, date: e.target.value })}
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
                  onClick={handleSubmitPermission}
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