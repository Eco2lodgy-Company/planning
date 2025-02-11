"use client";

import { useState, useEffect } from "react";
import { Plus, X, Pencil } from "lucide-react";
import { toast } from "sonner";

interface Rapport {
  id: number;
  userId: number | null;
  date: string | null;
  temps: boolean | null; // true: matin, false: soir
  taches: string | null;
  blockage: string | null;
  solution: string | null;
  created_at: string;
}

export default function RapportTable() {
  const [rapports, setRapports] = useState<Rapport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRapports();
  }, []);

  const fetchRapports = async () => {
    try {
      const response = await fetch("/api/rapports");
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      const result = await response.json();

      if (result.data) {
        setRapports(result.data);
      }
    } catch (error) {
      toast.error("Erreur lors du chargement des rapports");
    } finally {
      setIsLoading(false);
    }
  };

  const morningReports = rapports.filter((rapport) => rapport.temps === true);
  const eveningReports = rapports.filter((rapport) => rapport.temps === false);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Rapports</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Rapports du matin */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Rapports du Matin</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2">Date</th>
                  <th className="border border-gray-300 p-2">Tâches</th>
                  <th className="border border-gray-300 p-2">Blocages</th>
                  <th className="border border-gray-300 p-2">Solutions</th>
                  <th className="border border-gray-300 p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {morningReports.map((rapport) => (
                  <tr key={rapport.id}>
                    <td className="border border-gray-300 p-2">{rapport.date}</td>
                    <td className="border border-gray-300 p-2">{rapport.taches}</td>
                    <td className="border border-gray-300 p-2">{rapport.blockage}</td>
                    <td className="border border-gray-300 p-2">{rapport.solution}</td>
                    <td className="border border-gray-300 p-2 flex gap-2 justify-center">
                      <button>
                        <Pencil className="w-5 h-5 text-gray-400 hover:text-blue-500" />
                      </button>
                      <button>
                        <X className="w-5 h-5 text-gray-400 hover:text-red-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Rapports du soir */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Rapports du Soir</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2">Date</th>
                  <th className="border border-gray-300 p-2">Tâches</th>
                  <th className="border border-gray-300 p-2">Blocages</th>
                  <th className="border border-gray-300 p-2">Solutions</th>
                  <th className="border border-gray-300 p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {eveningReports.map((rapport) => (
                  <tr key={rapport.id}>
                    <td className="border border-gray-300 p-2">{rapport.date}</td>
                    <td className="border border-gray-300 p-2">{rapport.taches}</td>
                    <td className="border border-gray-300 p-2">{rapport.blockage}</td>
                    <td className="border border-gray-300 p-2">{rapport.solution}</td>
                    <td className="border border-gray-300 p-2 flex gap-2 justify-center">
                      <button>
                        <Pencil className="w-5 h-5 text-gray-400 hover:text-blue-500" />
                      </button>
                      <button>
                        <X className="w-5 h-5 text-gray-400 hover:text-red-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
