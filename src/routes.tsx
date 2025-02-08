import React from "react";
import { Routes, Route } from "react-router-dom";
import Accueil from "./pages/Accueil";
import Formations from "./pages/Formations";
import Dashboard from "./pages/Dashboard";
import Mgo from "./pages/Mgo";
import FormationDetail from "./pages/FormationDetail";
import TestSupabase from "./testSupabase";
import RevueHebdo from "./pages/RevueHebdo";


const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Accueil />} />
      <Route path="/formations" element={<Formations />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/mgo" element={<Mgo />} />
      <Route path="/formations/:id" element={<FormationDetail />} />
      <Route path="/test-supabase" element={<TestSupabase />} />
      <Route path="/revue-hebdo" element={<RevueHebdo />} /> {/* 🆕 Ajout de la route */}






    </Routes>
  );
};

export default AppRoutes;
