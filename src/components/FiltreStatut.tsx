import React from "react";

interface FiltreStatutProps {
  statuts: string[];
  filtreActuel: string;
  setFiltre: (statut: string) => void;
  setSearch: (search: string) => void;  // 🔥 Ajout de la recherche
  setSortOrder: (order: 'asc' | 'desc') => void;  // 🔥 Ajout du tri
}

const FiltreStatut: React.FC<FiltreStatutProps> = ({ statuts, filtreActuel, setFiltre, setSearch, setSortOrder }) => {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
      {/* 🔹 Sélecteur de tri */}
      <select onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}>
        <option value="desc">Trier par date (descendant)</option>
        <option value="asc">Trier par date (ascendant)</option>
      </select>

      {/* 🔹 Filtres de statut */}
      <div style={{ display: "flex", gap: "5px" }}>
        {statuts.map((statut) => (
          <button
            key={statut}
            onClick={() => setFiltre(statut)}
            style={{
              fontWeight: filtreActuel === statut ? "bold" : "normal",
              padding: "5px",
              cursor: "pointer",
              background: filtreActuel === statut ? "#007bff" : "#f0f0f0",
              color: filtreActuel === statut ? "white" : "black",
              border: "1px solid #ccc",
              borderRadius: "5px"
            }}
          >
            {statut}
          </button>
        ))}
      </div>

      {/* 🔹 Barre de recherche */}
      <input
        type="text"
        placeholder="Rechercher..."
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "5px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          width: "200px"
        }}
      />
    </div>
  );
};

export default FiltreStatut;
