import { useEffect, useState } from "react";
import Calendrier from "./Calendrier";

const Home = () => {
  const [taches, setTaches] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);

  useEffect(() => {
    // Simuler une requête API pour récupérer les tâches
    fetch('/api/tache')
      .then(response => response.json())
      .then(data => setTaches(data.data));

    // Simuler une requête API pour récupérer les utilisateurs
    fetch('/api/users')
      .then(response => response.json())
      .then(data => setUtilisateurs(data));
  }, []);

  return (
    <div>
      <h1>Calendrier des Tâches</h1>
      <Calendrier taches={taches} utilisateurs={utilisateurs} />
    </div>
  );
};

export default Home;
