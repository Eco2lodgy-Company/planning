'use client';
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, FileText } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProjectsPage() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
    
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  //appel api pour recuperer les projets

  useEffect(() => {
    const userIdd = localStorage.getItem('userId');
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/headside/projets/listes/'+userIdd);
        if (!response.ok) throw new Error('Erreur lors de la récupération des informations');
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  },[]);


  const handleMarkAsCompleted = async (id) => {
    const newStatus = "done"; // Valeur du nouveau statut
  
    try {
      // Envoi de la requête PUT à l'endpoint
      const response = await fetch(`/api/headside/projets/listes/modify/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newStatus: newStatus,
        }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.error || "Erreur lors de la mise à jour du statut");
      }
  
      // Mise à jour locale de l'état des projets
      setProjects((prev) =>
        prev.map((project) =>
          project.id_projet === id ? { ...project, status: newStatus } : project
        )
      );
  
      toast.success("Le projet a été marqué comme terminé", {
        description: `Le projet ${id} a été mis à jour.`,
      });
    } catch (error) {
      toast.error("Échec de la mise à jour", {
        description: error.message,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-transparent">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between p-6 bg-white shadow">
          <h2 className="text-xl font-bold text-gray-800">Projets en Cours</h2>
        </header>

        {/* Main Section */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex-1 p-6 overflow-y-auto"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
            {projects.map((project) => (
              <div
                key={project.id_projet}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <FileText size={24} className="text-gray-500" />
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">{project.project_name}</span>
                    <span className={`text-sm ${project.status === 'done' ? 'text-green-500' : 'text-yellow-500'}`}>
                      {project.status}
                    </span>
                  </div>
                </div>
                {project.status !== 'Terminé' && (
                  <motion.button
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                    onClick={() => handleMarkAsCompleted(project.id_projet)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <CheckCircle size={20} />
                  </motion.button>
                )}
              </div>
            ))}
          </div>
        </motion.main>
      </div>
      <ToastContainer />

    </div>
  );
}
