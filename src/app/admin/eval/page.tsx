"use client"
// import { div } from "framer-motion/client";
// import { ToastContainer } from "react-toastify";

// export default function EVALUATION(){
//     return(
//         <div>
//               <div className="flex h-screen bg-gray-100">
//       <ToastContainer />
//       <div className="flex-1 p-8">
//       <header className=" mb-2 flex flex-col sm:flex-row items-center justify-between p-6 bg-white shadow gap-4">
//           <div className="flex items-center w-full">
//             <div className="lg:hidden w-8" /> {/* Spacer for mobile */}
//             <h2 className="text-xl font-bold text-gray-800 ml-4">Evaluation de Performance</h2>
//           </div>
//         </header>
   

//        {/* debut */}
        
// {/* fin */}
//       </div>
//     </div>
//         </div>
//     )
// }



// pages/admin/performance.tsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { PerformanceData, PerformanceReport, calculatePerformance, fetchPerformanceData, savePerformanceReport } from '@/app/utils/performanceCalculator';
import { supabase } from '@/lib/SupabaseClient';

export default function PerformanceEvaluation() {
  
  const user = useUser();
    const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [performanceScores, setPerformanceScores] = useState<any | null>(null);
  const [ajustement, setAjustement] = useState<number>(0);
  const [commentaire, setCommentaire] = useState<string>("");
  const [savedReports, setSavedReports] = useState<PerformanceReport[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');

  // Charger la liste des employés au chargement de la page
  useEffect(() => {
    async function loadEmployees() {
      const { data, error } = await supabase
        .from('users')
        .select('id_user, nom_complet')
        .order('nom_complet');

      if (!error && data) {
        setEmployees(data);
      }
    }

    loadEmployees();
  }, [supabase]);

  // Charger les rapports sauvegardés
  useEffect(() => {
    if (selectedEmployee && activeTab === 'history') {
      loadSavedReports();
    }
  }, [selectedEmployee, activeTab]);

  async function loadSavedReports() {
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('rapports_performance')
        .select(`
          id_rapport, 
          id_user, 
          mois, 
          annee, 
          nb_projets_difficiles, 
          nb_projets_moyens, 
          nb_projets_faciles,
          temps_realisation, 
          problemes_resolus, 
          qualite_cr, 
          score_epu, 
          score_temps, 
          score_problemes, 
          score_qualite,
          score_ajustement,
          commentaire_ajustement,
          performance_globale,
          created_at
        `)
        .eq('id_user', selectedEmployee)
        .order('annee', { ascending: false })
        .order('mois', { ascending: false });

      if (!error && data) {
        const reports = data.map((report: any) => ({
          id_rapport: report.id_rapport,
          id_user: report.id_user,
          mois: report.mois,
          annee: report.annee,
          nbProjetsDifficiles: report.nb_projets_difficiles,
          nbProjetsMoyens: report.nb_projets_moyens,
          nbProjetsFaciles: report.nb_projets_faciles,
          tempsRealisation: report.temps_realisation,
          problemesResolus: report.problemes_resolus,
          qualiteCR: report.qualite_cr,
          scoreEPU: report.score_epu,
          scoreTemps: report.score_temps,
          scoreProblemes: report.score_problemes,
          scoreQualite: report.score_qualite,
          scoreAjustement: report.score_ajustement,
          commentaireAjustement: report.commentaire_ajustement,
          performanceGlobale: report.performance_globale,
          created_at: report.created_at,
          created_by: user?.id || 0
        }));
        
        setSavedReports(reports);
      } else if (error) {
        console.error("Erreur lors du chargement des rapports:", error);
      }
    } finally {
      setLoading(false);
    }
  }

  // Générer un nouveau rapport
  async function generateReport() {
    if (!selectedEmployee) return;
    
    setLoading(true);
    try {
      // Récupérer les données de performance
      const data = await fetchPerformanceData(selectedEmployee, selectedMonth, selectedYear, supabase);
      setPerformanceData(data);
      
      // Calculer les scores
      const scores = calculatePerformance(data);
      setPerformanceScores(scores);
      
      // Réinitialiser l'ajustement
      setAjustement(0);
      setCommentaire("");
    } catch (error) {
      console.error("Erreur lors de la génération du rapport:", error);
      alert("Erreur lors de la génération du rapport. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  // Calculer la performance globale finale avec ajustement
  function calculateFinalPerformance() {
    if (!performanceScores) return 0;
    
    // Calculer avec l'ajustement
    const basePerformance = performanceScores.performanceGlobale;
    return Math.min(100, Math.max(0, basePerformance + ajustement));
  }

  // Sauvegarder le rapport
  async function saveReport() {
    if (!selectedEmployee || !performanceData || !performanceScores || !user) return;
    
    setLoading(true);
    try {
      const report: PerformanceReport = {
        id_user: selectedEmployee,
        mois: selectedMonth,
        annee: selectedYear,
        nbProjetsDifficiles: performanceData.nbProjetsDifficiles,
        nbProjetsMoyens: performanceData.nbProjetsMoyens,
        nbProjetsFaciles: performanceData.nbProjetsFaciles,
        tempsRealisation: performanceData.tempsRealisation,
        problemesResolus: performanceData.problemesResolus,
        qualiteCR: performanceData.qualiteCR,
        scoreEPU: performanceScores.scoreEPU,
        scoreTemps: performanceScores.scoreTemps,
        scoreProblemes: performanceScores.scoreProblemes,
        scoreQualite: performanceScores.scoreQualite,
        scoreAjustement: ajustement,
        commentaireAjustement: commentaire,
        performanceGlobale: calculateFinalPerformance(),
        created_by: user.id
      };
      
      await savePerformanceReport(report, supabase);
      alert("Rapport sauvegardé avec succès!");
      
      // Recharger les rapports sauvegardés
      setActiveTab('history');
      loadSavedReports();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du rapport:", error);
      alert("Erreur lors de la sauvegarde du rapport. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  // Exporter le rapport en PDF
  function exportToPDF(report: PerformanceReport) {
    const doc = new jsPDF();
    const employeeName = employees.find(emp => emp.id_user === report.id_user)?.nom_complet || 'Employé(e)';
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const monthName = months[report.mois - 1];

    // Titre
    doc.setFontSize(18);
    doc.text(`Rapport de Performance Mensuelle`, 105, 20, { align: 'center' });
    
    // Informations générales
    doc.setFontSize(12);
    doc.text(`Employé(e): ${employeeName}`, 20, 35);
    doc.text(`Période: ${monthName} ${report.annee}`, 20, 42);
    doc.text(`Date de génération: ${new Date().toLocaleDateString()}`, 20, 49);
    
    // Projets réalisés
    doc.setFontSize(14);
    doc.text(`Projets réalisés`, 20, 60);
    doc.setFontSize(12);
    doc.text(`Projets difficiles: ${report.nbProjetsDifficiles}`, 30, 68);
    doc.text(`Projets moyens: ${report.nbProjetsMoyens}`, 30, 75);
    doc.text(`Projets faciles: ${report.nbProjetsFaciles}`, 30, 82);
    
    // Métriques
    doc.setFontSize(14);
    doc.text(`Métriques de performance`, 20, 95);
    doc.setFontSize(12);
    doc.text(`Temps de réalisation: ${report.tempsRealisation}%`, 30, 103);
    doc.text(`Problèmes résolus: ${report.problemesResolus}/5`, 30, 110);
    doc.text(`Qualité des comptes rendus: ${report.qualiteCR}/5`, 30, 117);
    
    // Tableau des scores
    (doc as any).autoTable({
      startY: 130,
      head: [['Indicateur', 'Score']],
      body: [
        ['Couverture des projets (EPU)', `${report.scoreEPU.toFixed(1)}%`],
        ['Temps de réalisation', `${report.scoreTemps.toFixed(1)}%`],
        ['Problèmes résolus', `${report.scoreProblemes.toFixed(1)}%`],
        ['Qualité des comptes rendus', `${report.scoreQualite.toFixed(1)}%`],
        ['Ajustement', `${report.scoreAjustement.toFixed(1)}%`],
        ['Performance globale', `${report.performanceGlobale.toFixed(1)}%`],
      ],
    });
    
    // Commentaire d'ajustement
    if (report.commentaireAjustement) {
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFontSize(14);
      doc.text('Commentaire d\'ajustement', 20, finalY);
      doc.setFontSize(12);
      
      const splitText = doc.splitTextToSize(report.commentaireAjustement, 170);
      doc.text(splitText, 20, finalY + 8);
    }
    
    // Pied de page
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Page ${i} sur ${pageCount}`, 105, 285, { align: 'center' });
    }
    
    doc.save(`rapport_performance_${employeeName}_${monthName}_${report.annee}.pdf`);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Évaluation de Performance des Employés</h1>
      
      {/* Sélection de l'employé */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Sélectionner un employé</label>
        <select 
          className="w-full p-2 border rounded"
          value={selectedEmployee || ''}
          onChange={(e) => setSelectedEmployee(Number(e.target.value))}
        >
          <option value="">Sélectionner un employé</option>
          {employees.map((emp) => (
            <option key={emp.id_user} value={emp.id_user}>
              {emp.nom_complet}
            </option>
          ))}
        </select>
      </div>
      
      {selectedEmployee && (
        <div className="mb-6">
          <div className="flex border-b">
            <button 
              className={`px-4 py-2 ${activeTab === 'new' ? 'border-b-2 border-blue-500 text-blue-500' : ''}`}
              onClick={() => setActiveTab('new')}
            >
              Nouveau rapport
            </button>
            <button 
              className={`px-4 py-2 ${activeTab === 'history' ? 'border-b-2 border-blue-500 text-blue-500' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              Historique
            </button>
          </div>
          
          {activeTab === 'new' ? (
            <div className="mt-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Mois</label>
                  <select 
                    className="w-full p-2 border rounded"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
                      <option key={month} value={month}>
                        {new Date(2000, month - 1, 1).toLocaleString('fr-FR', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Année</label>
                  <select 
                    className="w-full p-2 border rounded"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                  >
                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <button 
                className="mb-6 px-4 py-2 bg-blue-500 text-white rounded"
                onClick={generateReport}
                disabled={loading}
              >
                {loading ? 'Chargement...' : 'Générer le rapport'}
              </button>
              
              {performanceData && performanceScores && (
                <div className="bg-gray-50 p-4 rounded-lg shadow mb-6">
                  <h2 className="text-xl font-semibold mb-4">Résultats de performance</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Projets réalisés</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div>Projets difficiles:</div>
                        <div>{performanceData.nbProjetsDifficiles}</div>
                        <div>Projets moyens:</div>
                        <div>{performanceData.nbProjetsMoyens}</div>
                        <div>Projets faciles:</div>
                        <div>{performanceData.nbProjetsFaciles}</div>
                        <div>EPU total:</div>
                        <div>
                          {(
                            performanceData.nbProjetsDifficiles * 1 + 
                            performanceData.nbProjetsMoyens * (2/3) + 
                            performanceData.nbProjetsFaciles * 0.5
                          ).toFixed(2)}
                        </div>
                      </div>
                      
                      <h3 className="font-semibold text-lg mt-4 mb-2">Autres métriques</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div>Temps de réalisation:</div>
                        <div>{performanceData.tempsRealisation}%</div>
                        <div>Problèmes résolus:</div>
                        <div>{performanceData.problemesResolus}/5</div>
                        <div>Qualité des CR:</div>
                        <div>{performanceData.qualiteCR}/5</div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Scores calculés</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div>Score EPU:</div>
                        <div>{performanceScores.scoreEPU.toFixed(1)}%</div>
                        <div>Score Temps:</div>
                        <div>{performanceScores.scoreTemps.toFixed(1)}%</div>
                        <div>Score Problèmes:</div>
                        <div>{performanceScores.scoreProblemes.toFixed(1)}%</div>
                        <div>Score Qualité CR:</div>
                        <div>{performanceScores.scoreQualite.toFixed(1)}%</div>
                      </div>
                      
                      <div className="mt-4 border-t pt-4">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="font-semibold">Performance base:</div>
                          <div className="font-semibold">{performanceScores.performanceGlobale.toFixed(1)}%</div>
                        </div>
                        
                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-2">
                            Ajustement de performance (%)
                          </label>
                          <input 
                            type="number" 
                            className="w-full p-2 border rounded"
                            value={ajustement}
                            onChange={(e) => setAjustement(Number(e.target.value))}
                            min="-20"
                            max="20"
                            step="1"
                          />
                        </div>
                        
                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-2">
                            Commentaire d'ajustement
                          </label>
                          <textarea 
                            className="w-full p-2 border rounded"
                            value={commentaire}
                            onChange={(e) => setCommentaire(e.target.value)}
                            rows={3}
                          />
                        </div>
                        
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <div className="font-bold text-lg">Performance finale:</div>
                          <div className="font-bold text-lg">
                            {calculateFinalPerformance().toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <button 
                      className="px-4 py-2 bg-green-500 text-white rounded"
                      onClick={saveReport}
                      disabled={loading}
                    >
                      {loading ? 'Enregistrement...' : 'Enregistrer le rapport'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-4">Historique des rapports</h2>
              
              {loading ? (
                <p>Chargement des rapports...</p>
              ) : savedReports.length === 0 ? (
                <p>Aucun rapport disponible pour cet employé.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 border">Période</th>
                        <th className="p-2 border">EPU Total</th>
                        <th className="p-2 border">Performance</th>
                        <th className="p-2 border">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {savedReports.map((report) => {
                        const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
                        const period = `${months[report.mois - 1]} ${report.annee}`;
                        const epu = (
                          report.nbProjetsDifficiles * 1 + 
                          report.nbProjetsMoyens * (2/3) + 
                          report.nbProjetsFaciles * 0.5
                        ).toFixed(2);
                        
                        return (
                          <tr key={report.id_rapport}>
                            <td className="p-2 border">{period}</td>
                            <td className="p-2 border">{epu}</td>
                            <td className="p-2 border">{report.performanceGlobale.toFixed(1)}%</td>
                            <td className="p-2 border">
                              <button 
                                className="mr-2 px-3 py-1 bg-blue-500 text-white rounded"
                                onClick={() => exportToPDF(report)}
                              >
                                Exporter PDF
                              </button>
                              <button 
                                className="px-3 py-1 bg-gray-500 text-white rounded"
                                onClick={() => {
                                  // Réutiliser le rapport pour modification
                                  setActiveTab('new');
                                  setPerformanceData({
                                    nbProjetsDifficiles: report.nbProjetsDifficiles,
                                    nbProjetsMoyens: report.nbProjetsMoyens,
                                    nbProjetsFaciles: report.nbProjetsFaciles,
                                    tempsRealisation: report.tempsRealisation,
                                    problemesResolus: report.problemesResolus,
                                    qualiteCR: report.qualiteCR
                                  });
                                  setPerformanceScores({
                                    scoreEPU: report.scoreEPU,
                                    scoreTemps: report.scoreTemps,
                                    scoreProblemes: report.scoreProblemes,
                                    scoreQualite: report.scoreQualite,
                                    performanceGlobale: (report.scoreEPU + report.scoreTemps + report.scoreProblemes + report.scoreQualite) / 4
                                  });
                                  setAjustement(report.scoreAjustement);
                                  setCommentaire(report.commentaireAjustement || "");
                                  setSelectedMonth(report.mois);
                                  setSelectedYear(report.annee);
                                }}
                              >
                                Modifier
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


function  useUser() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

      return () => {
        authListener?.subscription.unsubscribe();
      };
    };

    fetchData();
  }, []);

  return user;
}
