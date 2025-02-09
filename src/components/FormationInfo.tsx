import React from "react";
import { Formation } from "../types";

// Composant React pour afficher les informations détaillées d'une formation
// Reçoit un objet 'formation' en propriété et l'affiche de manière structurée
const FormationInfo: React.FC<{ formation: Formation }> = ({ formation }) => {
  return (
    <div style={styles.infoContainer}>
      {/* Section principale avec les informations générales de la formation */}
      <div style={styles.section}>
        {/* Première ligne d'informations : Produit, Centre, Type d'Offre */}
        <div style={styles.infoRow}>
          <div style={styles.infoItem}>
            <strong>📌 Produit:</strong> {formation.produit}
          </div>
          <div style={styles.infoItem}>
            <strong>🏢 Centre:</strong> {formation.centre}
          </div>
          <div style={styles.infoItem}>
            <strong>🗂️ Type d'Offre:</strong> {formation.typeOffre}
          </div>
        </div>

        {/* Deuxième ligne d'informations : Numéros de produit, offre et KAIROS */}
        <div style={styles.infoRow}>
          <div style={styles.infoItem}>
            <strong>🔢 N° Produit:</strong> {formation.numProduit}
          </div>
          <div style={styles.infoItem}>
            <strong>📋 N° Offre:</strong> {formation.numOffre}
          </div>
          <div style={styles.infoItem}>
            <strong>🔢 Numéro KAIROS:</strong> {formation.numKairos}
          </div>
        </div>

        {/* Troisième ligne d'informations : Dates et statut de convocation */}
        <div style={styles.infoRow}>
          <div style={styles.infoItem}>
            <strong>📅 Début:</strong> {formation.dateDebut}
          </div>
          <div style={styles.infoItem}>
            <strong>📅 Fin:</strong> {formation.dateFin}
          </div>
          <div style={styles.infoItem}>
            {/* Affichage conditionnel du statut de convocation */}
            <strong>📨 Convocation:</strong> {formation.convocation_envoie ? "✅ Oui" : "❌ Non"}
          </div>
        </div>
      </div>

      {/* Section des statistiques de la formation */}
      <div style={styles.statsSection}>
        {/* Grille de statistiques flexible */}
        <div style={styles.statsGrid}>
          {/* Chaque élément de statistique est affiché avec un libellé et une valeur */}
          <div style={styles.statsItem}>
            <div style={styles.statsLabel}>Prévus CRIF</div>
            <div style={styles.statsValue}>{formation.prevusCrif}</div>
          </div>
          <div style={styles.statsItem}>
            <div style={styles.statsLabel}>Prévus MP</div>
            <div style={styles.statsValue}>{formation.prevusMp}</div>
          </div>
          <div style={styles.statsItem}>
            <div style={styles.statsLabel}>Inscrits CRIF</div>
            <div style={styles.statsValue}>{formation.inscritsCrif}</div>
          </div>
          <div style={styles.statsItem}>
            <div style={styles.statsLabel}>Inscrits MP</div>
            <div style={styles.statsValue}>{formation.inscritsMp}</div>
          </div>
          <div style={styles.statsItem}>
            <div style={styles.statsLabel}>À recruter</div>
            <div style={styles.statsValue}>{formation.aRecruter}</div>
          </div>
          <div style={styles.statsItem}>
            <div style={styles.statsLabel}>Entrés</div>
            <div style={styles.statsValue}>{formation.entresFormation}</div>
          </div>
        </div>

        {/* Information sur l'assistante responsable */}
        <div style={styles.assistantInfo}>
          <strong>👩‍💼 Assistante:</strong> {formation.assistante}
        </div>
      </div>
    </div>
  );
};

// Définition des styles CSS-in-JS pour le composant
// Utilise un objet TypeScript pour garantir la typage des propriétés CSS
const styles: { [key: string]: React.CSSProperties } = {
  // Style du conteneur principal : fond légèrement gris, coins arrondis
  infoContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "20px",
  },
  // Style de la section d'informations générales
  section: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "15px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)", // Ombre légère
  },
  // Disposition flexible des lignes d'informations
  infoRow: {
    display: "flex",
    flexWrap: "wrap", // Permet le passage à la ligne sur petit écran
    gap: "20px",
    marginBottom: "10px",
    alignItems: "center",
  },
  // Style de chaque élément d'information
  infoItem: {
    flex: "1 1 250px", // Flexibilité et largeur minimale
    minWidth: "200px",
    fontSize: "0.9rem",
    padding: "8px",
    backgroundColor: "#f8f9fa",
    borderRadius: "4px",
  },
  // Style de la section de statistiques
  statsSection: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "15px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  // Grille responsive pour les statistiques
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", // Colonnes adaptatives
    gap: "15px",
    marginBottom: "15px",
  },
  // Style de chaque élément de statistique
  statsItem: {
    textAlign: "center",
    padding: "10px",
    backgroundColor: "#f8f9fa",
    borderRadius: "4px",
  },
  // Style du libellé de statistique
  statsLabel: {
    fontSize: "0.8rem",
    color: "#6c757d",
    marginBottom: "5px",
  },
  // Style de la valeur de statistique
  statsValue: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#2c3e50",
  },
  // Style de l'information de l'assistante
  assistantInfo: {
    textAlign: "right",
    fontSize: "0.9rem",
    color: "#495057",
    borderTop: "1px solid #dee2e6",
    paddingTop: "10px",
    marginTop: "10px",
  },
};

export default FormationInfo;