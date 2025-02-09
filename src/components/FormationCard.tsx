import React from "react";

interface FormationProps {
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
}

const FormationCard: React.FC<FormationProps> = ({
  nom,
  centre,
  produit,
  numProduit,
  numOffre,
  typeOffre,
  dateDebut,
  dateFin,
  prevusCrif,
  prevusMp,
  inscritsCrif,
  inscritsMp,
  aRecruter,
  entresFormation,
  numKairos,
  convocation_envoie,
  assistante,
}) => {
  return (
    <div style={styles.card}>
      <h3>{nom}</h3>
      <p><strong>Centre:</strong> {centre}</p>
      <p><strong>Produit:</strong> {produit} ({numProduit})</p>
      <p><strong>Offre:</strong> {numOffre} - {typeOffre}</p>
      <p><strong>Dates:</strong> {dateDebut} → {dateFin}</p>
      <p><strong>Prévus CRIF:</strong> {prevusCrif || 0} | <strong>Prévus MP:</strong> {prevusMp || 0}</p>
      <p><strong>Inscrits CRIF:</strong> {inscritsCrif || 0} | <strong>Inscrits MP:</strong> {inscritsMp || 0}</p>
      <p><strong>À Recruter:</strong> {aRecruter || 0} | <strong>Entrées Formation:</strong> {entresFormation || 0}</p>
      <p><strong>Num Kairos:</strong> {numKairos}</p>
      <p><strong>Convocation:</strong> {convocation_envoie ? "✅ Oui" : "❌ Non"}</p>
      <p><strong>Assistante:</strong> {assistante}</p>
    </div>
  );
};

const styles = {
  card: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    marginBottom: "10px",
    backgroundColor: "#f9f9f9",
  },
};

export default FormationCard;
