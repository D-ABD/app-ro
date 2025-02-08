import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";

interface CommentaireDB {
  id: number;
  formation_id: number;
  text: string;
  date: string;
  created_at: string;
}

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
  entresFormation: number;
  numKairos: string;
  convocationOk: boolean;
  dateHeureConvocation: string;
  assistante: string;
}

// Composant pour les informations de base
const FormationInfo: React.FC<{ formation: Formation }> = React.memo(({ formation }) => (
  <div style={styles.infoContainer}>
    <div style={styles.gridContainer}>
      <div style={styles.gridItem}>
        <p><strong>📌 Produit:</strong> {formation.produit}</p>
        <p><strong>🏢 Centre:</strong> {formation.centre}</p>
        <p><strong>🔢 N° Produit:</strong> {formation.numProduit}</p>
        <p><strong>📋 N° Offre:</strong> {formation.numOffre}</p>
      </div>
      <div style={styles.gridItem}>
        <p><strong>🗂️ Type d'Offre:</strong> {formation.typeOffre}</p>
        <p><strong>📅 Début:</strong> {formation.dateDebut}</p>
        <p><strong>📅 Fin:</strong> {formation.dateFin}</p>
        <p><strong>📝 Prévus CRIF:</strong> {formation.prevusCrif}</p>
      </div>
      <div style={styles.gridItem}>
        <p><strong>📝 Prévus MP:</strong> {formation.prevusMp}</p>
        <p><strong>👥 Inscrits CRIF:</strong> {formation.inscritsCrif}</p>
        <p><strong>👥 Inscrits MP:</strong> {formation.inscritsMp}</p>
        <p><strong>🎯 À recruter:</strong> {formation.aRecruter}</p>
      </div>
      <div style={styles.gridItem}>
        <p><strong>🛠️ Entrés en formation:</strong> {formation.entresFormation}</p>
        <p><strong>🔢 Numéro KAIROS:</strong> {formation.numKairos}</p>
        <p><strong>📨 Convocation OK ?</strong> {formation.convocationOk ? "✅ Oui" : "❌ Non"}</p>
        <p><strong>👩‍💼 Assistante:</strong> {formation.assistante}</p>
      </div>
    </div>
  </div>
));


