import React from "react";

const Accueil: React.FC = () => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>Bienvenue sur <span style={styles.highlight}>App-RO</span></h1>
        <p style={styles.subtitle}>Votre application est bien configurée et centrée horizontalement !</p>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center", // Assure que le contenu est bien aligné dans la hauteur
    textAlign: "center",
    width: "100%",
    padding: "20px",
    backgroundColor: "#f8f9fa", // Ajoute un fond léger pour un effet plus moderne
    minHeight: "90vh", // S'assure que la page a un bon espace
  },
  content: {
    backgroundColor: "#ffffff", // Fond blanc du bloc de contenu
    padding: "40px",
    borderRadius: "10px", // Coins arrondis pour un design moderne
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Ombre douce pour un effet élégant
    maxWidth: "600px", // Limite la largeur pour une meilleure lisibilité
    width: "80%", // S'adapte bien sur mobile
  },
  title: {
    fontSize: "2rem",
    color: "#333",
    marginBottom: "10px",
  },
  highlight: {
    color: "#007bff", // Bleu vif pour mettre en avant "App-RO"
  },
  subtitle: {
    fontSize: "1.2rem",
    color: "#555",
  },
};

export default Accueil;
