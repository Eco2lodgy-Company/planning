// "use client"
// import { useState, useEffect, useMemo, StrictMode, Suspense } from "react";
// import { format, startOfWeek, addDays, parseISO, isSameDay, isWithinInterval, isBefore } from "date-fns";
// import { fr } from "date-fns/locale";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { toast } from "sonner";
// import { ToastContainer } from "react-toastify";
// import dynamic from "next/dynamic";

// // Lazy-loaded components
// const TaskModal = dynamic(() => import("./TaskModal"), {
//   loading: () => <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//     <div className="bg-white p-8 rounded-lg shadow-md">
//       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//       <p className="text-center mt-4">Chargement du formulaire...</p>
//     </div>
//   </div>,
//   ssr: false,
// });

// interface Task {
//   id_tache: number;
//   libelle: string;
//   niveau: number;
//   id_user: number | null;
//   id_projet: number | null;
//   echeance: number;
//   datedebut: string;
//   status: string;
//   departement: number | null;
//   priorite: number;
// }

// interface User {
//   id_user: number;
//   nom_complet: string;
// }

// interface Project {
//   id_projet: number;
//   project_name: string;
// }

// interface Department {
//   id: number;
//   titre: string;
// }

// interface TaskWithDates extends Task {
//   endDate: Date;
// }

// const getDifficultyLabel = (niveau: number): string => {
//   switch (niveau) {
//     case 1:
//       return "Facile";
//     case 2:
//       return "Moyen";
//     case 3:
//       return "Difficile";
//     default:
//       return "Inconnu";
//   }
// };

// const getPriorityLabel = (priorite: number): string => {
//   switch (priorite) {
//     case 1:
//       return "Basse";
//     case 2:
//       return "Moyenne";
//     case 3:
//       return "Élevée";
//     default:
//       return "Inconnue";
//   }
// };

// // Task list component for each day
// const DayTaskList = ({ day, tasks, users, projects, departments }: { 
//   day: Date, 
//   tasks: TaskWithDates[],
//   users: User[],
//   projects: Project[],
//   departments: Department[]
// }) => {
//   // Fonctions pour récupérer les noms au lieu des IDs
//   const getUserName = (userId: number | null) => {
//     if (!userId) return "Non assigné";
//     const user = users.find(user => user.id_user === userId);
//     return user ? user.nom_complet : "Utilisateur inconnu";
//   };

//   const getProjectName = (projectId: number | null) => {
//     if (!projectId) return "Sans projet";
//     const project = projects.find(project => project.id_projet === projectId);
//     return project ? project.project_name : "Projet inconnu";
//   };

//   const getDepartmentName = (departmentId: number | null) => {
//     if (!departmentId) return "Sans département";
//     const department = departments.find(dept => dept.id === departmentId);
//     return department ? department.titre : "Département inconnu";
//   };
  
//   const getPriorityColor = (niveau: number) => {
//     switch (niveau) {
//       case 3:
//         return "bg-red-100 border-red-200";
//       case 2:
//         return "bg-orange-100 border-orange-200";
//       default:
//         return "bg-green-100 border-green-200";
//     }
//   };

//   const getStatusColor = (status: string) => {
//     const lowerStatus = status.toLowerCase();
//     switch (lowerStatus) {
//       case "done":
//         return "bg-green-500";
//       case "in_progress":
//       case "en cours":
//         return "bg-blue-500";
//       default:
//         return "bg-yellow-500";
//     }
//   };
  
//   const getRemainingDays = (task: TaskWithDates, currentDate: Date) => {
//     try {
//       const startDate = parseISO(task.datedebut);
//       let remainingDays = task.echeance;
//       let tempDate = startDate;
      
//       while (isBefore(tempDate, currentDate)) {
//         const dayOfWeek = tempDate.getDay();
//         if (dayOfWeek !== 0 && dayOfWeek !== 6) {
//           remainingDays--;
//         }
//         tempDate = addDays(tempDate, 1);
//       }
      
//       return remainingDays;
//     } catch (error) {
//       console.error("Error calculating remaining days:", error);
//       return 0;
//     }
//   };
  
//   return (
//     <div className="p-2 border-r min-h-[120px] relative">
//       <div className="space-y-2">
//         {tasks.length === 0 ? (
//           <div className="text-gray-400 text-sm italic text-center mt-4">
//             Aucune tâche
//           </div>
//         ) : (
//           tasks.map((task) => {
//             try {
//               const remainingDays = getRemainingDays(task, day);
//               if (remainingDays <= 0) return null;

