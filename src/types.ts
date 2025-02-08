export interface CommentaireDB {
    id: number;
    formation_id: number;
    text: string;
    created_at: string;
  }
  
  export interface Formation {
    id: number;
    nom: string;
    produit: string;
    centre: string;
    numProduit: string;
    numOffre: string;
    typeOffre: string;
    dateDebut: string;
    dateFin: string;
    prevusCrif: number;
    prevusMp: number;
    inscritsCrif: number;
    inscritsMp: number;
    aRecruter: number;
    entresFormation: number;
    numKairos: string;
    convocationOk: boolean;
    dateHeureConvocation: string;
    assistante: string;
  }
  