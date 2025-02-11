/**
 * useCommentaires.ts - Hook personnalisé pour gérer les commentaires liés aux formations.
 * Ce hook permet de charger, ajouter et écouter les changements en temps réel des commentaires.
 * 
 * Objectif : Permettre à un novice de comprendre facilement le fonctionnement et de modifier le code si nécessaire.
 */

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { CommentaireDB } from '../types';

/**
 * Définition de l'interface représentant le résultat retourné par le hook.
 * Cela assure un typage strict et une meilleure lisibilité du code.
 */
interface UseCommentairesResult {
  commentaires: CommentaireDB[]; // Liste des commentaires récupérés depuis Supabase
  isLoading: boolean; // Indique si une requête est en cours
  error: string | null; // Stocke les erreurs éventuelles
  addCommentaire: (formationId: number, text: string) => Promise<void>; // Fonction pour ajouter un commentaire
  loadCommentaires: (formationId: number) => Promise<void>; // Fonction pour charger les commentaires d'une formation donnée
}

/**
 * Hook personnalisé pour gérer les commentaires d'une formation.
 * @param formationId - L'identifiant de la formation pour laquelle récupérer les commentaires.
 * @returns Un objet contenant les commentaires, un état de chargement, une éventuelle erreur,
 * ainsi que des fonctions pour ajouter et recharger les commentaires.
 */
export const useCommentaires = (formationId?: number): UseCommentairesResult => {
  // États internes du hook
  const [commentaires, setCommentaires] = useState<CommentaireDB[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fonction pour charger les commentaires d'une formation spécifique depuis Supabase.
   * @param id - L'identifiant de la formation.
   */
  const loadCommentaires = useCallback(async (id: number) => {
    if (!id) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: loadError } = await supabase
        .from('commentaires')
        .select('*')
        .eq('formation_id', id)
        .order('created_at', { ascending: false });

      if (loadError) {
        throw new Error(loadError.message);
      }

      setCommentaires(data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des commentaires:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des commentaires');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fonction pour ajouter un nouveau commentaire à la formation.
   * @param id - L'identifiant de la formation.
   * @param text - Le texte du commentaire.
   */
  const addCommentaire = useCallback(async (id: number, text: string) => {
    if (!text.trim() || !id) return;

    setIsLoading(true);
    setError(null);

    try {
      const now = new Date().toISOString();
      const newComment = {
        formation_id: id,
        text: text.trim(),
        created_at: now
      };

      const { data, error: insertError } = await supabase
        .from('commentaires')
        .insert([newComment])
        .select()
        .single();

      if (insertError) {
        throw new Error(insertError.message);
      }

      if (data) {
        setCommentaires(prev => [data, ...prev]); // Ajoute le commentaire en haut de la liste
      }
    } catch (err) {
      console.error('Erreur lors de l\'ajout du commentaire:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'ajout du commentaire');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * useEffect : Charge les commentaires lors du montage du composant ou du changement de formationId.
   */
  useEffect(() => {
    if (formationId) {
      loadCommentaires(formationId);
    }
  }, [formationId, loadCommentaires]);

  /**
   * useEffect : Abonne le composant aux changements en temps réel sur les commentaires liés à une formation.
   */
  useEffect(() => {
    if (!formationId) return;

    const channel = supabase
      .channel(`commentaires-${formationId}`)
      .on('postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'commentaires',
          filter: `formation_id=eq.${formationId}`
        },
        (payload) => {
          console.log('🔄 Changement reçu:', payload);
          // Recharger les commentaires après un changement
          loadCommentaires(formationId);
        }
      )
      .subscribe((status) => {
        console.log('🟢 Status de la subscription:', status);
      });

    // Nettoyage lors du démontage du composant
    return () => {
      console.log('🔴 Désabonnement de la subscription Supabase');
      channel.unsubscribe();
    };
  }, [formationId, loadCommentaires]);

  return {
    commentaires,
    isLoading,
    error,
    addCommentaire,
    loadCommentaires
  };
};
