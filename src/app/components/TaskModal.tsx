"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Task {
  id_tache: number;
  libelle: string;
  niveau: number;
  id_user: number;
  id_projet: number;
  echeance: number;
  datedebut: string;
  status: string;
  nom_departement: string;
  priorite: number;
}

interface Project {
  id_projet: number;
  project_name: string;
  project_type: number;
  partenaire: string;
  echeance: number;
  chef_projet: number;
  created_at: string;
  status: string;
  departement: number;
}

interface TaskModalProps {
  show: boolean;
  onClose: () => void;
  nameUser: string;
  employee: number;
  day: {
    label: string;
    formattedDate: string;
    date: Date;
  };
  tasks: Task[];
  selectedTask: number | null;
  onSelectTask: (taskId: number) => void;
  onAddTask: () => void;
  OnAddProject: () => void;
}

// Types d'activités disponibles pour les projets
const projectActivities = [
  "Développement",
  "Réunion",
  "Conception",
  "Tests",
  "Documentation"
];

export const TaskModal = ({
  show,
  onClose,
  employee,
  nameUser,
  day,
  tasks,
  selectedTask,
  onSelectTask,
  onAddTask,
  OnAddProject,
}: TaskModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [activityType, setActivityType] = useState("Développement");
  const [activeTab, setActiveTab] = useState("tasks");
  const [isLoading, setIsLoading] = useState(false);
  
  // Récupérer la liste des projets depuis l'API
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des projets");
        }
        const result = await response.json();
        setProjects(Array.isArray(result.data) ? result.data : []);
      } catch (error) {
        console.error("Erreur:", error);
        toast.error("Impossible de charger les projets");
      } finally {
        setIsLoading(false);
      }
    };

    if (show) {
      fetchProjects();
    }
  }, [show]);

  const handleSubmit = () => {
    if (activeTab === "tasks" && selectedTask) {
      // Attribution d'une tâche existante
      onAddTask();
    } else if (activeTab === "projects" && selectedProject) {
      // Attribution d'un projet
      handleProjectAssignment();
    }
  };

  const handleProjectAssignment = async () => {
    if (!selectedProject) return;
    
    setIsSubmitting(true);
    try {
      const formattedDate = format(day.date, 'yyyy-MM-dd');
      console.log(employee)
      const response = await fetch('/api/projects/attribution', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chef_projet: employee, 
          datedebut: formattedDate,
          id_projet: selectedProject,
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        toast.success("Projet assigné avec succès");
        OnAddProject();
        onClose();
      } else {
        toast.error(`Erreur: ${result.error || 'Problème lors de l\'attribution'}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur de communication avec le serveur");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  if (!show) return null;

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-800">
            Ajouter une activité
          </DialogTitle>
          <div className="text-sm text-slate-500 mt-1">
            <div>{nameUser}</div>
            <div>
              {format(day.date, 'EEEE dd MMMM yyyy', { locale: fr })}
            </div>
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="tasks" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="tasks">Tâches</TabsTrigger>
            <TabsTrigger value="projects">Projets</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tasks" className="py-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Sélectionner une tâche existante
            </label>
            <Select
              value={selectedTask ? selectedTask.toString() : ""}
              onValueChange={(value) => onSelectTask(parseInt(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisir une tâche" />
              </SelectTrigger>
              <SelectContent>
                {isLoading ? (
                  <SelectItem value="loading" disabled>Chargement...</SelectItem>
                ) : tasks.length > 0 ? (
                  tasks.map((task) => (
                    <SelectItem key={task.id_tache} value={task.id_tache.toString()}>
                      {task.libelle}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>Aucune tâche disponible</SelectItem>
                )}
              </SelectContent>
            </Select>
          </TabsContent>
          
          <TabsContent value="projects" className="py-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Sélectionner un projet existant
            </label>
            <Select
              value={selectedProject ? selectedProject.toString() : ""}
              onValueChange={(value) => setSelectedProject(parseInt(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisir un projet" />
              </SelectTrigger>
              <SelectContent>
                {isLoading ? (
                  <SelectItem value="loading" disabled>Chargement...</SelectItem>
                ) : projects.length > 0 ? (
                  projects.map((project) => (
                    <SelectItem key={project.id_projet} value={project.id_projet.toString()}>
                      {project.project_name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>Aucun projet disponible</SelectItem>
                )}
              </SelectContent>
            </Select>
            
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={(activeTab === "tasks" && !selectedTask) || 
                    (activeTab === "projects" && !selectedProject) || 
                    isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? "Attribution..." : "Ajouter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
