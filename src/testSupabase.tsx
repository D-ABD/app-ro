import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

interface Formation {
  id: number;
  nom: string;
  produit: string;
  centre: string;
}

const TestSupabase: React.FC = () => {
  const [formations, setFormations] = useState<Formation[]>([]);
  
  useEffect(() => {
    const fetchFormations = async () => {
      const { data, error } = await supabase.from("formations").select("*");
      console.log("Données reçues:", data); // ✅ Ajout du log
      if (error) {
        console.error("Erreur Supabase :", error);
      } else {
        setFormations(data);
      }
    };
    fetchFormations();
  }, []);

  return (
    <div>
      <h1>Test Connexion Supabase</h1>
      {formations.length === 0 ? (
        <p>Aucune formation trouvée.</p>
      ) : (
        <ul>
          {formations.map((formation) => (
            <li key={formation.id}>{formation.nom} - {formation.produit} ({formation.centre})</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TestSupabase;
