export interface CommentaireDB {
  id: number;
  formation_id: number;
  text: string;
  created_at: string;
}

export interface Formation {
  totalPlaces: number | null;
  cap: number | null;
  id: number;
  nom: string;
  produit: string | null;
  centre: string;
  numProduit: string | null;
  numOffre: string | null;
  typeOffre: string | null;
  dateDebut: string | null;
  dateFin: string | null;
  prevusCrif: number | null;
  prevusMp: number | null;
  inscritsCrif: number | null;
  inscritsMp: number | null;
  aRecruter: number | null;
  entresFormation: number | null;
  numKairos: string | null;
  convocation_envoie: boolean;
  assistante: string | null;
}

// ✅ Nouvelle interface pour inclure les commentaires
export interface FormationAvecCommentaires extends Formation {
  commentaires: CommentaireDB[];
}
