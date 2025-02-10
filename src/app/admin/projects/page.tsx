"use client";

import { useState } from "react";
import { Calendar, Home, Menu, Plus, Settings, Users, X, FileText } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const statuses = ["En cours", "Terminé", "En attente"];
const teamMembers = ["Alice", "Bob", "Charlie", "Diana", "Eve"];

export default function Projets() {
  const [projects, setProjects] = useState([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    manager: teamMembers[0],
    status: statuses[0],
    startDate: "",
  });

  const handleAddProject = () => {
    setProjects([...projects, newProject]);
    setNewProject({
      title: "",
      description: "",
      manager: teamMembers[0],
      status: statuses[0],
      startDate: "",
    });
    setIsPopoverOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white shadow-md flex items-center justify-between px-6">
          <h1 className="text-lg font-bold">Liste des Projets</h1>
          <button
            onClick={() => setIsPopoverOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <Plus /> Ajouter un Projet
          </button>
        </header>

        {/* Projects Table */}
        <main className="flex-1 p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <div key={index} className="bg-white shadow-md rounded-lg p-4">
                <h2 className="text-lg font-bold">{project.title}</h2>
                <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                <p className="text-sm font-medium">Responsable : {project.manager}</p>
                <p className="text-sm">Statut : {project.status}</p>
                <p className="text-sm">Début : {project.startDate}</p>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Popover for Adding Project */}
      {isPopoverOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Ajouter un Projet</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddProject();
              }}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="Titre du projet"
                className="w-full p-2 border rounded"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Description"
                className="w-full p-2 border rounded"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                required
              />
              <select
                className="w-full p-2 border rounded"
                value={newProject.manager}
                onChange={(e) => setNewProject({ ...newProject, manager: e.target.value })}
                required
              >
                {teamMembers.map((member, index) => (
                  <option key={index} value={member}>
                    {member}
                  </option>
                ))}
              </select>
              <select
                className="w-full p-2 border rounded"
                value={newProject.status}
                onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                required
              >
                {statuses.map((status, index) => (
                  <option key={index} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={newProject.startDate}
                onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                required
              />
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsPopoverOpen(false)}
                  className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
