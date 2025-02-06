import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function REGISTERFORM (){
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const handleAddUser = () => {
        setUsers([...users, { ...newUser, id: Date.now() }]);
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
          role: ""
        });
        setIsPopoverOpen(false);
      };
    return(
        <AnimatePresence>
        {isPopoverOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 50, scale: 0.9 }}
            className="absolute top-20 left-1/4 bg-white shadow-lg p-6 rounded-lg w-1/2"
          >
            <h2 className="text-xl font-bold mb-4">Ajouter un utilisateur</h2>
            <form>
              <div className="grid grid-cols-2 gap-4">
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
                  onChange={(e) => setNewUser({ ...newUser, tel: e.target.value })}
                  className="border p-2 rounded-lg"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newUser.mail}
                  onChange={(e) => setNewUser({ ...newUser, mail: e.target.value })}
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
                  onChange={(e) => setNewUser({ ...newUser, poste: e.target.value })}
                  className="border p-2 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Rôle"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
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
    )
}