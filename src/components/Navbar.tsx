import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav style={styles.navbar}>
      <Link to="/" style={styles.navLink}>Accueil</Link>
      <Link to="/formations" style={styles.navLink}>Formations</Link>
      <Link to="/dashboard" style={styles.navLink}>Dashboard</Link>
      <Link to="/mgo" style={styles.navLink}>MGO</Link> {/* Nouveau lien */}
      <Link to="/login" style={styles.navLink}>Login</Link>
      <Link to="/revue-hebdo" style={{ color: "white" }}>📆 Revue Hebdo</Link> {/* 🆕 Lien ajouté */}


    </nav>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  navbar: {
    width: "100%",
    backgroundColor: "#007bff",
    padding: "10px",
    display: "flex",
    justifyContent: "center",
    gap: "20px",
  },
  navLink: {
    color: "white",
    textDecoration: "none",
    fontSize: "18px",
    fontWeight: "bold",
  },
};

export default Navbar;
