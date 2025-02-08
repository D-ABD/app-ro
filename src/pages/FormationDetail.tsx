import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import FormationInfo from "../components/FormationInfo";
import CommentSection from "../components/CommentSection";
import { CommentaireDB, Formation } from "../types";

// Composant de page de détail pour une formation
// Gère le chargement, l'affichage et l'interaction avec les données d'une formation
const FormationDetail: React.FC = () => {
  // Récupère l'ID de formation depuis l'URL
  // useParams est un hook de React Router qui permet d'extraire les paramètres de l'URL
  const { id } = useParams<{ id: string }>();

  // États pour gérer les données de la page
  // Utilisation de useState pour créer des états réactifs
  const [formation, setFormation] = useState<Formation | null>(null);
  const [commentaires, setCommentaires] = useState<CommentaireDB[]>([]);
  const [loading, setLoading] = useState(true);

  // Hook useEffect pour charger les données de la formation au montage du composant
  // Se déclenche à chaque changement de l'ID de formation
  useEffect(() => {
    // Fonction asynchrone pour récupérer les données de formation et de commentaires
    const fetchFormation = async () => {
      try {
        // Active l'état de chargement
        setLoading(true);

        // Requête Supabase pour récupérer les détails de la formation
        const { data: formationData, error: formationError } = await supabase
          .from("formations")
          .select("*")
          .eq("id", id)
          .single(); // .single() car on veut un seul enregistrement

        // Gestion des erreurs de requête de formation
        if (formationError) throw formationError;

        // Requête Supabase pour récupérer les commentaires liés à cette formation
        const { data: commentairesData, error: commentairesError } = await supabase
          .from("commentaires")
          .select("*")
          .eq("formation_id", id)
          .order("created_at", { ascending: false }); // Trie des commentaires du plus récent au plus ancien

        // Gestion des erreurs de requête de commentaires
        if (commentairesError) throw commentairesError;

        // Met à jour les états avec les données récupérées
        setFormation(formationData);
        setCommentaires(commentairesData || []); // Utilise un tableau vide si pas de commentaires
      } catch (error) {
        // Affiche l'erreur dans la console en cas de problème
        console.error("Erreur lors de la récupération:", error);
      } finally {
        // Désactive l'état de chargement, que la requête réussisse ou échoue
        setLoading(false);
      }
    };

    // Appelle la fonction de récupération
    fetchFormation();
  }, [id]); // Dépendance : se réexécute si l'ID change

  // Fonction pour ajouter un nouveau commentaire
  // Utilisation de useCallback pour optimiser les performances
  // Mémoïse la fonction pour éviter des re-rendus inutiles
  const handleAddComment = useCallback(async (text: string) => {
    // Validation de base : vérifie que l'ID existe et que le texte n'est pas vide
    if (!id || !text.trim()) {
      throw new Error("Données invalides");
    }

    try {
      // Génère un timestamp ISO pour la date de création
      const now = new Date().toISOString();
      
      // Prépare l'objet de nouveau commentaire
      const newComment = {
        formation_id: parseInt(id),
        text: text.trim(),
        date: now,           // Champ date requis
        created_at: now      // Timestamp de création
      };

      // Insère le nouveau commentaire dans Supabase
      const { data, error } = await supabase
        .from("commentaires")
        .insert([newComment])
        .select()
        .single();

      // Gestion des erreurs d'insertion
      if (error) {
        console.error("Erreur Supabase:", error);
        throw error;
      }

      // Met à jour l'état des commentaires si l'insertion réussit
      // Ajoute le nouveau commentaire au début du tableau
      if (data) {
        setCommentaires(prev => [data, ...prev]);
      }
    } catch (error) {
      // Gère et propage toute erreur survenue
      console.error("Erreur lors de l'ajout du commentaire:", error);
      throw error;
    }
  }, [id]); // Dépendance : se met à jour si l'ID change

  // Gestion de l'état de chargement
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <p>Chargement...</p>
      </div>
    );
  }

  // Gestion du cas où la formation n'est pas trouvée
  if (!formation) {
    return (
      <div style={{ textAlign: "center", padding: "20px", color: "#dc3545" }}>
        <p>❌ Formation introuvable.</p>
      </div>
    );
  }

  // Rendu principal du composant
  return (
    <div style={{ 
      maxWidth: "1200px",  // Limite la largeur du contenu
      margin: "0 auto",    // Centre le contenu
      padding: "20px"      // Ajoute de l'espace autour du contenu
    }}>
      {/* Titre de la formation */}
      <h1 style={{ 
        textAlign: "center", 
        marginBottom: "20px" 
      }}>{formation.nom}</h1>

      {/* Composant d'informations détaillées de la formation */}
      <FormationInfo formation={formation} />

      {/* Section des commentaires */}
      <CommentSection 
        commentaires={commentaires}  // Passe les commentaires existants
        onAddComment={handleAddComment}  // Passe la fonction pour ajouter un commentaire
      />
    </div>
  );
};

export default FormationDetail;