//               return (
//                 <div
//                   key={task.id_tache}
//                   className={`p-2 rounded border ${getPriorityColor(task.niveau)}`}
//                 >
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm font-medium">{task.libelle}</span>
//                     <span
//                       className={`w-2 h-2 rounded-full ${getStatusColor(task.status)}`}
//                     />
//                   </div>
//                   <span className="text-xs text-gray-500 block mt-1">
//                     Assigné à: {getUserName(task.id_user)}
//                   </span>
//                   <span className="text-xs text-gray-500 block">
//                     Projet: {getProjectName(task.id_projet)}
//                   </span>
//                   <span className="text-xs text-gray-500 block">
//                     Département: {getDepartmentName(task.departement)}
//                   </span>
//                   <span className="text-xs text-gray-500 block">
//                     Difficulté: {getDifficultyLabel(task.niveau)}
//                   </span>
//                   <span className="text-xs text-gray-500 block">
//                     Priorité: {getPriorityLabel(task.priorite)}
//                   </span>
//                   <span className="text-xs text-gray-500 block">
//                     {remainingDays} jour{remainingDays > 1 ? 's' : ''} restant{remainingDays > 1 ? 's' : ''}
//                   </span>
//                 </div>
//               );
//             } catch (error) {
//               console.error("Error rendering task:", error);
//               return null;
//             }
//           })
//         )}
//       </div>
//     </div>
//   );
// };

