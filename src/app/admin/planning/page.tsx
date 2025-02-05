"use client";

import { useState } from "react";
import { Calendar, Home, Plus, Settings, Users } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
const employees = ["Alice", "Bob", "Charlie", "Diana", "Eve"];

export default function Planning() {
  const [tasks, setTasks] = useState([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [newTask, setNewTask] = useState({
    employee: employees[0],
    day: daysOfWeek[0],
    title: "",
    difficulty: "Facile",
    startDate: "",
    duration: "",
  });

  const handleAddTask = () => {
    setTasks([...tasks, newTask]);
    setNewTask({
      employee: employees[0],
      day: daysOfWeek[0],
      title: "",
      difficulty: "Facile",
      startDate: "",
      duration: "",
    });
    setIsPopoverOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
         {/* Sidebar */}
         <AnimatePresence>
        {(isSidebarOpen || window.innerWidth >= 1024) && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="fixed lg:static z-40 w-64 bg-white shadow-lg h-screen"
          >
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Calendar className="text-blue-500" /> Gestion Planning
              </h1>
            </div>
            <nav className="mt-8">
              <ul className="flex flex-col">
                <li>
                  <a
                    href="/admin"
                    className="flex items-center gap-3 py-2.5 px-4 rounded transition hover:bg-gray-200"
                  >
                    <Home /> Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="/admin/planning"
                    className="flex items-center gap-3 py-2.5 px-4 rounded transition hover:bg-gray-200"
                  >
                    <Calendar /> Plannings
                  </a>
                </li>
                <li>
                  <a
                    href="/admin/users"
                    className="flex items-center gap-3 py-2.5 px-4 rounded transition hover:bg-gray-200"
                  >
                    <Users /> Utilisateurs
                  </a>
                </li>
                <li>
                  <a
                    href="/admin/params"
                    className="flex items-center gap-3 py-2.5 px-4 rounded transition hover:bg-gray-200"
                  >
                    <Settings /> Paramètres
                  </a>
                </li>
              </ul>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white shadow-md flex items-center justify-between px-6">
          <h1 className="text-lg font-bold">Planning Hebdomadaire</h1>
          <button
            onClick={() => setIsPopoverOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <Plus /> Ajouter une Tâche
          </button>
        </header>

        <div className="flex flex-1">
          {/* Employees List */}
          {/* <aside className="w-48 bg-white shadow-md flex flex-col">
            <h2 className="text-lg font-semibold p-4 border-b">Employés</h2>
            <ul className="flex-1 overflow-auto">
              {employees.map((employee, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                >
                  {employee}
                </li>
              ))}
            </ul>
          </aside> */}

          {/* Tasks Table */}
          <main className="flex-1 p-4">
            <div className="grid grid-cols-5 gap-2">
              {daysOfWeek.map((day, dayIndex) => (
                <div key={dayIndex} className="bg-white shadow-md rounded-lg">
                  <h2 className="text-center bg-gray-200 py-2 font-semibold">
                    {day}
                  </h2>
                  <div className="p-2 space-y-2">
                    {tasks
                      .filter((task) => task.day === day)
                      .map((task, index) => (
                        <div
                          key={index}
                          className={`p-2 rounded-lg text-white ${
                            task.difficulty === "Facile"
                              ? "bg-green-500"
                              : task.difficulty === "Moyenne"
                              ? "bg-orange-500"
                              : "bg-red-500"
                          }`}
                        >
                          <p className="font-bold">{task.title}</p>
                          <p className="text-sm">{task.employee}</p>
                          <p className="text-xs">
                            {task.startDate} | {task.duration} jours
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>

      {/* Popover for Adding Task */}
      {isPopoverOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Ajouter une Tâche</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddTask();
              }}
              className="space-y-4"
            >
              <select
                className="w-full p-2 border rounded"
                value={newTask.employee}
                onChange={(e) =>
                  setNewTask({ ...newTask, employee: e.target.value })
                }
                required
              >
                {employees.map((employee, index) => (
                  <option key={index} value={employee}>
                    {employee}
                  </option>
                ))}
              </select>
              <select
                className="w-full p-2 border rounded"
                value={newTask.day}
                onChange={(e) =>
                  setNewTask({ ...newTask, day: e.target.value })
                }
                required
              >
                {daysOfWeek.map((day, index) => (
                  <option key={index} value={day}>
                    {day}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Titre de la tâche"
                className="w-full p-2 border rounded"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                required
              />
              <select
                className="w-full p-2 border rounded"
                value={newTask.difficulty}
                onChange={(e) =>
                  setNewTask({ ...newTask, difficulty: e.target.value })
                }
                required
              >
                <option value="Facile">Facile</option>
                <option value="Moyenne">Moyenne</option>
                <option value="Difficile">Difficile</option>
              </select>
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={newTask.startDate}
                onChange={(e) =>
                  setNewTask({ ...newTask, startDate: e.target.value })
                }
                required
              />
              <input
                type="number"
                placeholder="Durée (jours)"
                className="w-full p-2 border rounded"
                value={newTask.duration}
                onChange={(e) =>
                  setNewTask({ ...newTask, duration: e.target.value })
                }
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
