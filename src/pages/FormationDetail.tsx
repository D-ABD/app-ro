import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";

interface Formation {
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
  commentaires: string;
  entresFormation: number;
  numKairos: string;
  convocationOk: boolean;
  dateHeureConvocation: string;
  assistante: string;
}

const FormationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [formation, setFormation] = useState<Formation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFormation = async () => {
      const { data, error } = await supabase
        .from("formations")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Erreur lors de la récupération de la formation:", error);
      } else {
        setFormation(data);
      }
      setLoading(false);
    };

    fetchFormation();
  }, [id]);

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (!formation) {
    return <p>Formation introuvable.</p>;
  }

  return (
    <div style={styles.container}>
      <h1>{formation.nom}</h1>
      <p><strong>Produit:</strong> {formation.produit}</p>
      <p><strong>Centre:</strong> {formation.centre}</p>
      <p><strong>N° Produit:</strong> {formation.numProduit}</p>
      <p><strong>N° Offre:</strong> {formation.numOffre}</p>
      <p><strong>Type d'Offre:</strong> {formation.typeOffre}</p>
      <p><strong>Date de début:</strong> {formation.dateDebut}</p>
      <p><strong>Date de fin:</strong> {formation.dateFin}</p>
      <p><strong>Prévus CRIF:</strong> {formation.prevusCrif}</p>
      <p><strong>Prévus MP:</strong> {formation.prevusMp}</p>
      <p><strong>Inscrits CRIF:</strong> {formation.inscritsCrif}</p>
      <p><strong>Inscrits MP:</strong> {formation.inscritsMp}</p>
      <p><strong>À recruter:</strong> {formation.aRecruter}</p>
      <p><strong>Commentaires/Actions:</strong> {formation.commentaires}</p>
      <p><strong>Entrés en formation:</strong> {formation.entresFormation}</p>
      <p><strong>Numéro KAIROS:</strong> {formation.numKairos}</p>
      <p><strong>Convocation OK ?</strong> {formation.convocationOk ? "Oui" : "Non"}</p>
      <p><strong>Assistante:</strong> {formation.assistante}</p>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    textAlign: "center",
    padding: "20px",
    maxWidth: "600px",
    margin: "auto",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    paddingTop: "30px",
  },
};

export default FormationDetail;
