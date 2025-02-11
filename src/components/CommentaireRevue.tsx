import React, { useState } from "react";
import { useCommentaires } from "../hooks/useCommentaires";

interface CommentaireRevueProps {
  formationId: number;
}

const CommentaireRevue: React.FC<CommentaireRevueProps> = ({ formationId }) => {
  const [newComment, setNewComment] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  
  const {
    commentaires,
    isLoading,
    error,
    addCommentaire
  } = useCommentaires(formationId);

  const validCommentaires = commentaires || [];
  const lastComment = validCommentaires[0]; // Les commentaires sont déjà triés par date

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await addCommentaire(formationId, newComment.trim());
      setNewComment(""); // Réinitialiser le champ après l'ajout
    } catch (err) {
      console.error("Erreur lors de l'ajout du commentaire:", err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mt-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      {/* Dernier commentaire */}
      <div className="mb-4">
        <h3 className="font-semibold text-lg mb-2">Dernier commentaire</h3>
        {isLoading ? (
          <p className="text-gray-500">Chargement...</p>
        ) : lastComment ? (
          <div className="bg-gray-50 p-3 rounded">
            <p>{lastComment.text}</p>
            <p className="text-sm text-gray-500 mt-1">
              {formatDate(lastComment.created_at)}
            </p>
          </div>
        ) : (
          <p className="text-gray-500">Aucun commentaire</p>
        )}
      </div>

      {/* Formulaire d'ajout */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Ajouter un commentaire..."
            className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !newComment.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isLoading ? "..." : "Ajouter"}
          </button>
        </div>
      </form>

      {/* Historique des commentaires */}
      <div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="text-blue-500 hover:text-blue-600 text-sm"
        >
          {showHistory ? "Masquer l'historique" : "Voir l'historique"}
        </button>

        {showHistory && validCommentaires.length > 1 && (
          <div className="mt-4 space-y-3">
            {validCommentaires.slice(1).map((comment) => (
              <div key={comment.id} className="border-t pt-3">
                <p>{comment.text}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {formatDate(comment.created_at)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentaireRevue;