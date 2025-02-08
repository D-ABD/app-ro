import React from "react";

const Dashboard: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1>Tableau de Bord</h1>
      <p>Bienvenue sur votre Dashboard.</p>
      <div style={styles.stats}>
        <p>📌 Formations Actives : 5</p>
        <p>📊 Taux de Remplissage : 80%</p>
        <p>⏳ Formations en Attente : 2</p>
        <p>👨‍🎓 Total Inscrits : 120</p>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    textAlign: "center",
    padding: "20px",
  },
  stats: {
    backgroundColor: "#f5f5f5",
    padding: "20px",
    borderRadius: "8px",
    display: "inline-block",
    textAlign: "left",
    marginTop: "20px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
};

export default Dashboard;
