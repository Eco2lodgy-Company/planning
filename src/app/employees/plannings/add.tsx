"use client"
import { useState, useEffect, useMemo } from "react";
import { format, startOfWeek, addDays, parseISO, isSameDay, isWithinInterval, isBefore } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/SupabaseClient";
import { data } from "framer-motion/client";

interface Task {
    id_tache: number;
    libelle: string;
    niveau: number;
    id_user: string;
    id_projet: string;
    echeance: number;
    datedebut: string;
    status: string;
    departement: number;
    priorite: number;
  }


  interface User {
    id_user: number;
    nom_complet: string;
  }
  
  interface departement {
    id: number; 
    titre: string;
  }
  interface AJouterTacheProps {
    onClose: () => void;
  }

  export default function AJouterTache({ onClose }: AJouterTacheProps) {
    const [currentWeek, setCurrentWeek] = useState(new Date());
    // const [tasks, setTasks] = useState<Task[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newTask, setNewTask] = useState({
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

    interface Project {
        id_projet: number;
        project_name: string;
      }
      const [projects, setProjects] = useState<Project[]>([]);
      const [departments, setDepartments] = useState<departement[]>([]);

      const fetchUsers = async () => {
        try {
          const response = await fetch("/api/users");
          const result = await response.json();
          if (response.ok) {
            setUsers(result);
          } else {
            console.error("Erreur lors de la récupération des utilisateurs:", result.message);
          }
        } catch (error) {
          console.error("Erreur réseau lors de la récupération des utilisateurs:", error);
        }
      };
    
      const fetchProjects = async () => {
        try {
          const response = await fetch("/api/projects");
          const result = await response.json();
          if (response.ok) {
            setProjects(result.data);
          } else {
            console.error("Erreur lors de la récupération des projets:", result.message);
          }
        } catch (error) {
          console.error("Erreur réseau lors de la récupération des projets:", error);
        }
      };
    
      const fetchDepartments = async () => {
        try {
          const response = await fetch("/api/departement");
          const result = await response.json();
          if (response.ok) {
            setDepartments(result);
          } else {
            console.error("Erreur lors de la récupération des départements:", result.message);
          }
        } catch (error) {
          console.error("Erreur réseau lors de la récupération des départements:", error);
        }
      };
    
  useEffect(() => {
    fetchUsers();
    fetchProjects();
    fetchDepartments();
    // console.log(data);
  }, []);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
  
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
  
      toast.success("Tâche ajoutée avec succès");
  
      // Réinitialiser le formulaire
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
    } catch (error) {
      toast.error("Erreur lors de l'ajout de la tâche");
    }
  };


  return (
   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
<div className="bg-white shadow-2xl p-8 rounded-lg w-2/3 max-h-[90vh] overflow-y-auto">
{/* <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Ajouter une tâche</h2> */}
<form onSubmit={handleAddTask}>
<div className="grid grid-cols-2 gap-6">
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
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">
Projet
</label>
<select
value={newTask.id_projet}
onChange={(e) => setNewTask({ ...newTask, id_projet: Number(e.target.value) })}
className="w-full p-2 border rounded-lg"
required
>
<option value={1}>choisissez le projet</option>
{projects && projects.map((pro)=>
 <option value={pro.id_projet}>{pro.project_name}</option>)
 }
</select> 
</div>
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
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">
Departement
</label>
<select
value={newTask.departement}
onChange={(e) => setNewTask({ ...newTask, departement: Number(e.target.value) })}
className="w-full p-2 border rounded-lg"
required
>
<option value={1}>choisissez le departement</option>
{departments && departments.map((dep)=>
 <option value={dep.id}>{dep.titre}</option>)
 }
</select>
</div>
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
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">
Utilisateur
</label>
<select
value={newTask.id_user ?? ""}
onChange={(e) => setNewTask({ ...newTask, id_user: Number(e.target.value) })}
className="w-full p-2 border rounded-lg"
required
>
<option value="">Sélectionnez un utilisateur</option>
{users && users.map((user) => (
<option key={user.id_user} value={user.id_user}>
  {user.nom_complet}
</option>
))}
</select>
</div>
</div>
<div className="mt-6 flex justify-end space-x-4">
<button
type="button"
onClick={onclose}
className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-300"
>
Annuler
</button>
<button
type="submit"
className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
>
Ajouter
</button>
</div>
</form>
</div>
</div>
  )
  }