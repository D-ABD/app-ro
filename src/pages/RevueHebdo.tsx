import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { FormationAvecCommentaires, Formation } from "../types";
import { useFormationUpdate } from '../hooks/useFormationUpdate';
import FiltreStatut from '../components/FiltreStatut';
import ListeFormations from '../components/ListeFormations';
import CommentaireRevue from '../components/CommentaireRevue';

const STATUTS = ["🟢 Complet", "🟠 Quasi Complet", "🔴 À Recruter", "⚪ Annulée"];
const FORMATIONS_PAR_PAGE = 5;

const RevueHebdo: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [filtre, setFiltre] = useState("Toutes");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [formations, setFormations] = useState<FormationAvecCommentaires[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const { updateFormation } = useFormationUpdate();

  const fetchFormations = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: formationsData, error: formationsError } = await supabase
        .from('formations')
        .select('*')
        .order('dateDebut', { ascending: true });

      if (formationsError) throw formationsError;

      const { data: commentairesData, error: commentairesError } = await supabase
        .from('commentaires')
        .select('*')
        .order('created_at', { ascending: false });

      if (commentairesError) throw commentairesError;

      const formattedData: FormationAvecCommentaires[] = (formationsData || []).map((formation) => ({
        ...formation,
        totalPlaces: (formation.prevusCrif ?? 0) + (formation.prevusMp ?? 0),
        commentaires: (commentairesData || [])
          .filter(comment => comment.formation_id === formation.id)
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      }));

      setFormations(formattedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormations();
  }, []);

  // Mise à jour adaptée pour gérer FormationAvecCommentaires
  const handleFormationUpdate = async <K extends keyof Formation>(
    formationId: number,
    field: K,
    value: Formation[K]
  ): Promise<void> => {
    try {
      const result = await updateFormation(formationId, field, value);
      if (result.success) {
        setFormations(prev => prev.map(formation => {
          if (formation.id === formationId) {
            return {
              ...formation,
              [field]: value
            };
          }
          return formation;
        }));
      } else {
        setError(result.error || 'Erreur de mise à jour');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de mise à jour');
    }
  };

  // Fonction wrapper pour satisfaire le type attendu par ListeFormations
  const handleFormationUpdateWrapper = <K extends keyof FormationAvecCommentaires>(
    id: number,
    field: K,
    value: FormationAvecCommentaires[K]
  ): void => {
    // On vérifie si le champ fait partie de Formation avant de le mettre à jour
    if (field in formations[0]) {
      // On exclut le champ "commentaires" qui n'existe pas dans Formation
      if (field !== 'commentaires') {
        handleFormationUpdate(id, field as keyof Formation, value as Formation[keyof Formation]);
      }
    }
  };

  const formationsFiltrees = useMemo(() => {
    let result = formations;

    if (filtre !== "Toutes") {
      result = result.filter(f => {
        const placesRestantes = (f.aRecruter ?? 0) - ((f.inscritsCrif ?? 0) + (f.inscritsMp ?? 0));
        if (filtre === "🟢 Complet" && placesRestantes <= 0) return true;
        if (filtre === "🟠 Quasi Complet" && placesRestantes < 3 && placesRestantes > 0) return true;
        if (filtre === "🔴 À Recruter" && placesRestantes > 3) return true;
        if (filtre === "⚪ Annulée" && f.aRecruter === null) return true;
        return false;
      });
    }

    if (search.trim()) {
      result = result.filter(f => 
        f.nom.toLowerCase().includes(search.toLowerCase()) ||
        f.centre.toLowerCase().includes(search.toLowerCase())
      );
    }

    return result.sort((a, b) => {
      const dateA = a.dateDebut ? new Date(a.dateDebut).getTime() : 0;
      const dateB = b.dateDebut ? new Date(b.dateDebut).getTime() : 0;
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [formations, filtre, search, sortOrder]);

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6">Revue Hebdo</h1>

      <FiltreStatut
        statuts={STATUTS}
        filtreActuel={filtre}
        setFiltre={setFiltre}
        setSearch={setSearch}
        setSortOrder={setSortOrder}
      />

      {loading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      ) : (
        <>
          {formationsFiltrees
            .slice((page - 1) * FORMATIONS_PAR_PAGE, page * FORMATIONS_PAR_PAGE)
            .map((formation) => (
              <div key={formation.id} className="mb-8">
                <ListeFormations
                  formations={[formation]}
                  onUpdate={handleFormationUpdateWrapper}
                />
                <CommentaireRevue formationId={formation.id} />
              </div>
            ))}

          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => setPage(p => p - 1)}
              disabled={page === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Précédent
            </button>
            <span className="py-2">
              Page {page} sur {Math.ceil(formationsFiltrees.length / FORMATIONS_PAR_PAGE)}
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page * FORMATIONS_PAR_PAGE >= formationsFiltrees.length}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Suivant
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default RevueHebdo;