import React, { useState, useEffect, useCallback, useMemo } from 'react';
import FiltreStatut from '../components/FiltreStatut';
import ListeFormations from '../components/ListeFormations';
import CommentaireRevue from '../components/CommentaireRevue';
import { supabase } from '../supabaseClient';

const STATUTS = ["🟢 Complet", "🟠 Quasi Complet", "🔴 À Recruter", "⚪ Annulée"];
const FORMATIONS_PAR_PAGE = 5;

interface Commentaire {
  id: number;
  formation_id: number;
  text: string;
  created_at: string;
}

interface Formation {
  id: number;
  nom: string;
  centre: string;
  produit: string;
  numProduit: string;
  numOffre: string;
  typeOffre: string;
  dateDebut: string;
  dateFin: string;
  prevusCrif: number | null;
  prevusMp: number | null;
  inscritsCrif: number | null;
  inscritsMp: number | null;
  aRecruter: number | null;
  entresFormation: number | null;
  numKairos: string;
  convocation_envoie: boolean;
  assistante: string;
  totalPlaces: number;
  cap: number;
  commentaires: Commentaire[];
}

const RevueHebdo: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [filtre, setFiltre] = useState<string>("Toutes");
  const [search, setSearch] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [formations, setFormations] = useState<Formation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);

    
 
  const fetchFormations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('formations')
        .select(`id, nom, centre, produit, numProduit, numOffre, typeOffre, dateDebut, dateFin, prevusCrif, prevusMp, inscritsCrif, inscritsMp, aRecruter, entresFormation, numKairos, convocation_envoie, assistante, cap, commentaires!inner(id, formation_id, text, created_at)`) 
        .order('dateDebut', { ascending: true });
      
      if (error) throw new Error(error.message);
      
      const formattedData: Formation[] = (data || []).map((formation) => ({
        ...formation,
        totalPlaces: (formation.prevusCrif ?? 0) + (formation.prevusMp ?? 0),
        commentaires: Array.isArray(formation.commentaires) ? formation.commentaires : []
      }));
      
      setFormations(formattedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFormations();
  }, [fetchFormations]);

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

    if (search.trim() !== "") {
      result = result.filter(f => f.nom.toLowerCase().includes(search.toLowerCase()));
    }

    result = result.sort((a, b) => {
      const dateA = new Date(a.dateDebut).getTime();
      const dateB = new Date(b.dateDebut).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    return result;
  }, [formations, filtre, search, sortOrder]);

  const handleAddComment = async (formationId: number, text: string) => {
    try {
      const now = new Date().toISOString();
  
      const { data, error } = await supabase
        .from('commentaires')
        .insert([{ 
          formation_id: formationId, 
          text, 
          date: now, 
          created_at: now 
        }])
        .select();
  
      if (error) throw error;
  
      if (data) {
        setFormations((prevFormations) =>
          prevFormations.map((formation) =>
            formation.id === formationId
              ? { ...formation, commentaires: [...formation.commentaires, ...data] }
              : formation
          )
        );
      }
    } catch (err) {
      console.error("Erreur lors de l'ajout du commentaire", err);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h1>Revue Hebdo</h1>
      <FiltreStatut statuts={STATUTS} filtreActuel={filtre} setFiltre={setFiltre} setSearch={setSearch} setSortOrder={setSortOrder} />
      {formationsFiltrees.slice((page - 1) * FORMATIONS_PAR_PAGE, page * FORMATIONS_PAR_PAGE).map((formation) => (
        <div key={formation.id}>
          <ListeFormations formations={[formation]} />
          <CommentaireRevue formationId={formation.id} commentaires={formation.commentaires} onAddComment={handleAddComment} />
        </div>
      ))}
      <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>Précédent</button>
        <span style={{ margin: '0 10px' }}>Page {page} / {Math.ceil(formationsFiltrees.length / FORMATIONS_PAR_PAGE)}</span>
        <button onClick={() => setPage(page + 1)} disabled={page * FORMATIONS_PAR_PAGE >= formationsFiltrees.length}>Suivant</button>
      </div>
    </div>
  );
};

export default RevueHebdo;
