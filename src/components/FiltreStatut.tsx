// Import de la bibliothèque React nécessaire pour créer des composants
import React from "react";

// Définition de l'interface TypeScript qui spécifie les props attendues par le composant
interface FiltreStatutProps {
  statuts: string[];                       // Tableau des statuts possibles (ex: ["Complet", "À Recruter"])
  filtreActuel: string;                    // Le statut actuellement sélectionné
  setFiltre: (statut: string) => void;     // Fonction pour changer le filtre
  setSearch: (search: string) => void;     // Fonction pour mettre à jour la recherche
  setSortOrder: (order: 'asc' | 'desc') => void;  // Fonction pour changer l'ordre de tri
}

// Définition du composant FiltreStatut
// React.FC<FiltreStatutProps> indique que c'est un Functional Component qui attend les props définies ci-dessus
const FiltreStatut: React.FC<FiltreStatutProps> = ({ 
  statuts,        // Liste des statuts disponibles
  filtreActuel,   // Statut actuellement sélectionné
  setFiltre,      // Fonction pour changer le filtre
  setSearch,      // Fonction pour la recherche
  setSortOrder    // Fonction pour le tri
}) => {
  return (
    // Container principal avec Flexbox pour aligner les éléments
    <div style={{ 
      display: "flex", 
      justifyContent: "space-between",  // Espace égal entre les éléments
      alignItems: "center",            // Alignement vertical au centre
      marginBottom: "10px"            // Marge en bas
    }}>
      {/* Menu déroulant pour le tri */}
      <select 
        onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
        // Le as 'asc' | 'desc' est un "type assertion" TypeScript
        // Il assure que la valeur sera soit 'asc' soit 'desc'
      >
        <option value="desc">Trier par date (descendant)</option>
        <option value="asc">Trier par date (ascendant)</option>
      </select>

      {/* Groupe de boutons de filtres */}
      <div style={{ display: "flex", gap: "5px" }}>
        {/* On map sur le tableau des statuts pour créer un bouton pour chaque statut */}
        {statuts.map((statut) => (
          <button
            key={statut}  // Clé unique requise par React pour les listes
            onClick={() => setFiltre(statut)}  // Au clic, on change le filtre
            style={{
              // Style conditionnel : le bouton actif a un style différent
              fontWeight: filtreActuel === statut ? "bold" : "normal",
              padding: "5px",
              cursor: "pointer",
              // Couleur de fond différente pour le bouton actif
              background: filtreActuel === statut ? "#007bff" : "#f0f0f0",
              // Couleur du texte différente pour le bouton actif
              color: filtreActuel === statut ? "white" : "black",
              border: "1px solid #ccc",
              borderRadius: "5px"
            }}
          >
            {statut}  {/* Texte du bouton */}
          </button>
        ))}
      </div>

      {/* Champ de recherche */}
      <input
        type="text"
        placeholder="Rechercher..."  // Texte affiché quand le champ est vide
        onChange={(e) => setSearch(e.target.value)}  // Met à jour la recherche à chaque frappe
        style={{
          padding: "5px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          width: "200px"
        }}
      />
    </div>
  );
};

// Export du composant pour pouvoir l'utiliser dans d'autres fichiers
export default FiltreStatut;