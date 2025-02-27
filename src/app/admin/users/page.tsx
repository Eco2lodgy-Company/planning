"use client"
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PencilIcon, TrashIcon } from "@heroicons/react/outline";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UsersPage() {
  const [users, setUsers] = useState<Array<{ matricule: string; nom_complet: string; mail: string; departement: string; poste: string;role:string; id_user: string }>>([]);
  const [departements, setDepartements] = useState([]);
  const [newUser, setNewUser] = useState({
    matricule: "",
    nom_complet: "",
    nationality: "",
    genre: "",
    tel: "",
    mail: "",
    adresse: "",
    departement: "",
    poste: "",
    role: "",
    password: "Eco@2025",
  });
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des utilisateurs");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error(error.message);
      }
    };

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

    // const fetchDepartements = async () => {
    //   try {
    //     const response = await fetch("/api/departement");
    //     if (!response.ok) {
    //       throw new Error("Erreur lors de la récupération des départements");
    //     }
    //     const data = await response.json();
    //     setDepartements(data);
    //   } catch (error) {
    //     console.error(error.message);
    //     toast.error("Erreur lors de la récupération des départements");
    //   }
    // };

    fetchUsers();
    fetchDepartements();
  }, []);


  const handleAddUser = async () => {
    try {
      const response = await fetch("/api/users/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout de l'utilisateur");
      }

      const addedUser = await response.json();
      setUsers((prevUsers) => [...prevUsers, addedUser]);
      setNewUser({
        matricule: "",
        nom_complet: "",
        nationality: "",
        genre: "",
        tel: "",
        mail: "",
        adresse: "",
        departement: "",
        poste: "",
        role: "",
        password: "Eco@2025",
      });
      setIsPopoverOpen(false);
      toast.success("Utilisateur ajouté avec succès");
    } catch (error) {
      console.error(error.message);
      toast.error("Erreur lors de l'ajout de l'utilisateur");
    }
  };

  const handleEditUser = (user) => {
    setEditingUser({ ...user }); // Crée une copie de l'objet utilisateur
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async () => {
    try {
      const response = await fetch("/api/users/edit", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingUser),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour de l'utilisateur");
      }

      const updatedUser = await response.json();
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id_user === editingUser.id_user ? { ...user, ...editingUser } : user
        )
      );

      setIsEditModalOpen(false);
      setEditingUser(null);
      toast.success("Utilisateur mis à jour avec succès");
    } catch (error) {
      console.error(error.message);
      toast.error("Erreur lors de la mise à jour de l'utilisateur");
    }
  };

  const handleEditingInputChange = (field, value) => {
    setEditingUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDeleteUser = async (matricule) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/users/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_user: matricule }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'utilisateur");
      }

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.matricule !== matricule)
      );
      toast.success("Utilisateur supprimé avec succès");
    } catch (error) {
      console.error(error.message);
      toast.error("Erreur lors de la suppression de l'utilisateur");
    }
  };

  const getDepartmentNameById = (id) => {
    const department = departements.find((dep) => dep.id === id);
    return department ? department.titre : "Inconnu";
  };

  return (
    <div className="flex h-screen bg-gray-100" style={{color: 'black'}}>
      <ToastContainer />
      <div className="flex-1 p-8">
      <header className=" mb-2 flex flex-col sm:flex-row items-center justify-between p-6 bg-white shadow gap-4">
          <div className="flex items-center w-full">
            <div className="lg:hidden w-8" /> {/* Spacer for mobile */}
            <h2 className="text-xl font-bold text-gray-800 ml-4">Gestion des utilisateurs</h2>
          </div>
        </header>
        <div className="mb-6">
          <button
            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
            className="p-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            Ajouter un utilisateur
          </button>
        </div>

        {/* Popup pour ajouter un utilisateur */}
        <AnimatePresence>
          {isPopoverOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <div className="bg-white shadow-2xl p-8 rounded-lg w-2/3 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Ajouter un utilisateur</h2>
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Matricule
                      </label>
                      <input
                        type="text"
                        value={newUser.matricule}
                        onChange={(e) => setNewUser({ ...newUser, matricule: e.target.value })}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom Complet
                      </label>
                      <input
                        type="text"
                        value={newUser.nom_complet}
                        onChange={(e) => setNewUser({ ...newUser, nom_complet: e.target.value })}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nationalité
                      </label>
                      <input
                        type="text"
                        value={newUser.nationality}
                        onChange={(e) => setNewUser({ ...newUser, nationality: e.target.value })}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Genre
                      </label>
                      <select
                        value={newUser.genre}
                        onChange={(e) => setNewUser({ ...newUser, genre: e.target.value })}
                        className="w-full p-2 border rounded-lg"
                      >
                        <option value="">Sélectionner</option>
                        <option value="M">Masculin</option>
                        <option value="F">Féminin</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        value={newUser.tel}
                        onChange={(e) => setNewUser({ ...newUser, tel: e.target.value })}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={newUser.mail}
                        onChange={(e) => setNewUser({ ...newUser, mail: e.target.value })}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adresse
                      </label>
                      <input
                        type="text"
                        value={newUser.adresse}
                        onChange={(e) => setNewUser({ ...newUser, adresse: e.target.value })}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Département
                      </label>
                      <select
                        value={newUser.departement}
                        onChange={(e) => setNewUser({ ...newUser, departement: e.target.value })}
                        className="w-full p-2 border rounded-lg"
                      >
                        <option value="">Sélectionner un département</option>
                        {departements.map((dep) => (
                          <option key={dep.id} value={dep.id}>
                            {dep.titre}
                          </option>
                        ))}
                      </select>
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
                      onClick={handleAddUser}
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

        {/* Modal pour modifier un utilisateur */}
        <AnimatePresence>
          {isEditModalOpen && editingUser && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <div className="bg-white shadow-2xl p-8 rounded-lg w-2/3 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Modifier l'utilisateur</h2>
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Matricule
                      </label>
                      <input
                        type="text"
                        value={editingUser.matricule}
                        onChange={(e) => handleEditingInputChange("matricule", e.target.value)}
                        className="w-full p-2 border rounded-lg"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom Complet
                      </label>
                      <input
                        type="text"
                        value={editingUser.nom_complet}
                        onChange={(e) => handleEditingInputChange("nom_complet", e.target.value)}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nationalité
                      </label>
                      <input
                        type="text"
                        value={editingUser.nationality}
                        onChange={(e) => handleEditingInputChange("nationality", e.target.value)}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Genre
                      </label>
                      <select
                        value={editingUser.genre}
                        onChange={(e) => handleEditingInputChange("genre", e.target.value)}
                        className="w-full p-2 border rounded-lg"
                      >
                        <option value="">Sélectionner</option>
                        <option value="M">Masculin</option>
                        <option value="F">Féminin</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        value={editingUser.tel}
                        onChange={(e) => handleEditingInputChange("tel", e.target.value)}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={editingUser.mail}
                        onChange={(e) => handleEditingInputChange("mail", e.target.value)}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adresse
                      </label>
                      <input
                        type="text"
                        value={editingUser.adresse}
                        onChange={(e) => handleEditingInputChange("adresse", e.target.value)}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Département
                        </label>
                        <select
                          value={editingUser.departement}
                          onChange={(e) => handleEditingInputChange("departement", e.target.value )}
                          className="w-full p-2 border rounded-lg"
                        >
                          <option value="">Sélectionner un département</option>
                          {departements.map((dep) => (
                            <option key={dep.id} value={dep.id}>
                              {dep.titre}
                            </option>
                          ))}
                        </select>
                      </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Poste
                      </label>
                      <input
                        type="text"
                        value={editingUser.poste}
                        onChange={(e) => handleEditingInputChange("poste", e.target.value)}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rôle
                      </label>
                      <select
                        value={editingUser.role}
                        onChange={(e) => handleEditingInputChange("role", e.target.value)}
                        className="w-full p-2 border rounded-lg"
                      >
                        <option value="">Sélectionner</option>
                        <option value="admin">Administrateur</option>
                        <option value="user">Employée</option>
                        <option value="resp">Responsable</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditModalOpen(false);
                        setEditingUser(null);
                      }}
                      className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-300"
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      onClick={handleUpdateUser}
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

        {/* Tableau des utilisateurs */}
        <table className="min-w-full bg-white rounded-lg shadow-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-4 px-6 border-b text-left text-gray-700">Matricule</th>
              <th className="py-4 px-6 border-b text-left text-gray-700">Nom</th>
              <th className="py-4 px-6 border-b text-left text-gray-700">Email</th>
              <th className="py-4 px-6 border-b text-left text-gray-700">Département</th>
              <th className="py-4 px-6 border-b text-left text-gray-700">Poste</th>
              <th className="py-4 px-6 border-b text-left text-gray-700">Role</th>
              <th className="py-4 px-6 border-b text-left text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter((user) => user && user.matricule)
              .map((user) => (
                <tr key={user.matricule} className="hover:bg-gray-50 transition duration-200">
                  <td className="py-4 px-6 border-b">{user.matricule}</td>
                  <td className="py-4 px-6 border-b">{user.nom_complet}</td>
                  <td className="py-4 px-6 border-b">{user.mail}</td>
                  <td className="py-4 px-6 border-b">{getDepartmentNameById(user.departement)}</td>
                  <td className="py-4 px-6 border-b">{user.poste}</td>
                  <td className="py-4 px-6 border-b">{user.role}</td>
                  <td className="py-4 px-6 border-b flex space-x-4">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="text-blue-600 hover:text-blue-800 transition duration-200"
                    >
                      <PencilIcon className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id_user)}
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