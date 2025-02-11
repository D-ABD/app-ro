// --- IMPORTS ---
// Import des hooks React nécessaires
import React, { useEffect, useState } from "react";
// Import du composant Link pour la navigation entre pages
import { Link } from "react-router-dom";
// Import du client Supabase pour accéder à la base de données
import { supabase } from "../supabaseClient";

// Import des icônes de react-icons (nécessite l'installation du package)
import { FaUniversity, FaSpinner } from "react-icons/fa";

// --- INTERFACE ---
// Définition du type Formation avec les propriétés nécessaires pour l'affichage
interface Formation {
  id: number;        // Identifiant unique de la formation
  nom: string;       // Nom de la formation
  produit: string;   // Nom du produit
  centre: string;    // Centre de formation
}

// --- COMPOSANT PRINCIPAL ---
const Formations: React.FC = () => {
  // --- ÉTATS (STATES) ---
  // État pour stocker la liste des formations
  const [formations, setFormations] = useState<Formation[]>([]);
  // État pour gérer l'affichage du chargement
  const [loading, setLoading] = useState(true);

  // --- EFFET (EFFECT) ---
  // useEffect s'exécute au chargement du composant
  useEffect(() => {
    // Fonction asynchrone pour récupérer les formations depuis Supabase
    const fetchFormations = async () => {
      // Requête à Supabase pour récupérer les données
      const { data, error } = await supabase
        .from("formations")
        .select("id, nom, produit, centre");

      // Gestion des erreurs
      if (error) {
        console.error("Erreur de récupération des formations:", error);
      } else {
        // Mise à jour de l'état avec les données reçues
        setFormations(data);
      }
      // Désactivation de l'indicateur de chargement
      setLoading(false);
    };

    // Appel de la fonction de récupération
    fetchFormations();
  }, []); // [] signifie que l'effet ne s'exécute qu'une fois au montage du composant

  // --- RENDU (RENDER) ---
  return (
    <div style={styles.container}>
      {/* Titre de la page */}
      <h1 style={styles.title}>📚 Liste des Formations</h1>

      {/* Affichage conditionnel : loading ou contenu */}
      {loading ? (
        // Affichage pendant le chargement
        <div style={styles.loadingContainer}>
          <FaSpinner style={styles.spinner} /> Chargement des formations...
        </div>
      ) : (
        // Grille des formations
        <div style={styles.grid}>
          {/* Mapping sur le tableau des formations pour créer les cartes */}
          {formations.map((formation) => (
            // Lien vers la page de détail de la formation
            <Link 
              key={formation.id} 
              to={`/formations/${formation.id}`} 
              style={styles.card}
            >
              {/* Conteneur de l'icône */}
              <div style={styles.iconContainer}>
                <FaUniversity style={styles.icon} />
              </div>
              {/* Informations de la formation */}
              <h3 style={styles.formationTitle}>{formation.nom}</h3>
              <p style={styles.info}>
                <strong>Produit:</strong> {formation.produit}
              </p>
              <p style={styles.info}>
                <strong>Centre:</strong> {formation.centre}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

// --- STYLES ---
// Définition des styles avec typage TypeScript pour React
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
    // Création d'une grille responsive qui s'adapte à la largeur
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
    animation: "spin 1s linear infinite", // Note: nécessite une définition de @keyframes
  },
};

// Export du composant pour l'utiliser dans d'autres fichiers
export default Formations;