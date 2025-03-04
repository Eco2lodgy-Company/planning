// Types utilisés dans le planning
export interface User {
    id_user: number;
    nom_complet: string;
    color?: string;
    pdfColor?: string;
  }
  
  export interface Task {
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
  
  export interface Project {
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
  
  // Type pour les tâches assignées
  export interface AssignedTasks {
    [key: string]: Task[];
  }
  
  // Type pour les projets assignés
  export interface AssignedProjects {
    [key: string]: Project[];
  }
  
  export interface DayInfo {
    date: Date;
    label: string;
    formattedDate: string;
    isWeekend: boolean;
  }
  
  export interface ModalData {
    employeeId: number | null;
    day: DayInfo | null;
  }
  