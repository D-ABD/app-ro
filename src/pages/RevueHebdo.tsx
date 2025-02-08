import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

interface Commentaire {
  text: string;
  date: string;
}

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
  commentaires?: Commentaire[];
}

const RevueHebdo: React.FC = () => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [modifiedFormations, setModifiedFormations] = useState<{ [key: number]: Partial<Formation> }>({});
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({});
  const [showHistory, setShowHistory] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    fetchFormations();
  }, []);

  const fetchFormations = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("formations").select("*");

    if (error) console.error("❌ Erreur de récupération :", error);
    else setFormations(data);

    setLoading(false);
  };

  const calculateARecruter = (formation: Formation): number => {
    const totalPlaces = formation.totalPlaces || 0;
    const totalInscrits = (formation.inscritsCrif || 0) + (formation.inscritsMp || 0);
    return Math.max(totalPlaces - totalInscrits, 0);
  };

  const handleInputChange = (id: number, field: keyof Formation, value: number) => {
    setModifiedFormations((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const validateChanges = async (id: number) => {
    if (!modifiedFormations[id]) return;

    const { error } = await supabase.from("formations").update(modifiedFormations[id]).eq("id", id);

    if (error) {
      console.error(`❌ Erreur de mise à jour pour la formation ${id} :`, error);
    } else {
      console.log(`✅ Modifications enregistrées pour la formation ${id}`);
      setModifiedFormations((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
      fetchFormations(); // Rafraîchir les données affichées
    }
  };

  const handleAddComment = async (id: number) => {
    if (!newComment[id]) return;

    const formation = formations.find(f => f.id === id);
    if (!formation) return;

    const updatedComments = [
      { text: newComment[id], date: new Date().toLocaleString() },
      ...(formation.commentaires || [])
    ];

    const { error } = await supabase
      .from("formations")
      .update({ commentaires: JSON.stringify(updatedComments) })
      .eq("id", id);

    if (error) {
      console.error("❌ Erreur d'ajout du commentaire :", error);
    } else {
      console.log(`✅ Commentaire ajouté pour la formation ${id}`);
      fetchFormations();
      setNewComment((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const getStatus = (formation: Formation) => {
    const placesRestantes = calculateARecruter(formation);
    const cap = formation.cap || Math.floor((formation.totalPlaces || 0) * 0.8);

    if (placesRestantes === 0) return "Complet";
    if (placesRestantes < 3) return "Quasi Complet";
    if (placesRestantes >= 3 && placesRestantes < cap) return "À Recruter";
    return "Annulée";
  };

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
        <>
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
                <th>Dernier Commentaire</th>
                <th>Historique</th>
                <th>Ajouter Commentaire</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {formations.map((formation) => {
                const status = getStatus(formation);
                const color = status === "Complet" ? "green" : status === "Quasi Complet" ? "orange" : status === "À Recruter" ? "red" : "gray";

                return (
                  <tr key={formation.id}>
                    <td>{formation.nom}</td>
                    <td>{formation.centre}</td>
                    <td>{formation.dateDebut}</td>
                    <td>{formation.dateFin}</td>

                    <td>
                      <input
                        type="number"
                        value={modifiedFormations[formation.id]?.totalPlaces ?? formation.totalPlaces ?? 0}
                        onChange={(e) => handleInputChange(formation.id, "totalPlaces", Number(e.target.value))}
                        min="0"
                      />
                      <button onClick={() => validateChanges(formation.id)}>✔</button>
                    </td>

                    <td>{formation.inscritsCrif}</td>
                    <td>{formation.inscritsMp}</td>
                    <td>{calculateARecruter(formation)}</td>
                    <td style={{ color, fontWeight: "bold" }}>{status}</td>

                    <td>
                      {formation.commentaires && formation.commentaires.length > 0 ? (
                        <span>{formation.commentaires[0].text} ({formation.commentaires[0].date})</span>
                      ) : (
                        <span>Aucun commentaire</span>
                      )}
                    </td>

                    <td>
                      <button onClick={() => setShowHistory((prev) => ({ ...prev, [formation.id]: !prev[formation.id] }))}>
                        {showHistory[formation.id] ? "Masquer" : "Voir"}
                      </button>
                      {showHistory[formation.id] && (
                        <ul>
                          {formation.commentaires?.slice(1).map((comment, index) => (
                            <li key={index}>{comment.text} ({comment.date})</li>
                          ))}
                        </ul>
                      )}
                    </td>

                    <td>
                      <input type="text" value={newComment[formation.id] || ""} onChange={(e) => setNewComment({ ...newComment, [formation.id]: e.target.value })} />
                      <button onClick={() => handleAddComment(formation.id)}>➕</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default RevueHebdo;
