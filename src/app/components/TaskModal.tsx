
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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

interface TaskModalProps {
  show: boolean;
  onClose: () => void;
  employee: string;
  day: {
    label: string;
    formattedDate: string;
    date: Date;
  };
  tasks: Task[];
  selectedTask: string;
  onSelectTask: (task: string) => void;
  onAddTask: () => void;
}

// Liste fictive de projets pour l'exemple
const projects = [
  "Refonte site web",
  "Application mobile",
  "Dashboard analytique",
  "Plateforme e-commerce",
  "Système CRM",
  "Intranet d'entreprise",
  "API REST"
];

export const TaskModal = ({
  show,
  onClose,
  employee,
  day,
  tasks,
  selectedTask,
  onSelectTask,
  onAddTask
}: TaskModalProps) => {
  if (!show) return null;

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-800">
            Ajouter une activité
          </DialogTitle>
          <div className="text-sm text-slate-500 mt-1">
            <div>{employee}</div>
            <div>
              {format(day.date, 'EEEE dd MMMM yyyy', { locale: fr })}
            </div>
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="tasks">Tâches</TabsTrigger>
            <TabsTrigger value="projects">Projets</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tasks" className="py-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Sélectionner une tâche
            </label>
            <Select
              value={selectedTask}
              onValueChange={onSelectTask}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisir une tâche" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(tasks) && tasks.map((task) => (
                  <SelectItem key={task.id_tache} value={task.libelle}>
                    {task.libelle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TabsContent>
          
          <TabsContent value="projects" className="py-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Sélectionner un projet
            </label>
            <Select
              onValueChange={(value) => onSelectTask(`Projet: ${value}`)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisir un projet" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project, index) => (
                  <SelectItem key={index} value={project}>
                    {project}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Type d'activité sur le projet
              </label>
              <Select
                onValueChange={(value) => onSelectTask(`${value} - Projet`)}
                defaultValue="Développement"
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Type d'activité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Développement">Développement</SelectItem>
                  <SelectItem value="Réunion">Réunion</SelectItem>
                  <SelectItem value="Conception">Conception</SelectItem>
                  <SelectItem value="Tests">Tests</SelectItem>
                  <SelectItem value="Documentation">Documentation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={onAddTask} disabled={!selectedTask}>
            Ajouter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
