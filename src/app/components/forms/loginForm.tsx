"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const INITIAL_STATE = {
  email: "",
  password: "",
};

export default function LoginForm() {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [error, setError] = useState(""); // Pour afficher un message d'erreur
  const router = useRouter(); // Pour rediriger après connexion réussie

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/users/userMail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mail: formData.email,
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Échec de la connexion");
      }

      console.log("Connexion réussie :", result);

      if (!result.user) {
        throw new Error("Données utilisateur invalides");
      }

      const { role, id_user } = result.user;

      // Stocker l'ID dans le Local Storage
      localStorage.setItem("userId", id_user);

      // Envoi des logs
      const logResponse = await fetch("/api/logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_user: id_user }), // Correction ici
      });
      

      if (!logResponse.ok) {
        const errorData = await logResponse.json();
        throw new Error(errorData.message || "Erreur lors de l'ajout aux logs");
      }

      // Redirection en fonction du rôle
      switch (role) {
        case "admin":
          router.push("/admin");
          break;
        case "resp":
          router.push("/TeamHead");
          break;
        default:
          router.push("/employees");
          break;
      }
    } catch (err) {
      console.error("Erreur lors de la requête :", err);
      setError(err.message || "Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Se connecter</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm mb-4" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
