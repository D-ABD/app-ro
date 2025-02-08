import React from "react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div style={styles.appContainer}>
        <Navbar />  {/* Barre de navigation */}
        <main style={styles.mainContent}>
          <AppRoutes />  {/* Routes dynamiques */}
        </main>
      </div>
    </BrowserRouter>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  appContainer: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  mainContent: {
    flex: 1,
    display: "flex",
    justifyContent: "center", // Centre horizontalement tout le contenu
    padding: "20px",
  },
};



export default App;
