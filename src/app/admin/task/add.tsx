"use client"
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Task {
  id_tache?: number;
  libelle: string;
  niveau: number;
  id_projet: number;
  echeance: number;
  datedebut: string;
  status: string;
  departement: number;
  priorite: number;
  id_user: number;
}

interface User {
  id_user: number;
  nom_complet: string;
}

interface Project {
  id_projet: number;
  project_name: string;
}

interface Department {
  id: number;
  titre: string;
}

interface AjouterTacheProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskAdded?: () => void;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export default function AjouterTache({
                                       isOpen,
                                       onClose,
                                       onTaskAdded,
                                       setTasks
                                     }: AjouterTacheProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [newTask, setNewTask] = useState<Task>({
    libelle: "",
    niveau: 1,
    id_projet: 0,
    echeance: 1,
    datedebut: "",
    status: "pending",
    departement: 0,
    priorite: 1,
    id_user: 0,
  });

  const fetchData = async (
      endpoint: string,
      setter: React.Dispatch<React.SetStateAction<any[]>>
  ) => {
    try {
      const response = await fetch(endpoint);
      const result = await response.json();

      if (response.ok) {
        setter(result.data || result);
      } else {
        toast.error(`Erreur lors de la récupération des données: ${result.message}`);
      }
    } catch (error) {
      toast.error("Erreur réseau lors de la récupération des données");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData("/api/users", setUsers);
    fetchData("/api/projects", setProjects);
    fetchData("/api/departement", setDepartments);
  }, []);


  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!newTask.libelle.trim()) {
      toast.error("Le libellé est requis");
      return;
    }

    try {
      const response = await fetch("/api/tasks/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout de la tâche");
      }

      const addedTask = await response.json(); // Supposons que la réponse contient la tâche ajoutée

      // Mettre à jour la liste des tâches
      setTasks((prevTasks) => [...prevTasks, addedTask]);

      // Reset form and close dialog
      setNewTask({
        libelle: "",
        niveau: 1,
        id_projet: 0,
        echeance: 1,
        datedebut: "",
        status: "pending",
        departement: 0,
        priorite: 1,
        id_user: 0,
      });

      onTaskAdded?.();
      onClose();
      toast.success("Tâche ajoutée avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'ajout de la tâche");
      console.error(error);
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-800">
            Ajouter une activité
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleAddTask} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Libellé */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Libellé
              </label>
              <input
                type="text"
                value={newTask.libelle}
                onChange={(e) => setNewTask({ ...newTask, libelle: e.target.value })}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            {/* Niveau */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Niveau
              </label>
              <select
                value={newTask.niveau}
                onChange={(e) => setNewTask({ ...newTask, niveau: Number(e.target.value) })}
                className="w-full p-2 border rounded-lg"
                required
              >
                <option value={1}>Facile</option>
                <option value={2}>Moyen</option>
                <option value={3}>Difficile</option>
              </select>
            </div>

            {/* Projet */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Projet
              </label>
              <select
                value={newTask.id_projet || 0}
                onChange={(e) => setNewTask({ ...newTask, id_projet: Number(e.target.value) })}
                className="w-full p-2 border rounded-lg"
                required
              >
                <option value={0}>Choisissez le projet</option>
                {projects.map((pro) => (
                  <option key={pro.id_projet} value={pro.id_projet}>
                    {pro.project_name}
                  </option>
                ))}
              </select> 
            </div>

            {/* Échéance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Échéance (jours)
              </label>
              <input
                type="number"
                value={newTask.echeance}
                onChange={(e) => setNewTask({ ...newTask, echeance: Number(e.target.value) })}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            {/* Date de début */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de début
              </label>
              <input
                type="date"
                value={newTask.datedebut}
                onChange={(e) => setNewTask({ ...newTask, datedebut: e.target.value })}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            {/* Département */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Département
              </label>
              <select
                value={newTask.departement || 0}
                onChange={(e) => setNewTask({ ...newTask, departement: Number(e.target.value) })}
                className="w-full p-2 border rounded-lg"
                required
              >
                <option value={0}>Choisissez le département</option>
                {departments.map((dep) => (
                  <option key={dep.id} value={dep.id}>
                    {dep.titre}
                  </option>
                ))}
              </select>
            </div>

            {/* Priorité */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priorité
              </label>
              <select
                value={newTask.priorite}
                onChange={(e) => setNewTask({ ...newTask, priorite: Number(e.target.value) })}
                className="w-full p-2 border rounded-lg"
                required
              >
                <option value={1}>Basse</option>
                <option value={2}>Moyenne</option>
                <option value={3}>Élevée</option>
              </select>
            </div>

            {/* Utilisateur */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Utilisateur
              </label>
              <select
                value={newTask.id_user || ""}
                onChange={(e) => setNewTask({ ...newTask, id_user: Number(e.target.value) })}
                className="w-full p-2 border rounded-lg"
                
              >
                <option value="">Sélectionnez un utilisateur</option>
                {users.map((user) => (
                  <option key={user.id_user} value={user.id_user}>
                    {user.nom_complet}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter className="flex justify-end space-x-2 mt-4">
            <Button 
              type="button"
              variant="outline" 
              onClick={onClose}
            >
              Annuler
            </Button>
            <Button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Ajouter
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}