import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

interface Formation {
  id: number;
  nom: string;
  produit: string;
  centre: string;
}

const Formations: React.FC = () => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFormations = async () => {
      const { data, error } = await supabase
        .from("formations")
        .select("id, nom, produit, centre");

      if (error) {
        console.error("Erreur de récupération des formations:", error);
      } else {
        setFormations(data);
      }
      setLoading(false);
    };

    fetchFormations();
  }, []);

  if (loading) {
    return <p>Chargement des formations...</p>;
  }

  return (
    <div style={styles.container}>
      <h1>Liste des Formations</h1>
      <ul style={styles.list}>
        {formations.map((formation) => (
          <li key={formation.id} style={styles.listItem}>
            <Link to={`/formations/${formation.id}`} style={styles.link}>
              {formation.nom} - {formation.produit} ({formation.centre})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    textAlign: "center",
    padding: "20px",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  listItem: {
    fontSize: "1.2rem",
    padding: "10px",
    borderBottom: "1px solid #ddd",
  },
  link: {
    textDecoration: "none",
    color: "#007bff",
  },
};

export default Formations;
