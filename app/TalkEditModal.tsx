"use client";

import { useState, useEffect } from "react";
import { Talk, SessionType } from "./types";

const SESSION_TYPES: { value: SessionType; label: string }[] = [
  { value: "KEYNOTE", label: "Keynote" },
  { value: "SESSION", label: "Sesión" },
  { value: "LIGHTNING", label: "Lightning Talk" },
  { value: "WORKSHOP", label: "Workshop" },
  { value: "PANEL", label: "Panel" },
  { value: "NETWORKING", label: "Networking" },
  { value: "BREAK", label: "Break" },
  { value: "LUNCH", label: "Almuerzo" },
];

interface TalkEditModalProps {
  talk: Talk | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<Talk>) => void;
}

export default function TalkEditModal({ talk, isOpen, onClose, onSave }: TalkEditModalProps) {
  const [formData, setFormData] = useState<Partial<Talk>>({});

  useEffect(() => {
    if (talk) {
      setFormData({
        title: talk.title,
        type: talk.type,
        description: talk.description || "",
        tags: talk.tags || [],
        speaker: talk.speaker || undefined,
        sponsorLogo: talk.sponsorLogo || "",
      });
    }
  }, [talk]);

  if (!isOpen || !talk) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleTagsChange = (value: string) => {
    setFormData((prev) => ({ ...prev, tags: value.split(",").map((t) => t.trim()).filter(Boolean) }));
  };

  const handleSpeakerChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      speaker: {
        name: prev.speaker?.name || "",
        role: prev.speaker?.role || "",
        avatar: prev.speaker?.avatar || "",
        [field]: value,
      },
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Editar Charla</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Titulo */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Título</label>
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Tipo</label>
              <select
                value={formData.type || "SESSION"}
                onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value as SessionType }))}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              >
                {SESSION_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* Descripcion */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Descripción</label>
              <textarea
                value={formData.description || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            {/* Tags */}
            {!["NETWORKING", "BREAK", "LUNCH"].includes(formData.type || "") && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Tags (separados por coma)</label>
                <input
                  type="text"
                  value={formData.tags?.join(", ") || ""}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  placeholder="Platform, Kubernetes, Cloud"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}

            {/* Speaker */}
            {!["NETWORKING", "BREAK", "LUNCH"].includes(formData.type || "") && (
            <div className="border border-slate-600 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-slate-300">Speaker</h3>
                {formData.speaker && (
                  <button type="button" onClick={() => setFormData((prev) => ({ ...prev, speaker: undefined }))} className="text-xs text-red-400 hover:text-red-300">
                    Quitar
                  </button>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={formData.speaker?.name || ""}
                    onChange={(e) => handleSpeakerChange("name", e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Rol / Empresa</label>
                  <input
                    type="text"
                    value={formData.speaker?.role || ""}
                    onChange={(e) => handleSpeakerChange("role", e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Avatar URL</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="url"
                      value={formData.speaker?.avatar || ""}
                      onChange={(e) => handleSpeakerChange("avatar", e.target.value)}
                      placeholder="https://..."
                      className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                    {formData.speaker?.avatar && (
                      <img src={formData.speaker.avatar} alt="preview" className="w-8 h-8 rounded-full object-cover" />
                    )}
                  </div>
                </div>
              </div>
            </div>
            )}

            {/* Sponsor Logo (solo para Lightning) */}
            {formData.type === "LIGHTNING" && (
              <div className="border border-yellow-600/50 rounded-lg p-4 bg-yellow-900/10">
                <label className="block text-sm font-medium text-yellow-400 mb-2">Logo del Sponsor</label>
                <input
                  type="url"
                  value={formData.sponsorLogo || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, sponsorLogo: e.target.value }))}
                  placeholder="https://ejemplo.com/logo.png"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-500"
                />
                {formData.sponsorLogo && (
                  <div className="mt-3 flex items-center gap-3">
                    <img
                      src={formData.sponsorLogo}
                      alt="Logo preview"
                      className="h-10 object-contain bg-white rounded p-1"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                    <span className="text-xs text-slate-400">Vista previa</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors text-sm">
                Cancelar
              </button>
              <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors text-sm">
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
