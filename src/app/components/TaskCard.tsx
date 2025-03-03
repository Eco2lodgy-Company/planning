
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: string;
}

// Fonction pour générer une couleur de fond cohérente basée sur le nom de la tâche
const getTaskColor = (task: string): string => {
  // Tableau de couleurs pastel
  const colorClasses = [
    'bg-blue-100 border-blue-200 text-blue-800',
    'bg-emerald-100 border-emerald-200 text-emerald-800',
    'bg-purple-100 border-purple-200 text-purple-800',
    'bg-amber-100 border-amber-200 text-amber-800',
    'bg-rose-100 border-rose-200 text-rose-800',
    'bg-cyan-100 border-cyan-200 text-cyan-800',
    'bg-lime-100 border-lime-200 text-lime-800',
  ];
  
  // Correspondance directe des tâches avec des couleurs pour la cohérence
  const taskColorMap: {[key: string]: string} = {
    "Développement frontend": colorClasses[0],
    "Développement backend": colorClasses[1],
    "Design UI/UX": colorClasses[2],
    "Réunion client": colorClasses[3],
    "Tests fonctionnels": colorClasses[4],
    "Revue de code": colorClasses[5],
    "Documentation": colorClasses[2],
    "Planification sprint": colorClasses[0],
    "Correction de bugs": colorClasses[4],
    "Déploiement": colorClasses[1],
    "Formation": colorClasses[3],
    "Analyse des besoins": colorClasses[2],
    "Recherche": colorClasses[5],
    "Support client": colorClasses[0],
    "Optimisation": colorClasses[1],
  };
  
  // Retourner la couleur mappée ou utiliser une fonction de hachage pour les tâches inconnues
  if (taskColorMap[task]) {
    return taskColorMap[task];
  }
  
  // Utilisation d'une fonction de hachage simple pour obtenir un index basé sur le texte
  const hashString = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash; // Conversion en entier 32 bits
    }
    return Math.abs(hash) % colorClasses.length;
  };
  
  return colorClasses[hashString(task)];
};

export const TaskCard = ({ task }: TaskCardProps) => {
  const colorClass = getTaskColor(task);
  
  return (
    <div 
      className={cn(
        'p-2 rounded-md text-sm font-medium border',
        'transition-all duration-200 transform hover:scale-[1.02]',
        'shadow-sm hover:shadow',
        colorClass
      )}
    >
      {task}
    </div>
  );
};
