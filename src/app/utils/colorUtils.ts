//Couleurs par défaut pour les utilisateurs
export const defaultColors = [
  { color: 'bg-blue-100 border-blue-200 text-blue-800', pdfColor: '#ebf8ff' },
  { color: 'bg-emerald-100 border-emerald-200 text-emerald-800', pdfColor: '#e6fffa' },
  { color: 'bg-purple-100 border-purple-200 text-purple-800', pdfColor: '#faf5ff' },
  { color: 'bg-amber-100 border-amber-200 text-amber-800', pdfColor: '#fffaf0' },
  { color: 'bg-rose-100 border-rose-200 text-rose-800', pdfColor: '#fff5f5' },
  { color: 'bg-sky-100 border-sky-200 text-sky-800', pdfColor: '#e6f7ff' },
  { color: 'bg-lime-100 border-lime-200 text-lime-800', pdfColor: '#f0fff4' }
];

// Couleurs associées aux tâches pour le PDF
export const taskColors = {
  "Développement frontend": { color: '#2b6cb0', bgColor: '#ebf8ff' },
  "Développement backend": { color: '#2c7a7b', bgColor: '#e6fffa' },
  "Design UI/UX": { color: '#6b46c1', bgColor: '#faf5ff' },
  "Réunion client": { color: '#c05621', bgColor: '#fffaf0' },
  "Tests fonctionnels": { color: '#c53030', bgColor: '#fff5f5' },
  "Revue de code": { color: '#2f855a', bgColor: '#f0fff4' },
  "Documentation": { color: '#6b46c1', bgColor: '#faf5ff' },
  "Planification sprint": { color: '#2b6cb0', bgColor: '#ebf8ff' },
  "Correction de bugs": { color: '#c53030', bgColor: '#fff5f5' },
  "Déploiement": { color: '#2c7a7b', bgColor: '#e6fffa' },
  "Formation": { color: '#c05621', bgColor: '#fffaf0' },
  "Analyse des besoins": { color: '#6b46c1', bgColor: '#faf5ff' },
  "Recherche": { color: '#2f855a', bgColor: '#f0fff4' },
  "Support client": { color: '#2b6cb0', bgColor: '#ebf8ff' },
  "Optimisation": { color: '#2c7a7b', bgColor: '#e6fffa' }
};

// Nouvelles couleurs pour les projets dans le PDF
export const projectColors = {
  "Refonte site web": { color: '#1a365d', bgColor: '#e2e8f0' },
  "Application mobile": { color: '#276749', bgColor: '#e6fffa' },
  "Dashboard analytique": { color: '#44337a', bgColor: '#e9d8fd' },
  "Plateforme e-commerce": { color: '#975a16', bgColor: '#feebc8' },
  "Système CRM": { color: '#702459', bgColor: '#fed7e2' },
  "Intranet d'entreprise": { color: '#2a4365', bgColor: '#bee3f8' },
  "API REST": { color: '#285e61', bgColor: '#b2f5ea' },
  "Développement": { color: '#2b6cb0', bgColor: '#ebf8ff' },
  "Réunion": { color: '#c05621', bgColor: '#fffaf0' },
  "Conception": { color: '#6b46c1', bgColor: '#faf5ff' },
  "Tests": { color: '#c53030', bgColor: '#fff5f5' },
  "Documentation": { color: '#2f855a', bgColor: '#f0fff4' }
};

// Conversion d'une couleur hex en RGB
export const hexToRgb = (hex: string) => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

// Vérifier si une tâche est un projet
export const isProject = (task: string): boolean => {
  return task.startsWith('Projet:') || task.includes(' - Projet');
};

// Extraire le nom du projet d'une tâche
export const extractProjectName = (task: string): string => {
  if (task.startsWith('Projet:')) {
    return task.substring(8).trim();
  } else if (task.includes(' - Projet')) {
    return task.split(' - Projet')[0].trim();
  }
  return task;
};
