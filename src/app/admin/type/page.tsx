"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PencilIcon, TrashIcon } from "@heroicons/react/outline";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TypesPage() {
  const [types, setTypes] = useState<Array<{ id: number; type: string }>>([]);
  const [newtype, setNewType] = useState({
    type: "",
  });
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch("/api/types");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupérationtypes");
        }
        const data = await response.json();
        setTypes(data);
      } catch (error: unknown) {
        if (error && typeof error === 'object' && 'message' in error) {
          const e = error as { message: string };
          console.error(e.message);
        } else {
          console.error("Unknown error", error);
        }
        toast.error("Erreur lors de la récupération des types");
      }
    };

    fetchTypes();
  }, []);

  const handleAddType = async () => {
    try {
      const response = await fetch("/api/types/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newtype),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout du type");
      }

      const addedType = await response.json();
      setTypes((prevtypes) => [...prevtypes, addedType]);
      setNewType({
        type: "",
      });
      setIsPopoverOpen(false);
      toast.success("type ajouté avec succès");
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'message' in error) {
        const e = error as { message: string };
        console.error(e.message);
      } else {
        console.error("Unknown error", error);
      }
      toast.error("Erreur lors de l'ajout du type");
    }
  };

  const handleEditType = (type) => {
    setEditingType({ ...type });
    setIsEditModalOpen(true);
  };

  const handleUpdateType = async () => {
    try {
      const response = await fetch("/api/types/edit", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingType),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du type");
      }

      const updatedType = await response.json();
      if (editingType) {
        setTypes((prevTypes) =>
          prevTypes.map((type) =>
            type.type === editingType.type ? { ...type, ...editingType } : type
          )
        );
      }

      setIsEditModalOpen(false);
      setEditingType(null);
      toast.success("type mis à jour avec succès");
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'message' in error) {
        const e = error as { message: string };
        console.error(e.message);
      } else {
        console.error("Unknown error", error);
      }
      toast.error("Erreur lors de la mise à jour du type");
    }
  };

  const handleEditingInputChange = (field, value) => {
    setEditingType((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDeleteType = async (id) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ce type ?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/types/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression du type");
      }

      setTypes((prevTypes) =>
        prevTypes.filter((type) => type.id !== id)
      );
      toast.success("type supprimé avec succès");
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'message' in error) {
        const e = error as { message: string };
        console.error(e.message);
      } else {
        console.error("Unknown error", error);
      }
      toast.error("Erreur lors de la suppression du type");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <ToastContainer />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Gestion des Types de Projets</h1>
        <div className="mb-6">
          <button
            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
            className="p-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            Ajouter un type
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
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Ajouter un type</h2>
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Titre du type
                      </label>
                      <input
                        type="text"
                        value={newtype.type}
                        onChange={(e) => setNewType({ ...newtype, type: e.target.value })}
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
                      onClick={handleAddType}
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
          {isEditModalOpen && editingType && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <div className="bg-white shadow-2xl p-8 rounded-lg w-2/3 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Modifier le type</h2>
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Titre du type
                      </label>
                      <input
                        type="text"
                        value={editingType.type}
                        onChange={(e) => handleEditingInputChange("type", e.target.value)}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditModalOpen(false);
                        setEditingType(null);
                      }}
                      className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-300"
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      onClick={handleUpdateType}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                      Modifier
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          {types.map((type) => (
            <div key={type.id} className="flex justify-between items-center p-4 bg-white shadow rounded-lg">
              <span className="text-lg font-medium text-gray-800">{type.type}</span>
              <div className="space-x-4">
                <button
                  onClick={() => handleEditType(type)}
                  className="text-blue-600 hover:text-blue-700 transition duration-300"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleEditType(type.id)}
                  className="text-red-600 hover:text-red-700 transition duration-300"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
