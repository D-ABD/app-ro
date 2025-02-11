// Importation des dépendances nécessaires
import React from "react";
// Import du type qui définit la structure d'une formation avec ses commentaires
import { FormationAvecCommentaires } from "../types";

// Définition du type des props du composant
// On étend le type FormationAvecCommentaires en ajoutant une prop onUpdate
// Cette fonction onUpdate est générique et permet de mettre à jour n'importe quel champ d'une formation
type FormationProps = FormationAvecCommentaires & { 
  // K représente les clés possibles de FormationAvecCommentaires (nom, centre, etc.)
  // La fonction prend un id, le nom du champ à modifier, et la nouvelle valeur
  onUpdate: <K extends keyof FormationAvecCommentaires>(
    id: number,      // ID de la formation à mettre à jour
    field: K,        // Nom du champ à modifier
    value: FormationAvecCommentaires[K]  // Nouvelle valeur (type correspondant au champ)
  ) => void;
};

// Définition du composant FormationCard
// React.FC<FormationProps> indique que c'est un Functional Component qui attend des props de type FormationProps
const FormationCard: React.FC<FormationProps> = ({
  // Destructuration des props - on récupère toutes les propriétés individuellement
  id,               // Identifiant unique de la formation
  nom,              // Nom de la formation
  centre,           // Centre de formation
  produit,          // Nom du produit
  numProduit,       // Numéro du produit
  numOffre,         // Numéro de l'offre
  typeOffre,        // Type d'offre
  dateDebut,        // Date de début
  dateFin,          // Date de fin
  prevusCrif,       // Nombre prévu CRIF
  prevusMp,         // Nombre prévu MP
  inscritsCrif,     // Nombre d'inscrits CRIF
  inscritsMp,       // Nombre d'inscrits MP
  aRecruter,        // Nombre de personnes à recruter
  entresFormation,  // Nombre d'entrées en formation
  numKairos,        // Numéro Kairos
  convocation_envoie, // État de la convocation
  assistante,       // Nom de l'assistante
  totalPlaces,      // Total des places
  cap,              // CAP
  onUpdate          // Fonction de mise à jour
}) => {
  return (
    // Container principal avec des styles CSS
    <div style={styles.card}>
      {/* Titre éditable */}
      <h3>
        <input
          type="text"
          value={nom}
          // Lors du changement, on appelle onUpdate avec l'id, le champ "nom" et la nouvelle valeur
          onChange={(e) => onUpdate(id, "nom", e.target.value)}
          style={styles.input}
        />
      </h3>

      {/* Affichage des informations statiques */}
      <p><strong>Centre:</strong> {centre}</p>
      {/* L'opérateur || permet d'afficher "N/A" si la valeur est null ou undefined */}
      <p><strong>Produit:</strong> {produit || "N/A"} ({numProduit || "N/A"})</p>
      <p><strong>Offre:</strong> {numOffre || "N/A"} - {typeOffre || "N/A"}</p>
      <p><strong>Dates:</strong> {dateDebut || "Inconnue"} → {dateFin || "Inconnue"}</p>

      {/* Champs numériques éditables */}
      <p>
        <strong>Prévus CRIF:</strong>
        <input
          type="number"
          // L'opérateur ?? renvoie une chaîne vide si la valeur est null ou undefined
          value={prevusCrif ?? ""}
          // Convertit la valeur en nombre ou null si vide
          onChange={(e) => onUpdate(id, "prevusCrif", e.target.value ? Number(e.target.value) : null)}
          style={styles.input}
        />
        |
        <strong>Prévus MP:</strong>
        <input
          type="number"
          value={prevusMp ?? ""}
          onChange={(e) => onUpdate(id, "prevusMp", e.target.value ? Number(e.target.value) : null)}
          style={styles.input}
        />
      </p>

      {/* Autres champs numériques éditables */}
      <p>
        <strong>Inscrits CRIF:</strong>
        <input
          type="number"
          value={inscritsCrif ?? ""}
          onChange={(e) => onUpdate(id, "inscritsCrif", e.target.value ? Number(e.target.value) : null)}
          style={styles.input}
        />
        |
        <strong>Inscrits MP:</strong>
        <input
          type="number"
          value={inscritsMp ?? ""}
          onChange={(e) => onUpdate(id, "inscritsMp", e.target.value ? Number(e.target.value) : null)}
          style={styles.input}
        />
      </p>

      {/* Affichage des valeurs calculées avec l'opérateur ?? pour gérer les valeurs null */}
      <p><strong>À Recruter:</strong> {aRecruter ?? 0} | <strong>Entrées Formation:</strong> {entresFormation ?? 0}</p>
      <p><strong>Num Kairos:</strong> {numKairos || "N/A"}</p>

      {/* Menu déroulant pour la convocation */}
      <p>
        <strong>Convocation:</strong>
        <select
          value={convocation_envoie ? "✅ Oui" : "❌ Non"}
          onChange={(e) => onUpdate(id, "convocation_envoie", e.target.value === "✅ Oui")}
          style={styles.select}
        >
          <option value="✅ Oui">✅ Oui</option>
          <option value="❌ Non">❌ Non</option>
        </select>
      </p>

      {/* Champ texte pour l'assistante */}
      <p>
        <strong>Assistante:</strong>
        <input
          type="text"
          value={assistante || ""}
          onChange={(e) => onUpdate(id, "assistante", e.target.value)}
          style={styles.input}
        />
      </p>

      {/* Affichage des dernières informations */}
      <p><strong>Total Places:</strong> {totalPlaces ?? "Non défini"}</p>
      <p><strong>CAP:</strong> {cap ?? "Non défini"}</p>
    </div>
  );
};

// Styles CSS en JavaScript
const styles = {
  // Style pour la carte principale
  card: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    marginBottom: "10px",
    backgroundColor: "#f9f9f9",
  },
  // Style pour les champs de saisie
  input: {
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "4px",
    marginLeft: "5px",
    width: "80px",
  },
  // Style pour les menus déroulants
  select: {
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "4px",
    marginLeft: "5px",
  }
};

// Export du composant pour pouvoir l'utiliser ailleurs
export default FormationCard;