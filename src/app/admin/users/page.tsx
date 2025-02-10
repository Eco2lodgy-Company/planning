"use client"
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
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
  });
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Charger les utilisateurs depuis l'API
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

    fetchUsers();
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
      setUsers((prevUsers) => [...prevUsers, addedUser]); // Ajouter l'utilisateur dans la liste
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
      });
      setIsPopoverOpen(false);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">Gestion des Utilisateurs</h1>
        <div className="mb-4">
          <button
            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
            className="p-2 bg-blue-500 text-white rounded-lg"
          >
            Ajouter un utilisateur
          </button>
        </div>

        {/* Popover pour ajouter un utilisateur */}
        <AnimatePresence>
          {isPopoverOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute top-20 left-1/4 bg-white shadow-lg p-6 rounded-lg w-1/2"
            >
              <h2 className="text-xl font-bold mb-4">Ajouter un utilisateur</h2>
              <form>
                <div className="grid grid-cols-2 gap-4">
                  {/* Formulaire pour ajouter un utilisateur */}
                  <input
                    type="text"
                    placeholder="Matricule"
                    value={newUser.matricule}
                    onChange={(e) =>
                      setNewUser({ ...newUser, matricule: e.target.value })
                    }
                    className="border p-2 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Nom complet"
                    value={newUser.nom_complet}
                    onChange={(e) =>
                      setNewUser({ ...newUser, nom_complet: e.target.value })
                    }
                    className="border p-2 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Nationalité"
                    value={newUser.nationality}
                    onChange={(e) =>
                      setNewUser({ ...newUser, nationality: e.target.value })
                    }
                    className="border p-2 rounded-lg"
                  />
                  <select
                    value={newUser.genre}
                    onChange={(e) =>
                      setNewUser({ ...newUser, genre: e.target.value })
                    }
                    className="border p-2 rounded-lg"
                  >
                    <option value="">Genre</option>
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Téléphone"
                    value={newUser.tel}
                    onChange={(e) =>
                      setNewUser({ ...newUser, tel: e.target.value })
                    }
                    className="border p-2 rounded-lg"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={newUser.mail}
                    onChange={(e) =>
                      setNewUser({ ...newUser, mail: e.target.value })
                    }
                    className="border p-2 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Adresse"
                    value={newUser.adresse}
                    onChange={(e) =>
                      setNewUser({ ...newUser, adresse: e.target.value })
                    }
                    className="border p-2 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Département"
                    value={newUser.departement}
                    onChange={(e) =>
                      setNewUser({ ...newUser, departement: e.target.value })
                    }
                    className="border p-2 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Poste"
                    value={newUser.poste}
                    onChange={(e) =>
                      setNewUser({ ...newUser, poste: e.target.value })
                    }
                    className="border p-2 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Rôle"
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value })
                    }
                    className="border p-2 rounded-lg"
                  />
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddUser}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                  >
                    Ajouter
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPopoverOpen(false)}
                    className="ml-2 bg-gray-300 px-4 py-2 rounded-lg"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tableau des utilisateurs */}
        <table className="min-w-full bg-white rounded-lg">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Matricule</th>
              <th className="py-2 px-4 border">Nom</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Département</th>
              <th className="py-2 px-4 border">Poste</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.matricule}>
                <td className="py-2 px-4 border">{user.matricule}</td>
                <td className="py-2 px-4 border">{user.nom_complet}</td>
                <td className="py-2 px-4 border">{user.mail}</td>
                <td className="py-2 px-4 border">{user.departement}</td>
                <td className="py-2 px-4 border">{user.poste}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
