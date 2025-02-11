import { useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { Formation } from '../types';

// Types pour la gestion des mises à jour et des erreurs
interface UpdateError {
  field: string;
  message: string;
}

interface UpdateFormationResult {
  updateFormation: <K extends keyof Formation>(
    id: number,
    field: K,
    value: Formation[K]
  ) => Promise<{ success: boolean; error?: string }>;
  updateMultipleFields: (
    id: number,
    updates: Partial<Formation>
  ) => Promise<{ success: boolean; error?: string }>;
  isUpdating: boolean;
  error: UpdateError | null;
  clearError: () => void;
}

export const useFormationUpdate = (): UpdateFormationResult => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<UpdateError | null>(null);

  // Fonction pour effacer les erreurs
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fonction pour mettre à jour un seul champ
  const updateFormation = useCallback(async <K extends keyof Formation>(
    id: number,
    field: K,
    value: Formation[K]
  ): Promise<{ success: boolean; error?: string }> => {
    setIsUpdating(true);
    setError(null);

    try {
      // Validation basique des données avant mise à jour
      if (id <= 0) {
        throw new Error('ID de formation invalide');
      }

      // Création de l'objet de mise à jour
      const updateData = { [field]: value };

      // Mise à jour dans Supabase
      const { error: updateError } = await supabase
        .from('formations')
        .update(updateData)
        .eq('id', id)
        .single();

      if (updateError) {
        setError({
          field: field.toString(),
          message: updateError.message
        });
        return { success: false, error: updateError.message };
      }

      return { success: true };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError({
        field: field.toString(),
        message: errorMessage
      });
      return { success: false, error: errorMessage };

    } finally {
      setIsUpdating(false);
    }
  }, []);

  // Fonction pour mettre à jour plusieurs champs à la fois
  const updateMultipleFields = useCallback(async (
    id: number,
    updates: Partial<Formation>
  ): Promise<{ success: boolean; error?: string }> => {
    setIsUpdating(true);
    setError(null);

    try {
      if (id <= 0) {
        throw new Error('ID de formation invalide');
      }

      const { error: updateError } = await supabase
        .from('formations')
        .update(updates)
        .eq('id', id)
        .single();

      if (updateError) {
        setError({
          field: 'multiple',
          message: updateError.message
        });
        return { success: false, error: updateError.message };
      }

      return { success: true };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError({
        field: 'multiple',
        message: errorMessage
      });
      return { success: false, error: errorMessage };

    } finally {
      setIsUpdating(false);
    }
  }, []);

  return {
    updateFormation,
    updateMultipleFields,
    isUpdating,
    error,
    clearError
  };
};