"use client"
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PencilIcon, TrashIcon } from "@heroicons/react/outline";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DepartementsPage() {
  const [departements, setDepartements] = useState<Array<{ id: string; titre: string }>>([]);
  const [newDepartement, setNewDepartement] = useState({
    titre: "",
  });
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [editingDepartement, setEditingDepartement] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchDepartements = async () => {
      try {
        const response = await fetch("/api/departement");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des départements");
        }
        const data = await response.json();
        setDepartements(data);
      } catch (error) {
        console.error(error.message);
        toast.error("Erreur lors de la récupération des départements");
      }
    };

    fetchDepartements();
  }, []);

  const handleAddDepartement = async () => {
    try {
      const response = await fetch("/api/departement/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDepartement),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout du département");
      }

      const addedDepartement = await response.json();
      setDepartements((prevDepartements) => [...prevDepartements, addedDepartement]);
      setNewDepartement({
        titre: "",
      });
      setIsPopoverOpen(false);
      toast.success("Département ajouté avec succès");
    } catch (error) {
      console.error(error.message);
      toast.error("Erreur lors de l'ajout du département");
    }
  };

  const handleEditDepartement = (departement) => {
    setEditingDepartement({ ...departement });
    setIsEditModalOpen(true);
  };

  const handleUpdateDepartement = async () => {
    try {
      const response = await fetch("/api/departement/edit", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingDepartement),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du département");
      }

      const updatedDepartement = await response.json();
      setDepartements((prevDepartements) =>
        prevDepartements.map((dep) =>
          dep.id === editingDepartement.id ? { ...dep, ...editingDepartement } : dep
        )
      );

      setIsEditModalOpen(false);
      setEditingDepartement(null);
      toast.success("Département mis à jour avec succès");
    } catch (error) {
      console.error(error.message);
      toast.error("Erreur lors de la mise à jour du département");
    }
  };

  const handleEditingInputChange = (field, value) => {
    setEditingDepartement((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDeleteDepartement = async (id) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ce département ?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/departement/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression du département");
      }

      setDepartements((prevDepartements) =>
        prevDepartements.filter((dep) => dep.id !== id)
      );
      toast.success("Département supprimé avec succès");
    } catch (error) {
      console.error(error.message);
      toast.error("Erreur lors de la suppression du département");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <ToastContainer />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Gestion des Départements</h1>
        <div className="mb-6">
          <button
            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
            className="p-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            Ajouter un département
          </button>
        </div>

        {/* Popup pour ajouter un département */}
        <AnimatePresence>
          {isPopoverOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <div className="bg-white shadow-2xl p-8 rounded-lg w-2/3 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Ajouter un département</h2>
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Titre du département
                      </label>
                      <input
                        type="text"
                        value={newDepartement.titre}
                        onChange={(e) => setNewDepartement({ ...newDepartement, titre: e.target.value })}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setIsPopoverOpen(false)}
                      className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-300"
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      onClick={handleAddDepartement}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                      Ajouter
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal pour modifier un département */}
        <AnimatePresence>
          {isEditModalOpen && editingDepartement && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <div className="bg-white shadow-2xl p-8 rounded-lg w-2/3 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Modifier le département</h2>
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Titre du département
                      </label>
                      <input
                        type="text"
                        value={editingDepartement.titre}
                        onChange={(e) => handleEditingInputChange("titre", e.target.value)}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditModalOpen(false);
                        setEditingDepartement(null);
                      }}
                      className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-300"
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      onClick={handleUpdateDepartement}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                      Enregistrer
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tableau des départements */}
        <table className="min-w-full bg-white rounded-lg shadow-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-4 px-6 border-b text-left text-gray-700">Titre</th>
              <th className="py-4 px-6 border-b text-left text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departements
              .filter((dep) => dep && dep.id)
              .map((dep) => (
                <tr key={dep.id} className="hover:bg-gray-50 transition duration-200">
                  <td className="py-4 px-6 border-b">{dep.titre}</td>
                  <td className="py-4 px-6 border-b flex space-x-4">
                    <button
                      onClick={() => handleEditDepartement(dep)}
                      className="text-blue-600 hover:text-blue-800 transition duration-200"
                    >
                      <PencilIcon className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => handleDeleteDepartement(dep.id)}
                      className="text-red-600 hover:text-red-800 transition duration-200"
                    >
                      <TrashIcon className="w-6 h-6" />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}