// Importation des dépendances nécessaires
import React from "react";
// Import du composant FormationCard qui sera utilisé pour afficher chaque formation
import FormationCard from "./FormationCard";
// Import du type qui définit la structure d'une formation avec ses commentaires
import { FormationAvecCommentaires } from "../types";

// Définition de l'interface qui spécifie les props attendues par le composant
interface ListeFormationsProps {
  // Un tableau de formations (utilisant le type FormationAvecCommentaires)
  formations: FormationAvecCommentaires[];
  
  // Une fonction de mise à jour qui:
  // - K extends keyof FormationAvecCommentaires : K peut être n'importe quelle clé de FormationAvecCommentaires
  // - id: l'identifiant de la formation à mettre à jour
  // - field: le nom du champ à modifier
  // - value: la nouvelle valeur (son type correspond au type du champ)
  onUpdate: <K extends keyof FormationAvecCommentaires>(
    id: number, 
    field: K, 
    value: FormationAvecCommentaires[K]
  ) => void;
}

// Définition du composant ListeFormations
// React.FC<ListeFormationsProps> indique que c'est un Functional Component 
// qui attend des props de type ListeFormationsProps
const ListeFormations: React.FC<ListeFormationsProps> = ({ formations, onUpdate }) => {
  return (
    // Container principal
    <div>
      {/* Opérateur ternaire qui vérifie s'il y a des formations */}
      {formations.length > 0 ? (
        // Si oui, on map sur le tableau des formations
        formations.map((formation) => (
          // Pour chaque formation, on crée un composant FormationCard
          <FormationCard
            // key est nécessaire pour React quand on fait un map
            // il permet à React d'identifier de manière unique chaque élément
            key={formation.id}
            
            // L'opérateur spread (...) permet de passer toutes les propriétés
            // de formation au composant FormationCard
            {...formation}
            
            // On passe explicitement ces props car elles pourraient 
            // ne pas être incluses dans le spread
            totalPlaces={formation.totalPlaces}
            cap={formation.cap}
            
            // On passe la fonction onUpdate qui sera utilisée 
            // pour mettre à jour les données
            onUpdate={onUpdate}
          />
        ))
      ) : (
        // Si non (formations.length === 0), on affiche un message
        <p>Aucune formation disponible.</p>
      )}
    </div>
  );
};

// Export du composant pour pouvoir l'utiliser ailleurs
export default ListeFormations;