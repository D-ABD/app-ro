import React from "react";
import { Formation } from "../types";
import { EditableField } from "./EditableField";

interface FormationInfoProps {
  formation: Formation;
  onUpdate: <K extends keyof Formation>(field: K, value: Formation[K]) => Promise<void>;
}

const FormationInfo: React.FC<FormationInfoProps> = ({ formation, onUpdate }) => {
  const handleUpdate = async <K extends keyof Formation>(field: K, value: string | number | boolean | null) => {
    try {
      let convertedValue: Formation[K];

      switch (field) {
        case 'convocation_envoie':
          convertedValue = (value ? true : false) as Formation[K];
          break;
        case 'prevusCrif':
        case 'prevusMp':
        case 'inscritsCrif':
        case 'inscritsMp':
        case 'aRecruter':
        case 'entresFormation':
        case 'cap':
          convertedValue = (value === null ? 0 : Number(value)) as Formation[K];
          break;
        default:
          convertedValue = (value ?? "") as Formation[K];
      }

      await onUpdate(field, convertedValue);
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du champ ${field}:`, error);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-6">
      <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <EditableField value={formation.produit ?? ""} onUpdate={(value) => handleUpdate('produit', value)} type="text" label="📌 Produit" />
          <EditableField value={formation.centre ?? ""} onUpdate={(value) => handleUpdate('centre', value)} type="text" label="🏢 Centre" />
          <EditableField value={formation.typeOffre ?? ""} onUpdate={(value) => handleUpdate('typeOffre', value)} type="text" label="🗂️ Type d'Offre" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <EditableField value={formation.numProduit ?? ""} onUpdate={(value) => handleUpdate('numProduit', value)} type="text" label="🔢 N° Produit" />
          <EditableField value={formation.numOffre ?? ""} onUpdate={(value) => handleUpdate('numOffre', value)} type="text" label="📋 N° Offre" />
          <EditableField value={formation.numKairos ?? ""} onUpdate={(value) => handleUpdate('numKairos', value)} type="text" label="🔢 Numéro KAIROS" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <EditableField value={formation.dateDebut ?? ""} onUpdate={(value) => handleUpdate('dateDebut', value)} type="date" label="📅 Début" />
          <EditableField value={formation.dateFin ?? ""} onUpdate={(value) => handleUpdate('dateFin', value)} type="date" label="📅 Fin" />
          <div className="bg-gray-50 rounded p-2">
            <label className="flex items-center gap-2">
              <span>📨 Convocation</span>
              <input
                type="checkbox"
                checked={!!formation.convocation_envoie}
                onChange={(e) => handleUpdate('convocation_envoie', e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span>{formation.convocation_envoie ? "✅ Oui" : "❌ Non"}</span>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <EditableField value={formation.prevusCrif ?? 0} onUpdate={(value) => handleUpdate('prevusCrif', value)} type="number" label="Prévus CRIF" />
          <EditableField value={formation.prevusMp ?? 0} onUpdate={(value) => handleUpdate('prevusMp', value)} type="number" label="Prévus MP" />
          <EditableField value={formation.inscritsCrif ?? 0} onUpdate={(value) => handleUpdate('inscritsCrif', value)} type="number" label="Inscrits CRIF" />
          <EditableField value={formation.inscritsMp ?? 0} onUpdate={(value) => handleUpdate('inscritsMp', value)} type="number" label="Inscrits MP" />
          <EditableField value={formation.aRecruter ?? 0} onUpdate={(value) => handleUpdate('aRecruter', value)} type="number" label="À recruter" />
          <EditableField value={formation.entresFormation ?? 0} onUpdate={(value) => handleUpdate('entresFormation', value)} type="number" label="Entrés" />
        </div>
        <div className="mt-4 pt-4 border-t text-right">
          <EditableField value={formation.assistante ?? ""} onUpdate={(value) => handleUpdate('assistante', value)} type="text" label="👩‍💼 Assistante" />
        </div>
      </div>
    </div>
  );
};

export default FormationInfo;