// Composant pour les commentaires
const CommentSection: React.FC<{
  commentaires: CommentaireDB[];
  onAddComment: (text: string) => Promise<void>;
}> = React.memo(({ commentaires, onAddComment }) => {
  const [newComment, setNewComment] = useState<string>("");
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Séparer et mémoriser le dernier commentaire et l'historique
  const { lastComment, historicComments } = React.useMemo(() => {
    if (!commentaires?.length) return { lastComment: null, historicComments: [] };
    
    // Trier tous les commentaires par date
    const sortedComments = [...commentaires].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return {
      lastComment: sortedComments[0],
      historicComments: sortedComments.slice(1)
    };
  }, [commentaires]);

  // Grouper les commentaires historiques par semaine
  const commentsByWeek = React.useMemo(() => {
    if (!historicComments?.length) return [];
    
    const grouped = historicComments.reduce((acc: { [key: string]: CommentaireDB[] }, comment) => {
      const date = new Date(comment.created_at);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!acc[weekKey]) {
        acc[weekKey] = [];
      }
      acc[weekKey].push(comment);
      return acc;
    }, {});

    // Trier les commentaires dans chaque semaine
    Object.values(grouped).forEach(weekComments => {
      weekComments.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

    return Object.entries(grouped)
      .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime());
  }, [historicComments]);

  const handleSubmit = async () => {
    if (!newComment.trim()) {
      setError("Le commentaire ne peut pas être vide");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      await onAddComment(newComment);
      setNewComment("");
    } catch (err) {
      setError("Erreur lors de l'enregistrement du commentaire. Veuillez réessayer.");
      console.error("Erreur d'ajout du commentaire:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Formater la date pour l'affichage
  const formatWeekDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    return date.toLocaleDateString('fr-FR', options);
  };

  return (
    <div style={styles.commentContainer}>
      <div style={styles.commentHeader}>
        <h2>💬 Commentaires</h2>
        {historicComments.length > 0 && (
          <button 
            onClick={() => setShowHistory(!showHistory)} 
            style={styles.historyButton}
          >
            {showHistory ? "Masquer l'historique" : "Voir l'historique"}
          </button>
        )}
      </div>

      <div style={styles.inputContainer}>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Ajouter un commentaire"
          style={styles.input}
          disabled={isSubmitting}
        />
        <button 
          onClick={handleSubmit} 
          style={{
            ...styles.addButton,
            ...(isSubmitting ? styles.buttonDisabled : {})
          }}
          disabled={isSubmitting}
        >
          {isSubmitting ? "..." : "➕"}
        </button>
      </div>
      {error && <p style={styles.errorMessage}>{error}</p>}

      {lastComment ? (
        <div style={styles.lastCommentContainer}>
          <h3 style={styles.lastCommentHeader}>Dernier commentaire :</h3>
          <div style={styles.commentItem}>
            <p style={styles.commentText}>{lastComment.text}</p>
            <p style={styles.commentDate}>
              {new Date(lastComment.created_at).toLocaleString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      ) : (
        <p>📝 Aucun commentaire</p>
      )}

      {showHistory && historicComments.length > 0 && (
        <div style={styles.historySection}>
          <h3 style={styles.historyHeader}>Historique des commentaires</h3>
          <div style={styles.commentsList}>
            {commentsByWeek.map(([weekDate, weekComments]) => (
              <div key={weekDate} style={styles.weekContainer}>
                <h4 style={styles.weekHeader}>
                  Semaine du {formatWeekDate(weekDate)}
                  <span style={styles.commentCount}>
                    ({weekComments.length} commentaire{weekComments.length > 1 ? 's' : ''})
                  </span>
                </h4>
                {weekComments.map((comment) => (
                  <div key={comment.id} style={styles.commentItem}>
                    <p style={styles.commentText}>{comment.text}</p>
                    <p style={styles.commentDate}>
                      {new Date(comment.created_at).toLocaleString('fr-FR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

const FormationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [formation, setFormation] = useState<Formation | null>(null);
  const [commentaires, setCommentaires] = useState<CommentaireDB[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFormation = useCallback(async () => {
    try {
      setLoading(true);
      // Récupérer la formation
      const { data: formationData, error: formationError } = await supabase
        .from("formations")
        .select("*")
        .eq("id", id)
        .single();

      if (formationError) throw formationError;

      // Récupérer les commentaires associés
      const { data: commentairesData, error: commentairesError } = await supabase
        .from("commentaires")
        .select("*")
        .eq("formation_id", id)
        .order("created_at", { ascending: false });

      if (commentairesError) throw commentairesError;

      setFormation(formationData);
      setCommentaires(commentairesData || []);
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des données :", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchFormation();
  }, [fetchFormation]);

  const handleAddComment = useCallback(async (text: string) => {
    if (!formation) throw new Error("Formation non trouvée");

    if (text.length > 500) {
      throw new Error("Le commentaire ne doit pas dépasser 500 caractères");
    }

    try {
      const newComment = {
        formation_id: formation.id,
        text,
        date: new Date().toLocaleString(),
        created_at: new Date().toISOString()
      };

      // Insertion dans la base de données
      const { data, error } = await supabase
        .from("commentaires")
        .insert([newComment])
        .select()
        .single();

      if (error) throw error;

      // Mise à jour du state avec le nouveau commentaire
      if (data) {
        setCommentaires(prev => [data, ...prev]);
      }
    } catch (error) {
      console.error("❌ Erreur d'ajout du commentaire :", error);
      throw error;
    }
  }, [formation]);

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (!formation) {
    return <p>❌ Formation introuvable.</p>;
  }

  return (
    <div style={styles.container}>
      <h1>{formation.nom}</h1>
      <FormationInfo formation={formation} />
      <CommentSection 
        commentaires={commentaires}
        onAddComment={handleAddComment}
      />
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    textAlign: "center",
    padding: "20px",
    maxWidth: "1200px",
    margin: "auto",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    paddingTop: "30px",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    padding: "15px",
  },
  gridItem: {
    backgroundColor: "#fff",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  infoContainer: {
    textAlign: "left",
    padding: "10px",
    margin: "10px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
  },
  commentContainer: {
    textAlign: "left",
    padding: "20px",
    margin: "20px 10px",
    backgroundColor: "#eef",
    borderRadius: "8px",
  },
  commentsList: {
    maxHeight: "400px",
    overflowY: "auto",
    padding: "10px",
  },
  commentItem: {
    padding: "10px",
    margin: "10px 0",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  commentText: {
    margin: "0 0 5px 0",
    fontSize: "14px",
  },
  commentDate: {
    margin: 0,
    fontSize: "12px",
    color: "#666",
  },
  inputContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "10px",
  },
  input: {
    padding: "8px",
    flex: 1,
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    marginTop: "10px",
    padding: "8px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  addButton: {
    padding: "8px 16px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  loadMoreButton: {
    width: "100%",
    padding: "8px",
    marginTop: "10px",
    backgroundColor: "#f0f0f0",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    color: "#666",
  },
  errorMessage: {
    color: "#dc3545",
    fontSize: "14px",
    marginTop: "5px",
    textAlign: "left",
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
};

export default FormationDetail;