// --- IMPORTS ---
// Import de React et du hook useState pour la gestion d'état
import React, { useState } from "react";
// Import du client Supabase pour la connexion à la base de données
import { supabase } from "../supabaseClient";
// Import du type Formation qui définit la structure des données
import { Formation } from "../types";

// --- DÉFINITION DU COMPOSANT ---
// Composant React pour la gestion des formations (Mgo)
const Mgo: React.FC = () => {
  // --- ÉTATS (STATES) ---
  // État de chargement pour les opérations asynchrones
  const [loading, setLoading] = useState(false);
  // État pour gérer les messages d'erreur
  const [error, setError] = useState<string | null>(null);
  // État pour gérer les messages de succès
  const [success, setSuccess] = useState<string | null>(null);

  // État principal du formulaire
  // Utilisation de Omit<Formation, "id"> pour exclure l'id qui sera généré automatiquement
  const [formData, setFormData] = useState<Omit<Formation, "id">>({
    // Champs obligatoires
    nom: "",            // Nom de la formation
    centre: "",         // Centre de formation
    // Champs optionnels
    produit: null,      // Nom du produit
    numProduit: null,   // Numéro du produit
    numOffre: null,     // Numéro de l'offre
    typeOffre: null,    // Type d'offre
    dateDebut: null,    // Date de début
    dateFin: null,      // Date de fin
    prevusCrif: null,   // Nombre prévu CRIF
    prevusMp: null,     // Nombre prévu MP
    inscritsCrif: null, // Inscrits CRIF
    inscritsMp: null,   // Inscrits MP
    aRecruter: null,    // Nombre à recruter
    entresFormation: null, // Entrées en formation
    numKairos: null,    // Numéro Kairos
    convocation_envoie: false, // État des convocations
    assistante: null,   // Nom de l'assistante
    totalPlaces: null,  // Total des places
    cap: null,         // Capacité
  });

  // --- GESTIONNAIRES D'ÉVÉNEMENTS ---
  // Gestion des modifications des champs du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: 
        type === "number" ? (value ? Number(value) : null) :  // Conversion en nombre pour les champs numériques
        type === "checkbox" ? e.target.checked :              // Gestion des cases à cocher
        value || null,                                       // Valeur normale ou null si vide
    }));
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();                    // Empêche le rechargement de la page
    setLoading(true);                     // Active l'indicateur de chargement
    setError(null);                       // Réinitialise les erreurs
    setSuccess(null);                     // Réinitialise les succès

    // Validation des champs obligatoires
    if (!formData.nom || !formData.centre) {
      setError("Veuillez remplir les champs obligatoires.");
      setLoading(false);
      return;
    }

    // Insertion des données dans Supabase
    const { data, error } = await supabase.from("formations").insert([formData]).select();

    // Gestion des erreurs et du succès
    if (error) {
      console.error("Erreur Supabase :", error);
      setError(`Erreur lors de la création : ${error.message}`);
    } else {
      console.log("Formation créée avec succès :", data);
      setSuccess("Formation ajoutée avec succès !");
      // Réinitialisation du formulaire
      setFormData({
        nom: "",
        centre: "",
        produit: null,
        numProduit: null,
        numOffre: null,
        typeOffre: null,
        dateDebut: null,
        dateFin: null,
        prevusCrif: null,
        prevusMp: null,
        inscritsCrif: null,
        inscritsMp: null,
        aRecruter: null,
        entresFormation: null,
        numKairos: null,
        convocation_envoie: false,
        assistante: null,
        totalPlaces: null,
        cap: null,
      });
    }

    setLoading(false);  // Désactive l'indicateur de chargement
  };

  // --- RENDU DU COMPOSANT ---
  return (
    <div style={styles.container}>
      <h1>Créer une formation</h1>
      {/* Affichage des messages d'erreur et de succès */}
      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}
      
      {/* Formulaire de création de formation */}
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Champs obligatoires */}
        <input 
          type="text" 
          name="nom" 
          placeholder="Nom de la formation *" 
          value={formData.nom} 
          onChange={handleChange} 
          required 
        />
        <input 
          type="text" 
          name="centre" 
          placeholder="Centre *" 
          value={formData.centre} 
          onChange={handleChange} 
          required 
        />
        
        {/* Champs optionnels */}
        <input 
          type="text" 
          name="produit" 
          placeholder="Produit (optionnel)" 
          value={formData.produit || ""} 
          onChange={handleChange} 
        />
        <input 
          type="text" 
          name="numProduit" 
          placeholder="Numéro Produit (optionnel)" 
          value={formData.numProduit || ""} 
          onChange={handleChange} 
        />
        <input 
          type="text" 
          name="numOffre" 
          placeholder="Numéro Offre (optionnel)" 
          value={formData.numOffre || ""} 
          onChange={handleChange} 
        />
        <input 
          type="text" 
          name="typeOffre" 
          placeholder="Type Offre (optionnel)" 
          value={formData.typeOffre || ""} 
          onChange={handleChange} 
        />
        <input 
          type="date" 
          name="dateDebut" 
          value={formData.dateDebut || ""} 
          onChange={handleChange} 
        />
        <input 
          type="date" 
          name="dateFin" 
          value={formData.dateFin || ""} 
          onChange={handleChange} 
        />
        <input 
          type="number" 
          name="prevusCrif" 
          placeholder="Prévus CRIF (optionnel)" 
          value={formData.prevusCrif || ""} 
          onChange={handleChange} 
        />
        <input 
          type="number" 
          name="prevusMp" 
          placeholder="Prévus MP (optionnel)" 
          value={formData.prevusMp || ""} 
          onChange={handleChange} 
        />
        <input 
          type="number" 
          name="inscritsCrif" 
          placeholder="Inscrits CRIF (optionnel)" 
          value={formData.inscritsCrif || ""} 
          onChange={handleChange} 
        />
        <input 
          type="number" 
          name="inscritsMp" 
          placeholder="Inscrits MP (optionnel)" 
          value={formData.inscritsMp || ""} 
          onChange={handleChange} 
        />
        <input 
          type="number" 
          name="aRecruter" 
          placeholder="À recruter (optionnel)" 
          value={formData.aRecruter || ""} 
          onChange={handleChange} 
        />
        <input 
          type="number" 
          name="entresFormation" 
          placeholder="Entrées Formation (optionnel)" 
          value={formData.entresFormation || ""} 
          onChange={handleChange} 
        />
        <input 
          type="text" 
          name="numKairos" 
          placeholder="Num Kairos (optionnel)" 
          value={formData.numKairos || ""} 
          onChange={handleChange} 
        />
        
        {/* Sélecteur pour l'état des convocations */}
        <select 
          name="convocation_envoie" 
          value={formData.convocation_envoie ? "true" : "false"} 
          onChange={handleChange}
        >
          <option value="false">Convocation non envoyée</option>
          <option value="true">Convocation envoyée</option>
        </select>
        
        <input 
          type="text" 
          name="assistante" 
          placeholder="Assistante (optionnel)" 
          value={formData.assistante || ""} 
          onChange={handleChange} 
        />

        {/* Bouton de soumission */}
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Création..." : "Créer la formation"}
        </button>
      </form>
    </div>
  );
};

// --- STYLES ---
// Définition des styles avec typage CSS React
const styles: { [key: string]: React.CSSProperties } = {
  container: { 
    padding: "20px", 
    maxWidth: "500px", 
    margin: "auto" 
  },
  form: { 
    display: "flex", 
    flexDirection: "column", 
    gap: "10px" 
  },
  button: { 
    padding: "10px", 
    backgroundColor: "#007bff", 
    color: "white", 
    border: "none", 
    cursor: "pointer" 
  },
  error: { 
    color: "red" 
  },
  success: { 
    color: "green" 
  }
};

// Export du composant
export default Mgo;