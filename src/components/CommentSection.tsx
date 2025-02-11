// Importation des dépendances React et des hooks nécessaires
import React, { useState, useMemo } from "react";
// Import du type qui définit la structure d'un commentaire
import { CommentaireDB } from "../types";

// Importation des icônes de la librairie react-icons
import { FaPlus, FaHistory, FaTimes } from "react-icons/fa";

// Définition du composant avec ses props typées
const CommentSection: React.FC<{ 
  commentaires: CommentaireDB[],           // Liste des commentaires
  onAddComment: (text: string) => Promise<void>  // Fonction pour ajouter un commentaire
}> = ({ commentaires = [], onAddComment }) => {
  // États locaux du composant
  const [newComment, setNewComment] = useState<string>(""); // Texte du nouveau commentaire
  const [showHistory, setShowHistory] = useState<boolean>(false); // Affichage de l'historique
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // État de soumission
  const [error, setError] = useState<string>(""); // Message d'erreur

  // Calcul mémorisé du dernier commentaire et de l'historique
  const { lastComment, historicComments } = useMemo(() => {
    // Si pas de commentaires, retourne des valeurs par défaut
    if (!commentaires.length) return { lastComment: null, historicComments: [] };
    
    // Trie les commentaires par date (plus récent en premier)
    const sorted = [...commentaires].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    // Retourne le dernier commentaire et l'historique
    return { 
      lastComment: sorted[0],          // Premier commentaire (le plus récent)
      historicComments: sorted.slice(1) // Tous les autres commentaires
    };
  }, [commentaires]); // Recalcule uniquement si commentaires change

  // Gestion de l'ajout d'un nouveau commentaire
  const handleSubmit = async () => {
    const trimmedComment = newComment.trim();
    // Validation : le commentaire ne peut pas être vide
    if (!trimmedComment) {
      setError("Le commentaire ne peut pas être vide.");
      return;
    }

    try {
      setIsSubmitting(true); // Début de la soumission
      setError(""); // Réinitialisation des erreurs
      await onAddComment(trimmedComment); // Appel de la fonction d'ajout
      setNewComment(""); // Réinitialisation du champ
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error);
      setError("Une erreur est survenue lors de l'ajout du commentaire.");
    } finally {
      setIsSubmitting(false); // Fin de la soumission
    }
  };

  // Fonction utilitaire pour formater les dates
  const formatDate = (date: string) =>
    new Date(date).toLocaleString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });

  // Rendu du composant
  return (
    <div style={styles.commentContainer}>
      {/* En-tête avec titre et bouton d'historique */}
      <div style={styles.header}>
        <h2 style={styles.title}>💬 Commentaires</h2>
        {historicComments.length > 0 && (
          <button onClick={() => setShowHistory(!showHistory)} style={styles.historyButton}>
            {showHistory ? <FaTimes /> : <FaHistory />} 
            {showHistory ? "Masquer l'historique" : "Voir l'historique"}
          </button>
        )}
      </div>

      {/* Zone de saisie du nouveau commentaire */}
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Ajouter un commentaire..."
          style={styles.input}
          disabled={isSubmitting}
          onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
        />
        <button 
          onClick={handleSubmit} 
          disabled={isSubmitting} 
          style={{ ...styles.addButton, ...(isSubmitting && styles.buttonDisabled) }}
        >
          {isSubmitting ? "..." : <FaPlus />}
        </button>
      </div>

      {/* Affichage des erreurs éventuelles */}
      {error && <p style={styles.error}>{error}</p>}

      {/* Affichage du dernier commentaire */}
      {lastComment && (
        <div style={styles.lastComment}>
          <h3 style={styles.sectionTitle}>📝 Dernier commentaire</h3>
          <div style={styles.commentItem}>
            <p style={styles.commentText}>{lastComment.text}</p>
            <p style={styles.date}>{formatDate(lastComment.created_at)}</p>
          </div>
        </div>
      )}

      {/* Affichage de l'historique des commentaires */}
      {showHistory && historicComments.length > 0 && (
        <div style={styles.history}>
          <h3 style={styles.sectionTitle}>📜 Historique</h3>
          <div style={styles.commentsList}>
            {historicComments.map((comment) => (
              <div key={comment.id} style={styles.commentItem}>
                <p style={styles.commentText}>{comment.text}</p>
                <p style={styles.date}>{formatDate(comment.created_at)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Définition des styles CSS-in-JS
const styles: { [key: string]: React.CSSProperties } = {
  commentContainer: {
    padding: "20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    maxWidth: "500px",
    margin: "auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },
  title: {
    margin: 0,
    fontSize: "1.4rem",
    fontWeight: "bold",
  },
  inputContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ced4da",
    fontSize: "14px",
  },
  addButton: {
    padding: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background 0.3s ease",
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  error: {
    color: "#dc3545",
    fontSize: "13px",
    marginBottom: "10px",
  },
  historyButton: {
    padding: "8px 12px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  commentItem: {
    backgroundColor: "white",
    padding: "12px",
    borderRadius: "6px",
    marginBottom: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  commentText: {
    margin: "0 0 6px 0",
    fontSize: "14px",
  },
  date: {
    fontSize: "12px",
    color: "#6c757d",
  },
  lastComment: {
    marginBottom: "15px",
  },
  history: {
    marginTop: "15px",
  },
  sectionTitle: {
    fontSize: "1.1rem",
    marginBottom: "10px",
    color: "#495057",
  },
  commentsList: {
    maxHeight: "250px",
    overflowY: "auto",
  },
};

export default CommentSection;
