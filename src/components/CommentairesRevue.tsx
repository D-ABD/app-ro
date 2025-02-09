import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CommentaireDB } from "../types";

interface CommentaireRevueProps {
  formationId: number;
  commentaires: CommentaireDB[];
  onAddComment: (text: string) => Promise<void>;
}

const CommentaireRevue: React.FC<CommentaireRevueProps> = ({ formationId, commentaires, onAddComment }) => {
  const [newComment, setNewComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  // Récupérer uniquement le dernier commentaire
  const lastComment = useMemo(() => {
    if (!commentaires.length) return null;
    return [...commentaires].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];
  }, [commentaires]);

  const handleSubmit = async () => {
    const trimmedComment = newComment.trim();
    
    if (!trimmedComment) {
      setError("Le commentaire ne peut pas être vide");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      await onAddComment(trimmedComment);
      setNewComment("");
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error);
      setError("Une erreur est survenue lors de l'ajout du commentaire.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={styles.commentContainer}>
      <h2 style={styles.title}>💬 Commentaire</h2>

      {/* Dernier commentaire */}
      {lastComment ? (
        <div style={styles.lastComment}>
          <p style={styles.commentText}>{lastComment.text}</p>
          <p style={styles.date}>{formatDate(lastComment.created_at)}</p>
        </div>
      ) : (
        <p>Aucun commentaire.</p>
      )}

      {/* Ajout d'un nouveau commentaire */}
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
          disabled={isSubmitting} 
          style={{ ...styles.addButton, ...(isSubmitting ? styles.buttonDisabled : {}) }}
        >
          {isSubmitting ? "..." : "➕"}
        </button>
      </div>
      {error && <p style={styles.error}>{error}</p>}

      {/* Bouton pour accéder aux détails de la formation */}
      <button 
        onClick={() => navigate(`/formations/${formationId}`)} // Modifiez ici
        style={styles.detailsButton}
      >
        📋 Voir Détails
      </button>
    </div>
  );
};

// Définition des styles CSS-in-JS
const styles: { [key: string]: React.CSSProperties } = {
  // Conteneur principal avec fond légèrement gris
  commentContainer: { 
    padding: "10px", 
    backgroundColor: "#f8f9fa", 
    borderRadius: "8px" 
  },
  // Titre du composant
  title: { 
    fontSize: "1.2rem", 
    fontWeight: "bold" 
  },
  // Style du dernier commentaire
  lastComment: { 
    padding: "10px", 
    backgroundColor: "white", 
    borderRadius: "4px", 
    marginBottom: "5px" 
  },
  // Style du texte du commentaire
  commentText: { 
    margin: "0 0 5px 0", 
    fontSize: "14px" 
  },
  // Style de la date
  date: { 
    fontSize: "12px", 
    color: "#666" 
  },
  // Conteneur de saisie de commentaire
  inputContainer: { 
    display: "flex", 
    gap: "10px", 
    marginBottom: "10px" 
  },
  // Style de l'input
  input: { 
    flex: 1, 
    padding: "8px", 
    borderRadius: "4px", 
    border: "1px solid #ccc" 
  },
  // Bouton d'ajout de commentaire
  addButton: { 
    padding: "8px 16px", 
    backgroundColor: "#28a745", 
    color: "white", 
    borderRadius: "4px" 
  },
  // Style du bouton désactivé
  buttonDisabled: { 
    opacity: 0.5, 
    cursor: "not-allowed" 
  },
  // Style des messages d'erreur
  error: { 
    color: "#dc3545", 
    fontSize: "14px", 
    marginTop: "5px" 
  },
  // Bouton de détails de la formation
  detailsButton: { 
    padding: "8px 16px", 
    backgroundColor: "#007bff", 
    color: "white", 
    borderRadius: "4px", 
    marginTop: "10px" 
  },
};

export default CommentaireRevue;