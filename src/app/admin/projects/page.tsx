"use client"
import React, { useState, useEffect } from "react";
import { Plus, X, Pencil } from "lucide-react";
import { toast } from "sonner";

interface Project {
  id_projet?: number;
  project_name: string;
  project_type: number; 
  partenaire: string;
  departement: string;
  echeance: string;
  chef_projet: number;
  status: string;
}

// Add these interfaces for the detailed project data
interface ProjectDetails {
  id_projet: number;
  project_name: string;
  project_type: string; // This will hold the type name
  project_type_id?: number; // This will hold the type ID
  partenaire: string;
  departement: string;
  departement_id?: number;
  echeance: string;
  chef_projet: string; // This will hold the user name
  chef_projet_id?: number; // This will hold the user ID
  status: string;
}

interface User {
  id_user: string;
  nom_complet: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<ProjectDetails[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [projectTypes, setProjectTypes] = useState<any[]>([]);
  const [Departement, setDepartement] = useState<any[]>([]);

  const [newProject, setNewProject] = useState<Project>({
    project_name: "",
    project_type: 0,
    partenaire: "",
    echeance: "",
    departement: "",
    chef_projet: 0,
    status: "pending",
  });

  const [editingProject, setEditingProject] = useState<Project>({
    id_projet: 0,
    project_name: "",
    departement: "",
    project_type: 0,
    partenaire: "",
    echeance: "",
    chef_projet: 0,
    status: "pending",
  });

  useEffect(() => {
    fetchProjects();
    fetchUsers();
    fetchProjectTypes().then((types) => setProjectTypes(types));
    fetchDepartement().then((dep) => setDepartement(dep));
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects/details");
      const result = await response.json();
  
      if (result.data) {
        // Transform the data to include both IDs and display values
        const transformedData = result.data.map((project: any) => {
          // Find matching records to get IDs
          const matchingType = projectTypes.find(t => t.type === project.project_type);
          const matchingUser = users.find(u => u.nom_complet === project.chef_projet);
          const matchingDept = Departement.find(d => d.titre === project.departement);

          return {
            ...project,
            project_type_id: matchingType?.id_type,
            chef_projet_id: matchingUser?.id_user,
            departement_id: matchingDept?.id
          };
        });
        setProjects(transformedData);
      }
    } catch (error) {
      toast.error("Erreur lors du chargement des projets");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProjectTypes = async () => {
    try {
      const response = await fetch("/api/projectType");
      const result = await response.json();
      return result;
    } catch (error) {
      toast.error("Erreur lors du chargement des types de projets");
    }
  };

  const fetchDepartement = async () => {
    try {
      const response = await fetch("/api/departement");
      const result = await response.json();
      return result;
    } catch (error) {
      toast.error("Erreur lors du chargement des Departement");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const result = await response.json();
      if (result) {
        setUsers(result);
      }
    } catch (error) {
      toast.error("Erreur lors du chargement des utilisateurs");
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/projects/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newProject,
          project_type: Number(newProject.project_type),
          chef_projet: Number(newProject.chef_projet),
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout du projet");
      }

      toast.success("Projet ajouté avec succès");
      setIsPopoverOpen(false);
      fetchProjects();

      setNewProject({
        project_name: "",
        project_type: 0,
        partenaire: "",
        echeance: "",
        departement: "",
        chef_projet: 0,
        status: "pending",
      });
    } catch (error) {
      toast.error("Erreur lors de l'ajout du projet");
    }
  };

  const handleEditProject = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch("/api/projects/edit", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_projet: editingProject.id_projet,
          project_name: editingProject.project_name,
          project_type: editingProject.project_type,
          partenaire: editingProject.partenaire,
          echeance: editingProject.echeance,
          chef_projet: editingProject.chef_projet,
          status: editingProject.status,
          departement: editingProject.departement,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la modification du projet");
      }
  
      toast.success("Projet modifié avec succès");
      setIsEditModalOpen(false);
      fetchProjects();
    } catch (error) {
      toast.error("Erreur lors de la modification du projet");
    }
  };

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

  const openEditModal = (project: ProjectDetails) => {
    // Find the corresponding IDs based on the display values
    const typeId = projectTypes.find(t => t.type === project.project_type)?.id_type;
    const userId = users.find(u => u.nom_complet === project.chef_projet)?.id_user;
    const deptId = Departement.find(d => d.titre === project.departement)?.id;

    setEditingProject({
      id_projet: project.id_projet,
      project_name: project.project_name,
      project_type: typeId || 0,
      partenaire: project.partenaire,
      echeance: project.echeance,
      chef_projet: Number(userId) || 0,
      status: project.status,
      departement: deptId || "",
    });
    setIsEditModalOpen(true);
  };

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
  const translateStatus = (status: string): string => {
    switch (status) {
      case "pending":
        return "En attente";
      case "in progress":
        return "En cours";
      case "done":
        return "Terminé";
      default:
        return status; // Retourne le statut original si non trouvé
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col">
        <header className="flex flex-col sm:flex-row items-center mb-2 justify-between p-6 bg-white shadow gap-4">
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
                    <button onClick={() => handleDeleteProject(project.id_projet)}>
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
                      {translateStatus(project.status)}
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
                    setNewProject({ ...newProject, project_type: Number(e.target.value) })
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
                  Departement
                </label>
                <select
                  required
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newProject.departement}
                  onChange={(e) =>
                    setNewProject({ ...newProject, departement: e.target.value })
                  }
                >
                  <option value="">Sélectionnez un departement</option>
                  {Departement.map((dep: any) => (
                    <option key={dep.id} value={dep.id}>
                      {dep.titre}
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
                    setNewProject({ ...newProject, chef_projet: Number(e.target.value) })
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
                    setEditingProject({ ...editingProject, project_type: Number(e.target.value) })
                  }
                >
                  {projectTypes.map((type: any) => (
                    <option key={type.id_type} value={type.id_type}>
                      {type.type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Département
                </label>
                <select
                  required
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={editingProject.departement}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, departement: e.target.value })
                  }
                >
                  {Departement.map((dep: any) => (
                    <option key={dep.id} value={dep.id}>
                      {dep.titre}
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
                    setEditingProject({ ...editingProject, chef_projet: Number(e.target.value) })
                  }
                >
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
                    setEditingProject({ ...editingProject, status: e.target.value })
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