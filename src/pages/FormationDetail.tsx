import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Formation } from "../types";
import { useFormationUpdate } from "../hooks/useFormationUpdate";
import FormationInfo from "../components/FormationInfo";
import CommentaireRevue from "../components/CommentaireRevue";

const FormationDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [formation, setFormation] = useState<Formation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { updateFormation, isUpdating, error: updateError } = useFormationUpdate();

  useEffect(() => {
    if (!id) {
      navigate('/formations');
      return;
    }

    const fetchFormation = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: formationError } = await supabase
          .from("formations")
          .select("*")
          .eq("id", id)
          .single();

        if (formationError) throw formationError;
        setFormation(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur de chargement';
        setError(message);
        console.error("Erreur lors de la récupération:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFormation();
  }, [id, navigate]);

  const handleFormationUpdate = async <K extends keyof Formation>(
    field: K,
    value: Formation[K]
  ): Promise<void> => {
    if (!formation?.id) return;

    try {
      const result = await updateFormation(formation.id, field, value);
      if (result.success) {
        setFormation(prev => prev ? { ...prev, [field]: value } : null);
      } else {
        setError(result.error || 'Erreur de mise à jour');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur de mise à jour';
      setError(message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error || updateError) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>❌ {error || updateError?.message}</p>
        </div>
      </div>
    );
  }

  if (!formation || !id) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>⚠️ Formation introuvable.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {isUpdating && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow">
          Mise à jour en cours...
        </div>
      )}

      <h1 className="text-3xl font-bold text-center mb-8">
        {formation.nom}
      </h1>

      <FormationInfo
        formation={formation}
        onUpdate={handleFormationUpdate}
      />

      <CommentaireRevue formationId={parseInt(id)} />
    </div>
  );
};

export default FormationDetail;