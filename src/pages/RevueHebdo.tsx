import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import CommentaireRevue from "../components/CommentairesRevue";
interface Formation {
  id: number;
  nom: string;
  centre: string;
  dateDebut: string;
  dateFin: string;
  prevusCrif?: number | null;
  prevusMp?: number | null;
  inscritsCrif?: number | null;
  inscritsMp?: number | null;
  aRecruter?: number | null;
  totalPlaces?: number | null;
  cap?: number | null;
  commentaires?: CommentaireDB[];
}

interface CommentaireDB {
  id: number;
  formation_id: number;
  text: string;
  created_at: string;
}

const RevueHebdo: React.FC = () => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  useEffect(() => {
    fetchFormations();
  }, []);

  const fetchFormations = async () => {
    setLoading(true);

    const { data: formationsData, error: formationsError } = await supabase
      .from("formations")
      .select("*");

    if (formationsError) {
      console.error("❌ Erreur de récupération des formations :", formationsError);
      setLoading(false);
      return;
    }

    const { data: commentairesData, error: commentairesError } = await supabase
      .from("commentaires")
      .select("*")
      .order("created_at", { ascending: false });

    if (commentairesError) {
      console.error("❌ Erreur de récupération des commentaires :", commentairesError);
      setLoading(false);
      return;
    }

    const formationsWithComments = formationsData.map((formation) => ({
      ...formation,
      commentaires: commentairesData.filter((comment) => comment.formation_id === formation.id),
    }));

    
    setFormations(formationsWithComments);
    setLoading(false);
  };

  const handleAddComment = async (formationId: number, text: string) => {
    if (!text.trim()) return;
  
    try {
      const now = new Date().toISOString();
      const newComment = {
        formation_id: formationId,
        text: text.trim(),
        date: now,  // Ajoutez explicitement le champ date
        created_at: now
      };
  
      const { data, error } = await supabase
        .from("commentaires")
        .insert([newComment])
        .select()
        .single();
  
      if (error) throw error;
  
      setFormations((prev) =>
        prev.map((formation) =>
          formation.id === formationId
            ? { ...formation, commentaires: [data, ...(formation.commentaires || [])] }
            : formation
        )
      );
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout du commentaire :", error);
      throw error;  // Relancez l'erreur pour la gestion côté composant
    }
  };

  const calculateARecruter = (formation: Formation): number => {
    const totalPlaces = formation.totalPlaces || 0;
    const totalInscrits = (formation.inscritsCrif || 0) + (formation.inscritsMp || 0);
    return Math.max(totalPlaces - totalInscrits, 0);
  };

  const getStatus = (formation: Formation) => {
    const placesRestantes = calculateARecruter(formation);
    const cap = formation.cap || Math.floor((formation.totalPlaces || 0) * 0.8);

    if (placesRestantes === 0) return "Complet";
    if (placesRestantes < 3) return "Quasi Complet";
    if (placesRestantes >= 3 && placesRestantes < cap) return "À Recruter";
    return "Annulée";
  };

  // Filtrer les formations en fonction du statut sélectionné
  const filteredFormations = selectedStatus === "all"
    ? formations
    : formations.filter(formation => getStatus(formation) === selectedStatus);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>📆 Revue des Offres</h1>

      {/* Filtrage par statut */}
      <label>Filtrer par statut :</label>
      <select onChange={(e) => setSelectedStatus(e.target.value)} value={selectedStatus}>
        <option value="all">Toutes</option>
        <option value="À Recruter">À Recruter</option>
        <option value="Quasi Complet">Quasi Complet</option>
        <option value="Complet">Complet</option>
        <option value="Annulée">Annulée</option>
      </select>

      {/* Tableau des formations */}
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <table border={1} style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Formation</th>
              <th>Centre</th>
              <th>Début</th>
              <th>Fin</th>
              <th>Places Totales</th>
              <th>Inscrits CRIF</th>
              <th>Inscrits MP</th>
              <th>Places restantes</th>
              <th>Statut</th>
              <th>Commentaire</th>
            </tr>
          </thead>
          <tbody>
            {filteredFormations.map((formation) => {
              const status = getStatus(formation);
              const color =
                status === "Complet"
                  ? "green"
                  : status === "Quasi Complet"
                  ? "orange"
                  : status === "À Recruter"
                  ? "red"
                  : "gray";

              return (
                <tr key={formation.id}>
                  <td>{formation.nom}</td>
                  <td>{formation.centre}</td>
                  <td>{formation.dateDebut}</td>
                  <td>{formation.dateFin}</td>
                  <td>{formation.totalPlaces}</td>
                  <td>{formation.inscritsCrif}</td>
                  <td>{formation.inscritsMp}</td>
                  <td>{calculateARecruter(formation)}</td>
                  <td style={{ color, fontWeight: "bold" }}>{status}</td>

                  {/* Utilisation du nouveau composant CommentaireRevue */}
                  <td>
                    <CommentaireRevue 
                      formationId={formation.id}
                      commentaires={formation.commentaires || []} 
                      onAddComment={(text) => handleAddComment(formation.id, text)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RevueHebdo;