import React, { useState, useMemo } from "react";
import { CommentaireDB } from "../types";

// Définition du composant CommentSection avec ses propriétés
// Ce composant gère une section de commentaires avec possibilité d'ajouter de nouveaux commentaires
const CommentSection: React.FC<{ 
  // Liste des commentaires existants 
  commentaires: CommentaireDB[],
  // Fonction pour ajouter un nouveau commentaire
  onAddComment: (text: string) => Promise<void>
}> = ({ commentaires = [], onAddComment }) => {
  // État pour gérer le nouveau commentaire en cours de saisie
  const [newComment, setNewComment] = useState<string>("");
  
  // État pour afficher/masquer l'historique des commentaires
  const [showHistory, setShowHistory] = useState<boolean>(false);
  
  // État pour gérer le processus de soumission du commentaire
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // État pour gérer et afficher les erreurs
  const [error, setError] = useState<string>("");

  // Utilisation de useMemo pour optimiser le traitement des commentaires
  // Sépare le dernier commentaire des commentaires historiques
  const { lastComment, historicComments } = useMemo(() => {
    // Si aucun commentaire, retourne des valeurs par défaut
    if (!commentaires.length) return { lastComment: null, historicComments: [] };
    
    // Trie les commentaires du plus récent au plus ancien
    const sorted = [...commentaires].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    // Retourne le dernier commentaire et le reste comme historique
    return {
      lastComment: sorted[0],
      historicComments: sorted.slice(1)
    };
  }, [commentaires]); // Recalcule uniquement si la liste de commentaires change

  // Gestionnaire de soumission de nouveau commentaire
  const handleSubmit = async () => {
    // Supprime les espaces en début et fin du commentaire
    const trimmedComment = newComment.trim();
    
    // Vérifie que le commentaire n'est pas vide
    if (!trimmedComment) {
      setError("Le commentaire ne peut pas être vide");
      return;
    }

    try {
      // Désactive le bouton de soumission pendant le traitement
      setIsSubmitting(true);
      // Efface les erreurs précédentes
      setError("");
      
      // Appelle la fonction pour ajouter le commentaire
      await onAddComment(trimmedComment);
      
      // Réinitialise le champ de saisie après soumission
      setNewComment("");
    } catch (error) {
      // Gère les erreurs potentielles lors de l'ajout du commentaire
      console.error("Erreur lors de l'ajout du commentaire:", error);
      setError("Une erreur est survenue lors de l'ajout du commentaire");
    } finally {
      // Réactive le bouton de soumission
      setIsSubmitting(false);
    }
  };

  // Fonction pour formater la date dans un format lisible en français
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
      {/* En-tête de la section commentaires */}
      <div style={styles.header}>
        <h2 style={styles.title}>💬 Commentaires</h2>
        
        {/* Bouton pour afficher/masquer l'historique des commentaires */}
        {historicComments.length > 0 && (
          <button 
            onClick={() => setShowHistory(!showHistory)}
            style={styles.historyButton}
          >
            {showHistory ? "Masquer l'historique" : "Voir l'historique des commentaires"}
          </button>
        )}
      </div>

      {/* Conteneur de saisie pour nouveau commentaire */}
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Ajouter un commentaire"
          style={styles.input}
          disabled={isSubmitting}
          // Permet de soumettre le commentaire en appuyant sur Entrée
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        />
        {/* Bouton d'ajout de commentaire */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          style={{
            ...styles.addButton,
            ...(isSubmitting && styles.buttonDisabled)
          }}
        >
          {isSubmitting ? "..." : "➕"}
        </button>
      </div>

      {/* Affichage des erreurs */}
      {error && <p style={styles.error}>{error}</p>}

      {/* Section du dernier commentaire */}
      {lastComment && (
        <div style={styles.lastComment}>
          <h3 style={styles.sectionTitle}>Dernier commentaire</h3>
          <div style={styles.commentItem}>
            <p style={styles.commentText}>{lastComment.text}</p>
            <p style={styles.date}>{formatDate(lastComment.created_at)}</p>
          </div>
        </div>
      )}

      {/* Section historique des commentaires */}
      {showHistory && historicComments.length > 0 && (
        <div style={styles.history}>
          <h3 style={styles.sectionTitle}>Historique</h3>
          <div style={styles.commentsList}>
            {/* Affiche tous les commentaires historiques */}
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

// Définition des styles pour le composant
// Utilise un objet pour stocker tous les styles CSS-in-JS
const styles: { [key: string]: React.CSSProperties } = {
  // Styles pour le conteneur principal des commentaires
  commentContainer: {
    padding: "20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: {
    margin: 0,
    fontSize: "1.5rem",
    fontWeight: "600",
  },
  inputContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #dee2e6",
    fontSize: "14px",
  },
  addButton: {
    padding: "10px 20px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  error: {
    color: "#dc3545",
    fontSize: "14px",
    marginTop: "-10px",
    marginBottom: "15px",
  },
  historyButton: {
    padding: "8px 16px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  commentItem: {
    backgroundColor: "white",
    padding: "15px",
    borderRadius: "4px",
    marginBottom: "10px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  commentText: {
    margin: "0 0 10px 0",
    fontSize: "14px",
  },
  date: {
    fontSize: "12px",
    color: "#6c757d",
  },
  lastComment: {
    marginBottom: "20px",
  },
  history: {
    marginTop: "20px",
  },
  sectionTitle: {
    fontSize: "1.1rem",
    marginBottom: "15px",
    color: "#495057",
  },
  commentsList: {
    maxHeight: "400px",
    overflowY: "auto",
  },
};

export default CommentSection;