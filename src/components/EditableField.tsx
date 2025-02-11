/**
 * EditableField.tsx - Composant réutilisable permettant l'édition en ligne de champs.
 * 
 * Objectif : Permettre aux utilisateurs de modifier des valeurs de manière contrôlée avec validation automatique.
 * Ce composant peut être utilisé pour différents types de données (texte, nombre, date) et est facilement configurable.
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * Définition des types de valeurs acceptées par l'input.
 */
type ValueType = string | number | null;

/**
 * Définition des props attendues par le composant EditableField.
 * - `value` : Valeur actuelle du champ éditable.
 * - `onUpdate` : Fonction asynchrone à appeler lors de la validation du champ.
 * - `type` : Type de champ (texte, nombre, date).
 * - `label` : Libellé affiché avant le champ.
 * - `className` : Classe CSS optionnelle.
 * - `disabled` : Booléen indiquant si le champ est désactivé.
 */
interface EditableFieldProps<K extends ValueType> {
  value: K;
  onUpdate: (value: K) => Promise<void>;
  type?: 'text' | 'number' | 'date';
  label?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * Composant EditableField : Permet d'afficher et modifier une valeur avec validation.
 */
export const EditableField = <K extends ValueType>({
  value,
  onUpdate,
  type = 'text',
  label,
  className = '',
  disabled = false
}: EditableFieldProps<K>) => {
  // États internes
  const [isEditing, setIsEditing] = useState(false); // Indique si l'utilisateur est en mode édition
  const [localValue, setLocalValue] = useState<K>(value); // Valeur temporaire avant validation
  const [isUpdating, setIsUpdating] = useState(false); // Indique si une mise à jour est en cours

  /**
   * Met à jour `localValue` chaque fois que `value` change.
   */
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  /**
   * Fonction appelée lors de la perte de focus.
   * Vérifie si la valeur a changé et déclenche la mise à jour via `onUpdate`.
   */
  const handleBlur = useCallback(async () => {
    if (!isEditing) return;

    const newValue = type === 'number' ? (Number(localValue) as K) : (localValue as K);
    
    if (newValue === value) {
      setIsEditing(false);
      return;
    }

    setIsUpdating(true);
    try {
      await onUpdate(newValue);
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur de mise à jour:', error);
      setLocalValue(value); // Rétablit l'ancienne valeur en cas d'erreur
    } finally {
      setIsUpdating(false);
    }
  }, [isEditing, localValue, value, type, onUpdate]);

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {/* Affichage du label si présent */}
      {label && <span className="font-medium">{label}:</span>}
      
      {/* Input modifiable */}
      <input
        type={type}
        value={(localValue ?? '') as string} // Assure qu'on ne passe pas `null` à l'input
        onChange={(e) => setLocalValue(e.target.value as K)}
        onFocus={() => setIsEditing(true)}
        onBlur={handleBlur}
        disabled={disabled || isUpdating}
        className={`
          px-2 py-1 border rounded 
          focus:outline-none focus:ring-2 focus:ring-blue-500
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${type === 'number' ? 'w-20' : 'w-full'}
        `}
      />
      
      {/* Indicateur de mise à jour en cours */}
      {isUpdating && <span className="text-sm text-blue-500">💾</span>}
    </div>
  );
};
