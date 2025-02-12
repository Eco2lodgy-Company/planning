"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simule un petit délai avant la redirection 
    const timer = setTimeout(() => {
      setLoading(false);
      router.push("/login"); 
    }, 2000); 

    return () => clearTimeout(timer); // Nettoyage du timer si le composant est démonté
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-red">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return null;
}
