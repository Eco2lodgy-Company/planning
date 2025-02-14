"use client";

import { useState, useEffect } from "react";
import { Plus, X, Pencil } from "lucide-react";
import { toast } from "sonner";

interface Project {
  id_projet?: number;
  project_name: string;
  project_type: string;
  partenaire: string;
  echeance: string;
  chef_projet: string; // Stocke l'ID du chef de projet
  status: string;// Ajout du statut
}

interface User {
  id_user: string;
  nom_complet: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]); // Liste des utilisateurs pour le sélecteur
  const [projectTypes, setProjectTypes] = useState<any[]>([]); // Liste des types de projets

  const [newProject, setNewProject] = useState<Project>({
    project_name: "",
    project_type: "",
    partenaire: "",
    echeance: "",
    chef_projet: "", // ID du chef de projet
    status: "pending", // Statut par défaut
  });

  const [editingProject, setEditingProject] = useState<Project>({
    project_name: "",
    project_type: "",
    partenaire: "",
    echeance: "",
    chef_projet: "", // ID du chef de projet
    status: "pending", // Statut par défaut
  });

  // Récupérer les projets, les utilisateurs et les types de projets au chargement
  useEffect(() => {
    fetchProjects();
    fetchUsers();
    fetchProjectTypes().then((types) => setProjectTypes(types));
  }, []);

  // Récupérer les projets depuis l'API
  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      const result = await response.json();

      if (result.data) {
        const projectTypes = await fetchProjectTypes();

        const projectsWithChefProjet = await Promise.all(
          result.data.map(async (project: Project) => {
            if (project.chef_projet) {
              const chefProjetResponse = await fetch("/api/users/byid", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ id_user: project.chef_projet }),
              });
              const chefProjetData = await chefProjetResponse.json();

              // Trouver le type de projet correspondant
              const projectType = projectTypes.find((type: any) => type.id_type === project.project_type);

              return {
                ...project,
                chef_projet: chefProjetData.user.nom_complet,
                project_type: projectType ? projectType.type : "Type inconnu", // Remplacer l'ID par le nom du type de projet
              };
            }
            return project;
          })
        );

        setProjects(projectsWithChefProjet);
      }
    } catch (error) {
      toast.error("Erreur lors du chargement des projets");
    } finally {
      setIsLoading(false);
    }
  };

  // Récupérer les types de projets
  const fetchProjectTypes = async () => {
    try {
      const response = await fetch("/api/projectType");
      const result = await response.json();

      if (result) {
        return result;
      }
    } catch (error) {
      toast.error("Erreur lors du chargement des types de projets");
    }
  };

  // Récupérer la liste des utilisateurs
  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const result = await response.json();
      console.log("Utilisateurs récupérés:", result); // Log pour vérifier les données
      if (result) {
        setUsers(result);
      }
    } catch (error) {
      toast.error("Erreur lors du chargement des utilisateurs");
    }
  };

  // Ajouter un projet
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/projects/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout du projet");
      }

      toast.success("Projet ajouté avec succès");
      setIsPopoverOpen(false);
      fetchProjects();

      // Réinitialiser le formulaire
      setNewProject({
        project_name: "",
        project_type: "",
        partenaire: "",
        echeance: "",
        chef_projet: "",
        status: "pending", // Réinitialiser le statut
      });
    } catch (error) {
      toast.error("Erreur lors de l'ajout du projet");
    }
  };

  // Modifier un projet
  const handleEditProject = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/projects/edit", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingProject),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la modification du projet");
      }

      toast.success("Projet modifié avec succès");
      setIsEditModalOpen(false);
      fetchProjects();
    } catch (error) {
      toast.error("Erreur lors de la modification du projet");
    }
  };

  // Supprimer un projet
  const handleDeleteProject = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) return;

    try {
      const response = await fetch("/api/projects/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_projet: id }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      toast.success("Projet supprimé avec succès");
      fetchProjects();
    } catch (error) {
      toast.error("Erreur lors de la suppression du projet");
    }
  };

  // Ouvrir la modale d'édition
  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setIsEditModalOpen(true);
  };

  // Fonction pour obtenir la classe CSS en fonction du statut
  const getStatusClass = (status: string) => {
    switch (status) {
      case "done":
        return "bg-green-100 border-green-500 text-green-800";
      case "in progress":
        return "bg-orange-100 border-orange-500 text-orange-800";
      case "pending":
        return "bg-red-100 border-red-500 text-red-800";
      default:
        return "";
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white shadow-md flex items-center justify-between px-6">
          <h1 className="text-xl font-bold text-gray-800">Gestion des Projets</h1>
          <button
            onClick={() => setIsPopoverOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Nouveau Projet
          </button>
        </header>

        <main className="flex-1 p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id_projet}
                  className={`bg-white rounded-lg shadow-md p-6 relative group border-l-4 ${getStatusClass(project.status)}`}
                >
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button onClick={() => openEditModal(project)}>
                      <Pencil className="w-5 h-5 text-gray-400 hover:text-blue-500" />
                    </button>
                    <button
                      onClick={() =>
                        project.id_projet && handleDeleteProject(project.id_projet)
                      }
                    >
                      <X className="w-5 h-5 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    {project.project_name}
                  </h2>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Type:</span> {project.project_type}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Partenaire:</span> {project.partenaire}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Chef de projet:</span>{" "}
                      {project.chef_projet}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Échéance:</span> {project.echeance} jours
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Statut:</span>{" "}
                      <span className={`px-2 py-1 rounded-full ${getStatusClass(project.status)}`}>
                        {project.status}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modale d'ajout de projet */}
      {isPopoverOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Nouveau Projet</h2>
              <button onClick={() => setIsPopoverOpen(false)}>
                <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleAddProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du projet
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newProject.project_name}
                  onChange={(e) =>
                    setNewProject({ ...newProject, project_name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de projet
                </label>
                <select
                  required
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newProject.project_type}
                  onChange={(e) =>
                    setNewProject({ ...newProject, project_type: e.target.value })
                  }
                >
                  <option value="">Sélectionnez un type de projet</option>
                  {projectTypes.map((type: any) => (
                    <option key={type.id_type} value={type.id_type}>
                      {type.type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Partenaire
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newProject.partenaire}
                  onChange={(e) =>
                    setNewProject({ ...newProject, partenaire: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chef de projet
                </label>
                <select
                  required
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newProject.chef_projet}
                  onChange={(e) =>
                    setNewProject({ ...newProject, chef_projet: e.target.value })
                  }
                >
                  <option value="">Sélectionnez un chef de projet</option>
                  {users.map((user) => (
                    <option key={user.id_user} value={user.id_user}>
                      {user.nom_complet}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date d'échéance
                </label>
                <input
                  type="number"
                  required
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newProject.echeance}
                  onChange={(e) =>
                    setNewProject({ ...newProject, echeance: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Statut
                </label>
                <select
                  required
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newProject.status}
                  onChange={(e) =>
                    setNewProject({ ...newProject, status: e.target.value as "done" | "in progress" | "pending" })
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="in progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsPopoverOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Créer le projet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modale de modification de projet */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Modifier le Projet</h2>
              <button onClick={() => setIsEditModalOpen(false)}>
                <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleEditProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du projet
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={editingProject.project_name}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, project_name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de projet
                </label>
                <select
                  required
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={editingProject.project_type}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, project_type: e.target.value })
                  }
                >
                  {/* <option value="">Sélectionnez un type de projet</option> */}
                  {projectTypes.map((type: any) => (
                    <option key={type.id_type} value={type.id_type}>
                      {type.type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Partenaire
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={editingProject.partenaire}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, partenaire: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chef de projet
                </label>
                <select
                  required
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={editingProject.chef_projet}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, chef_projet: e.target.value })
                  }
                >
                  {/* <option value="">Sélectionnez un chef de projet</option> */}
                  {users.map((user) => (
                    <option key={user.id_user} value={user.id_user}>
                      {user.nom_complet}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date d'échéance
                </label>
                <input
                  type="number"
                  required
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={editingProject.echeance}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, echeance: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Statut
                </label>
                <select
                  required
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={editingProject.status}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, status: e.target.value})
                  }
                >
                  <option value="pending">En attente</option>
                  <option value="in progress">En cours</option>
                  <option value="done">Terminé</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}