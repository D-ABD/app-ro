import React from "react";
import FormationCard from "./FormationCard";

interface Commentaire {
  id: number;
  formation_id: number;
  text: string;
  created_at: string;
}

interface Formation {
  id: number;
  nom: string;
  centre: string;
  produit: string;
  numProduit: string;
  numOffre: string;
  typeOffre: string;
  dateDebut: string;
  dateFin: string;
  prevusCrif: number | null;
  prevusMp: number | null;
  inscritsCrif: number | null;
  inscritsMp: number | null;
  aRecruter: number | null;
  entresFormation: number | null;
  numKairos: string;
  convocation_envoie: boolean;
  assistante: string;
  commentaires: Commentaire[];
}

interface ListeFormationsProps {
  formations: Formation[];
}

const ListeFormations: React.FC<ListeFormationsProps> = ({ formations }) => {
  return (
    <div>
      {formations.length > 0 ? (
        formations.map((formation) => (
          <FormationCard key={formation.id} {...formation} />
        ))
      ) : (
        <p>Aucune formation disponible.</p>
      )}
    </div>
  );
};

export default ListeFormations;
