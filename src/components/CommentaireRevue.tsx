import React, { useState } from "react";

interface Commentaire {
  id: number;
  formation_id: number;
  text: string;
  created_at: string;
}

interface CommentaireRevueProps {
  formationId: number;
  commentaires?: Commentaire[];  // Optionnel pour éviter les erreurs
  onAddComment: (formationId: number, text: string) => void;
}

const CommentaireRevue: React.FC<CommentaireRevueProps> = ({ formationId, commentaires = [], onAddComment }) => {
  const [newComment, setNewComment] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  const validCommentaires = Array.isArray(commentaires) ? commentaires : [];
  const lastComment = validCommentaires.length > 0 ? validCommentaires[validCommentaires.length - 1] : null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  };

  return (
    <div style={styles.container}>
      <p><strong>Dernier commentaire :</strong> {lastComment ? lastComment.text : "Aucun commentaire"}</p>
      {lastComment && <p style={styles.date}>Ajouté le : {formatDate(lastComment.created_at)}</p>}
      
      <input
        type="text"
        placeholder="Ajouter un commentaire..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        style={styles.input}
      />
      <button onClick={() => { 
        if (newComment.trim()) {
          onAddComment(formationId, newComment.trim()); 
          setNewComment(""); 
        }
      }} style={styles.button}>
        Ajouter
      </button>

      <button onClick={() => setShowHistory(!showHistory)} style={styles.historyButton}>
        {showHistory ? "Masquer l'historique" : "Voir l'historique"}
      </button>

      {showHistory && (
        <div style={styles.history}>
          <h4>Historique des commentaires :</h4>
          {validCommentaires.length > 1 ? (
            validCommentaires.slice(0, -1).map((comment) => (
              <p key={comment.id}>{formatDate(comment.created_at)} - {comment.text}</p>
            ))
          ) : (
            <p>Aucun autre commentaire</p>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: "10px", border: "1px solid #ccc", borderRadius: "5px", marginTop: "10px" },
  input: { padding: "5px", width: "80%", marginBottom: "5px" },
  button: { padding: "5px", marginLeft: "5px", cursor: "pointer" },
  historyButton: { display: "block", marginTop: "5px", cursor: "pointer" },
  history: { marginTop: "10px", padding: "5px", borderTop: "1px solid #ddd" },
  date: { fontSize: "12px", color: "#555" },
};

export default CommentaireRevue;
