import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

interface Formation {
  id: number;
  nom: string;
  centre: string;
  produit?: string | null;
  numProduit?: string | null;
  numOffre?: string | null;
  typeOffre?: string | null;
  dateDebut?: string | null;
  dateFin?: string | null;
  prevusCrif?: number | null;
  prevusMp?: number | null;
  inscritsCrif?: number | null;
  inscritsMp?: number | null;
  aRecruter?: number | null;
  commentaires?: string | null;
  entresFormation?: number | null;
  numKairos?: string | null;
  convocationOk?: boolean | null;
  dateHeureConvocation?: string | null;
  assistante?: string | null;
}

const Mgo: React.FC = () => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Omit<Formation, "id">>({
    nom: "",
    centre: "",
    produit: "",
    numProduit: "",
    numOffre: "",
    typeOffre: "",
    dateDebut: "",
    dateFin: "",
    prevusCrif: null,
    prevusMp: null,
    inscritsCrif: null,
    inscritsMp: null,
    aRecruter: null,
    commentaires: "",
    entresFormation: null,
    numKairos: "",
    convocationOk: false,
    dateHeureConvocation: "",
    assistante: "",
  });

  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchFormations();
  }, []);

  const fetchFormations = async () => {
    const { data, error } = await supabase.from("formations").select("*");
    if (error) console.error("Erreur de récupération :", error);
    else setFormations(data);
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value || null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Vérification des champs obligatoires
    if (!formData.nom || !formData.centre) {
      alert("Veuillez remplir les champs obligatoires (Nom, Centre).");
      return;
    }

    const confirmationMessage = editingId
      ? "Voulez-vous vraiment modifier cette formation ?"
      : "Voulez-vous vraiment ajouter cette formation ?";
    
    if (!window.confirm(confirmationMessage)) return;

    // Remplacement des champs vides par `NULL`
    const cleanedFormData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, value === "" ? null : value])
    );

    console.log("📤 Données envoyées :", cleanedFormData);

    if (editingId) {
      const { error } = await supabase.from("formations").update(cleanedFormData).eq("id", editingId);
      if (error) {
        console.error("❌ Erreur de mise à jour :", error);
        alert("Une erreur s'est produite lors de la modification.");
      } else {
        alert("Formation modifiée avec succès !");
      }
      setEditingId(null);
    } else {
      const { error } = await supabase.from("formations").insert([cleanedFormData]);
      if (error) {
        console.error("❌ Erreur d'insertion :", error);
        alert("Une erreur s'est produite lors de l'ajout.");
      } else {
        alert("Formation ajoutée avec succès !");
      }
    }

    // Réinitialisation du formulaire
    setFormData({
      nom: "",
      centre: "",
      produit: "",
      numProduit: "",
      numOffre: "",
      typeOffre: "",
      dateDebut: "",
      dateFin: "",
      prevusCrif: null,
      prevusMp: null,
      inscritsCrif: null,
      inscritsMp: null,
      aRecruter: null,
      commentaires: "",
      entresFormation: null,
      numKairos: "",
      convocationOk: false,
      assistante: "",
    });

    fetchFormations();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette formation ?")) return;

    const { error } = await supabase.from("formations").delete().eq("id", id);
    if (error) {
      console.error("❌ Erreur de suppression :", error);
      alert("Une erreur s'est produite lors de la suppression.");
    } else {
      alert("Formation supprimée avec succès !");
      fetchFormations();
    }
  };

  const handleEdit = (formation: Formation) => {
    setFormData({ ...formation });
    setEditingId(formation.id);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Gestion des Formations</h1>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} style={{ maxWidth: "600px", margin: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
        <input type="text" name="nom" placeholder="Nom" value={formData.nom} onChange={handleChange} required />
        <input type="text" name="centre" placeholder="Centre" value={formData.centre} onChange={handleChange} required />
        <input type="text" name="produit" placeholder="Produit" value={formData.produit || ""} onChange={handleChange} />
        <input type="text" name="numProduit" placeholder="N° Produit" value={formData.numProduit || ""} onChange={handleChange} />
        <input type="text" name="numOffre" placeholder="N° Offre" value={formData.numOffre || ""} onChange={handleChange} />
        <input type="text" name="typeOffre" placeholder="Type Offre" value={formData.typeOffre || ""} onChange={handleChange} />
        <label>
        Date de Début :
        <input type="date" name="dateDebut" value={formData.dateDebut || ""} onChange={handleChange} />
        </label>

        <label>
        Date de Fin :
        <input type="date" name="dateFin" value={formData.dateFin || ""} onChange={handleChange} />
        </label>
        <input type="number" name="prevusCrif" placeholder="Prévus CRIF" value={formData.prevusCrif || ""} onChange={handleChange} />
        <input type="number" name="prevusMp" placeholder="Prévus MP" value={formData.prevusMp || ""} onChange={handleChange} />
        <input type="number" name="inscritsCrif" placeholder="Inscrits CRIF" value={formData.inscritsCrif || ""} onChange={handleChange} />
        <input type="number" name="inscritsMp" placeholder="Inscrits MP" value={formData.inscritsMp || ""} onChange={handleChange} />
        <input type="number" name="aRecruter" placeholder="A Recruter" value={formData.aRecruter || ""} onChange={handleChange} />
        <textarea name="commentaires" placeholder="Commentaires" value={formData.commentaires || ""} onChange={handleChange} rows={3} />
        <input type="number" name="entresFormation" placeholder="Entrés en Formation" value={formData.entresFormation || ""} onChange={handleChange} />
        <input type="text" name="numKairos" placeholder="N° Kairos" value={formData.numKairos || ""} onChange={handleChange} />
        <label>
          Convocation OK ?
          <input type="checkbox" name="convocationOk" checked={formData.convocationOk || false} onChange={handleChange} />
        </label>
        <input type="text" name="assistante" placeholder="Assistante" value={formData.assistante || ""} onChange={handleChange} />
        <button type="submit">{editingId ? "Modifier" : "Ajouter"} Formation</button>
      </form>

      {/* Liste des formations */}
      <h2>Liste des Formations</h2>
      {loading ? <p>Chargement...</p> : (
        <ul>
          {formations.map((formation) => (
            <li key={formation.id} style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
              {formation.nom} - {formation.produit || "N/A"} ({formation.centre})
              <button onClick={() => handleEdit(formation)}>✏️ Modifier</button>
              <button onClick={() => handleDelete(formation.id)}>🗑 Supprimer</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Mgo;