// export default function Calendar() {
//   const [currentWeek, setCurrentWeek] = useState(new Date());
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [users, setUsers] = useState<User[]>([]);
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [departments, setDepartments] = useState<Department[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
//   const [newTask, setNewTask] = useState({
//     libelle: "",
//     niveau: 1,
//     id_projet: 0,
//     echeance: 1,
//     datedebut: "",
//     status: "pending",
//     departement: 0,
//     priorite: 1,
//     id_user: 0,
//   });
//   const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
//   const [dataLoaded, setDataLoaded] = useState({
//     users: false,
//     projects: false,
//     departments: false,
//     tasks: false
//   });

//   // Lazy data loading with individual loading states
//   const fetchUsers = async () => {
//     try {
//       const response = await fetch("/api/users");
//       const result = await response.json();
//       if (response.ok) {
//         setUsers(result);
//       } else {
//         console.error("Erreur lors de la récupération des utilisateurs:", result.message);
//       }
//       setDataLoaded(prev => ({ ...prev, users: true }));
//     } catch (error) {
//       console.error("Erreur réseau lors de la récupération des utilisateurs:", error);
//       setDataLoaded(prev => ({ ...prev, users: true }));
//     }
//   };

//   const fetchProjects = async () => {
//     try {
//       const response = await fetch("/api/projects");
//       const result = await response.json();
//       if (response.ok) {
//         setProjects(result.data);
//       } else {
//         console.error("Erreur lors de la récupération des projets:", result.message);
//       }
//       setDataLoaded(prev => ({ ...prev, projects: true }));
//     } catch (error) {
//       console.error("Erreur réseau lors de la récupération des projets:", error);
//       setDataLoaded(prev => ({ ...prev, projects: true }));
//     }
//   };

//   const fetchDepartments = async () => {
//     try {
//       const response = await fetch("/api/departement");
//       const result = await response.json();
//       if (response.ok) {
//         setDepartments(result);
//       } else {
//         console.error("Erreur lors de la récupération des départements:", result.message);
//       }
//       setDataLoaded(prev => ({ ...prev, departments: true }));
//     } catch (error) {
//       console.error("Erreur réseau lors de la récupération des départements:", error);
//       setDataLoaded(prev => ({ ...prev, departments: true }));
//     }
//   };

//   const fetchTasks = async () => {
//     try {
//       setIsLoading(true);
//       const response = await fetch("/api/tache");
//       const result = await response.json();
//       if (response.ok) {
//         setTasks(Array.isArray(result.data) ? result.data : []);
//       } else {
//         setError("Erreur lors de la récupération des tâches.");
//         toast.error("Erreur lors de la récupération des tâches.");
//       }
//     } catch (error) {
//       setError("Erreur lors de la récupération des données.");
//       toast.error("Erreur lors de la récupération des données.");
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//       setDataLoaded(prev => ({ ...prev, tasks: true }));
//     }
//   };

//   useEffect(() => {
//     // Staggered loading to prevent blocking the UI
//     fetchUsers();
    
//     setTimeout(() => {
//       fetchProjects();
//     }, 300);
    
//     setTimeout(() => {
//       fetchDepartments();
//     }, 600);
    
//     setTimeout(() => {
//       fetchTasks();
//     }, 900);
//   }, []);

//   // Implement intersection observer for lazy loading calendar cells
//   useEffect(() => {
//     const observerOptions = {
//       root: null,
//       rootMargin: '100px',
//       threshold: 0.1
//     };

//     const observer = new IntersectionObserver((entries) => {
//       entries.forEach(entry => {
//         if (entry.isIntersecting) {
//           // Add visible class to make the animation smoother
//           entry.target.classList.add('opacity-100');
//           observer.unobserve(entry.target);
//         }
//       });
//     }, observerOptions);

//     // Observe all day cells once they're rendered
//     const dayCells = document.querySelectorAll('.day-cell');
//     dayCells.forEach(cell => {
//       cell.classList.add('opacity-0', 'transition-opacity', 'duration-500');
//       observer.observe(cell);
//     });

//     return () => {
//       if (observer) {
//         observer.disconnect();
//       }
//     };
//   }, [currentWeek, dataLoaded.tasks]);

//   // Filtrage des tâches par utilisateur sélectionné
//   const filteredTasks = useMemo(() => {
//     if (selectedUserId === null) {
//       return tasks;
//     }
//     return tasks.filter(task => task.id_user === selectedUserId);
//   }, [tasks, selectedUserId]);

//   const processedTasks = useMemo(() => {
//     return Array.isArray(filteredTasks) ? filteredTasks.map(task => {
//       try {
//         const startDate = parseISO(task.datedebut);
//         let remainingDays = task.echeance;
//         let currentDate = startDate;
//         let endDate = startDate;
        
//         while (remainingDays > 0) {
//           const dayOfWeek = currentDate.getDay();
//           if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip weekends
//             remainingDays--;
//             endDate = currentDate;
//           }
//           currentDate = addDays(currentDate, 1);
//         }
        
//         return {
//           ...task,
//           endDate,
//         };
//       } catch (error) {
//         console.error("Error processing task date:", task.datedebut, error);
//         // Retourner une tâche avec une date de fin par défaut pour éviter les erreurs
//         return {
//           ...task,
//           endDate: new Date(),
//         };
//       }
//     }) : [];
//   }, [filteredTasks]);

//   const getWeekDays = () => {
//     const start = startOfWeek(currentWeek, { weekStartsOn: 1 });
//     return Array.from({ length: 5 }).map((_, i) => addDays(start, i));
//   };

//   const getTasksForDay = (date: Date) => {
//     return processedTasks.filter(task => {
//       try {
//         const startDate = parseISO(task.datedebut);
//         return isWithinInterval(date, { start: startDate, end: task.endDate }) ||
//                isSameDay(date, startDate) ||
//                isSameDay(date, task.endDate);
//       } catch (error) {
//         console.error("Error checking task for day:", error);
//         return false;
//       }
//     });
//   };

//   const handleAddTask = async (e: React.FormEvent) => {
//     e.preventDefault();
  
//     try {
//       const response = await fetch("/api/tache/add", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(newTask),
//       });
  
//       if (!response.ok) {
//         throw new Error("Erreur lors de l'ajout de la tâche");
//       }
  
//       toast.success("Tâche ajoutée avec succès");
//       setIsAddTaskModalOpen(false);
//       fetchTasks(); // Re-fetch tasks to update the list
  
//       // Réinitialiser le formulaire
//       setNewTask({
//         libelle: "",
//         niveau: 1,
//         id_projet: 0,
//         echeance: 1,
//         datedebut: "",
//         status: "pending",
//         departement: 0,
//         priorite: 1,
//         id_user: 0,
//       });
//     } catch (error) {
//       toast.error("Erreur lors de l'ajout de la tâche");
//     }
//   };

//   const handleUserFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const value = e.target.value;
//     setSelectedUserId(value === "" ? null : Number(value));
//   };

//   // Check if all data is loaded
//   const allDataLoaded = dataLoaded.users && dataLoaded.projects && dataLoaded.departments;

//   return (
//     <StrictMode>
//     <div className="flex flex-col h-screen bg-gray-50">
//        <ToastContainer />
//       <header className="bg-white shadow-sm px-6 py-4">
//         <div className="flex items-center justify-between">
//           <h1 className="text-2xl font-bold text-gray-900">Calendrier des Tâches</h1>
//           <div className="flex items-center space-x-4">
//             <button
//               onClick={() => setCurrentWeek((prev) => addDays(prev, -7))}
//               className="p-2 hover:bg-gray-100 rounded-full"
//             >
//               <ChevronLeft className="w-5 h-5" />
//             </button>
//             <span className="font-medium">
//               Semaine du {format(getWeekDays()[0], "d MMMM yyyy", { locale: fr })}
//             </span>
//             <button
//               onClick={() => setCurrentWeek((prev) => addDays(prev, 7))}
//               className="p-2 hover:bg-gray-100 rounded-full"
//             >
//               <ChevronRight className="w-5 h-5" />
//             </button>
//           </div>
//         </div>
//       </header>
      
//       {/* Controls section with lazy loading indicator */}
//       <div className="p-6 flex flex-wrap items-center gap-4">
//         <button
//           onClick={() => setIsAddTaskModalOpen(true)}
//           className="p-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
//           disabled={!allDataLoaded}
//         >
//           {allDataLoaded ? "Ajouter une tâche" : (
//             <span className="flex items-center">
//               <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
//               Chargement...
//             </span>
//           )}
//         </button>
        
//         {/* Filtre d'utilisateur */}
//         <div className="flex items-center">
//           <label htmlFor="userFilter" className="mr-2 text-gray-700 font-medium">
//             Filtrer par utilisateur:
//           </label>
//           {dataLoaded.users ? (
//             <select
//               id="userFilter"
//               value={selectedUserId === null ? "" : selectedUserId}
//               onChange={handleUserFilterChange}
//               className="p-2 border rounded-lg min-w-[200px]"
//             >
//               {users.map((user) => (
//                 <option key={user.id_user} value={user.id_user}>
//                   {user.nom_complet}
//                 </option>
//               ))}
//             </select>
//           ) : (
//             <div className="p-2 border rounded-lg min-w-[200px] bg-gray-100 animate-pulse">
//               Chargement...
//             </div>
//           )}
//         </div>
        
//         {/* Affichage du nombre de tâches filtrées */}
//         <div className="ml-4 text-gray-600">
//           {dataLoaded.tasks ? 
//             `${processedTasks.length} tâche${processedTasks.length !== 1 ? 's' : ''} affichée${processedTasks.length !== 1 ? 's' : ''}` :
//             <span className="animate-pulse">Chargement des tâches...</span>
//           }
//         </div>
//       </div>
      
//       {/* Calendar content with lazy loading */}
//       <div className="flex-1 overflow-auto px-6 pb-6">
//         {isLoading && !dataLoaded.tasks ? (
//           <div className="flex justify-center items-center h-full">
//             <div className="flex flex-col items-center">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//               <p className="mt-4 text-gray-600">Chargement des tâches...</p>
//             </div>
//           </div>
//         ) : error ? (
//           <div className="flex justify-center items-center h-full">
//             <p className="text-red-500">{error}</p>
//           </div>
//         ) : (
//           <div className="bg-white rounded-lg shadow">
//             <div className="grid grid-cols-5 border-b">
//               {getWeekDays().map((day) => (
//                 <div
//                   key={day.toString()}
//                   className="p-4 font-medium text-gray-500 text-center border-r"
//                 >
//                   {format(day, "EEEE d/MM", { locale: fr })}
//                 </div>
//               ))}
//             </div>

//             <div className="grid grid-cols-5">
//               {getWeekDays().map((day, index) => {
//                 const dayTasks = getTasksForDay(day);
//                 return (
//                   <div 
//                     key={day.toString()} 
//                     className="day-cell"
//                     style={{ animationDelay: `${index * 100}ms` }}
//                   >
//                     <Suspense fallback={
//                       <div className="p-2 border-r min-h-[120px] flex items-center justify-center">
//                         <div className="animate-pulse bg-gray-200 rounded-lg w-full h-24"></div>
//                       </div>
//                     }>
//                       <DayTaskList 
//                         day={day} 
//                         tasks={dayTasks} 
//                         users={users}
//                         projects={projects}
//                         departments={departments}
//                       />
//                     </Suspense>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}
//       </div>
      
//       {/* Lazy-loaded modal */}
//       {isAddTaskModalOpen && (
//         <Suspense fallback={
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white p-8 rounded-lg shadow-md">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//               <p className="text-center mt-4">Chargement du formulaire...</p>
//             </div>
//           </div>
//         }>
//           <TaskModal 
//             newTask={newTask}
//             setNewTask={setNewTask}
//             handleAddTask={handleAddTask}
//             closeModal={() => setIsAddTaskModalOpen(false)}
//             users={users}
//             projects={projects}
//             departments={departments}
//           />
//         </Suspense>
//       )}
//     </div>
//     </StrictMode>
//   );
// }