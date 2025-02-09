import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

// 📌 Icônes pour améliorer l'affichage (Facultatif, nécessite react-icons)
import { FaUniversity, FaSpinner } from "react-icons/fa";

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

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📚 Liste des Formations</h1>

      {loading ? (
        <div style={styles.loadingContainer}>
          <FaSpinner style={styles.spinner} /> Chargement des formations...
        </div>
      ) : (
        <div style={styles.grid}>
          {formations.map((formation) => (
            <Link key={formation.id} to={`/formations/${formation.id}`} style={styles.card}>
              <div style={styles.iconContainer}>
                <FaUniversity style={styles.icon} />
              </div>
              <h3 style={styles.formationTitle}>{formation.nom}</h3>
              <p style={styles.info}><strong>Produit:</strong> {formation.produit}</p>
              <p style={styles.info}><strong>Centre:</strong> {formation.centre}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

// 🎨 Styles CSS-in-JS
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    textAlign: "center",
    padding: "30px",
    maxWidth: "900px",
    margin: "auto",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "20px",
    fontWeight: "bold",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  card: {
    textDecoration: "none",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    color: "#333",
  },
  cardHover: {
    transform: "translateY(-5px)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
  iconContainer: {
    backgroundColor: "#007bff",
    padding: "10px",
    borderRadius: "50%",
    marginBottom: "10px",
  },
  icon: {
    fontSize: "24px",
    color: "white",
  },
  formationTitle: {
    fontSize: "1.4rem",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  info: {
    fontSize: "1rem",
    color: "#555",
  },
  loadingContainer: {
    fontSize: "1.2rem",
    color: "#555",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },
  spinner: {
    fontSize: "1.5rem",
    animation: "spin 1s linear infinite",
  },
};

export default Formations;
