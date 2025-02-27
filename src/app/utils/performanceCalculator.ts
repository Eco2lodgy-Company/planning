// types.ts
export interface PerformanceData {
    nbProjetsDifficiles: number;
    nbProjetsMoyens: number;
    nbProjetsFaciles: number;
    tempsRealisation: number; // en pourcentage (exemple: 85 pour 85%)
    problemesResolus: number; // entre 0 et 5
    qualiteCR: number; // entre 1 et 5
  }
  
  export interface PerformanceScores {
    scoreEPU: number;
    scoreTemps: number;
    scoreProblemes: number;
    scoreQualite: number;
    performanceGlobale: number;
  }
  
  export interface PerformanceReport extends PerformanceData, PerformanceScores {
    id_rapport?: number;
    id_user: number;
    mois: number;
    annee: number;
    scoreAjustement: number;
    commentaireAjustement?: string;
    created_at?: string;
    created_by: number;
    nom_complet?: string; // Pour afficher le nom de l'employé
  }
  
  // performanceCalculator.ts
  export function calculatePerformance(data: PerformanceData): PerformanceScores {
    // 1. Calcul du score EPU
    const epu = data.nbProjetsDifficiles * 1 + data.nbProjetsMoyens * (2/3) + data.nbProjetsFaciles * 0.5;
    const scoreEPU = epu >= 2 ? 100 : (epu / 2) * 100;
  
    // 2. Calcul du score de temps de réalisation
    let scoreTemps = ((150 - data.tempsRealisation) / 100) * 100;
    scoreTemps = Math.max(0, Math.min(100, scoreTemps)); // Saturation entre 0% et 100%
    
    // 3. Calcul du score de problèmes résolus
    const scoreProblemes = (data.problemesResolus / 5) * 100;
    
    // 4. Calcul du score de qualité des comptes rendus
    const scoreQualite = ((data.qualiteCR - 1) / 4) * 100;
    
    // 5. Calcul de la performance globale (moyenne des scores)
    const performanceGlobale = (scoreEPU + scoreTemps + scoreProblemes + scoreQualite) / 4;
    
    return {
      scoreEPU,
      scoreTemps,
      scoreProblemes,
      scoreQualite,
      performanceGlobale
    };
  }
  
  // Fonction pour récupérer les données nécessaires au calcul
  export async function fetchPerformanceData(userId: number, month: number, year: number, supabase: any) {
    // Calculer la plage de dates pour le mois
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    // Format des dates pour Supabase
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
  
    // 1. Récupérer les projets réalisés par l'employé durant ce mois
    const { data: projects, error: projectsError } = await supabase
      .from('taches')
      .select('niveau')
      .eq('id_user', userId)
      .eq('status', 'completed')
      .gte('created_at', startDateStr)
      .lte('created_at', endDateStr);
  
    if (projectsError) {
      throw new Error(`Erreur lors de la récupération des projets: ${projectsError.message}`);
    }
  
    // Comptage des projets par type
    const projectCounts = {
      difficiles: 0,
      moyens: 0,
      faciles: 0
    };
  
    // Supposons que project_type correspond à la difficulté (1=facile, 2=moyen, 3=difficile)
    projects.forEach((project: any) => {
      if (project.niveau === 3) projectCounts.difficiles++;
      else if (project.niveau === 2) projectCounts.moyens++;
      else if (project.niveau === 1) projectCounts.faciles++;
    });
  
    // 2. Récupération des autres métriques 
    // Note: Ces données seraient normalement stockées dans d'autres tables
    
    // Exemple: pour les besoins de la démonstration, on utilise des valeurs par défaut
    // Dans une vraie implémentation, vous récupéreriez ces valeurs depuis la base de données
    const performanceData: PerformanceData = {
      nbProjetsDifficiles: projectCounts.difficiles,
      nbProjetsMoyens: projectCounts.moyens,
      nbProjetsFaciles: projectCounts.faciles,
      tempsRealisation: 85, // Valeur par défaut: 85%
      problemesResolus: 3,  // Valeur par défaut: 3 problèmes résolus
      qualiteCR: 4          // Valeur par défaut: qualité 4/5
    };
  
    return performanceData;
  }
  
  // Fonction pour sauvegarder un rapport de performance
  export async function savePerformanceReport(report: PerformanceReport, supabase: any) {
    const { data, error } = await supabase
      .from('rapports_performance')
      .upsert({
        id_rapport: report.id_rapport,
        id_user: report.id_user,
        mois: report.mois,
        annee: report.annee,
        nb_projets_difficiles: report.nbProjetsDifficiles,
        nb_projets_moyens: report.nbProjetsMoyens,
        nb_projets_faciles: report.nbProjetsFaciles,
        temps_realisation: report.tempsRealisation,
        problemes_resolus: report.problemesResolus,
        qualite_cr: report.qualiteCR,
        score_epu: report.scoreEPU,
        score_temps: report.scoreTemps,
        score_problemes: report.scoreProblemes,
        score_qualite: report.scoreQualite,
        score_ajustement: report.scoreAjustement || 0,
        commentaire_ajustement: report.commentaireAjustement || null,
        performance_globale: report.performanceGlobale,
        created_by: report.created_by
      }, { onConflict: 'mois_annee_user_unique' })
      .select();
  
    if (error) {
      throw new Error(`Erreur lors de l'enregistrement du rapport: ${error.message}`);
    }
  
    return data;
  }