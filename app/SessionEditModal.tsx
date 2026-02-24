"use client";

import { useState, useEffect } from "react";
import { Session, SessionType, Track } from "./types";

const SESSION_TYPES: { value: SessionType; label: string }[] = [
  { value: "KEYNOTE", label: "Keynote" },
  { value: "SESSION", label: "Sesión" },
  { value: "LIGHTNING", label: "Lightning Talk (5 min)" },
  { value: "WORKSHOP", label: "Workshop" },
  { value: "PANEL", label: "Panel" },
  { value: "NETWORKING", label: "Networking" },
  { value: "BREAK", label: "Break" },
  { value: "LUNCH", label: "Almuerzo" },
];

interface SessionEditModalProps {
  session: Session | null;
  tracks: Track[];
  isOpen: boolean;
  isCreating?: boolean;
  onClose: () => void;
  onSave: (updates: Partial<Session>) => void;
  onDelete: () => void;
  onReturnToBank?: () => void;
}

export default function SessionEditModal({
  session,
  tracks,
  isOpen,
  isCreating = false,
  onClose,
  onSave,
  onDelete,
  onReturnToBank,
}: SessionEditModalProps) {
  const [formData, setFormData] = useState<Partial<Session>>({});

  useEffect(() => {
    if (session) {
      setFormData({
        title: session.title,
        type: session.type,
        trackId: session.trackId,
        startTime: session.startTime,
        endTime: session.endTime,
        description: session.description || "",
        location: session.location || "",
        duration: session.duration || "",
        tags: session.tags || [],
        sponsorLogo: session.sponsorLogo || "",
      });
    }
  }, [session]);

  if (!isOpen || !session) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleTagsChange = (value: string) => {
    const tags = value.split(",").map((t) => t.trim()).filter(Boolean);
    setFormData((prev) => ({ ...prev, tags }));
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">{isCreating ? "Nueva Sesión" : "Editar Sesión"}</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Titulo */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Titulo
              </label>
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Tipo
              </label>
              <select
                value={formData.type || "SESSION"}
                onChange={(e) => {
                  const newType = e.target.value as SessionType;
                  setFormData((prev) => {
                    // Si es LIGHTNING, ajustar endTime a 5 min después de startTime
                    let newEndTime = prev.endTime;
                    if (newType === "LIGHTNING" && prev.startTime) {
                      const [h, m] = prev.startTime.split(":").map(Number);
                      const totalMinutes = h * 60 + m + 5;
                      const newH = Math.floor(totalMinutes / 60) % 24;
                      const newM = totalMinutes % 60;
                      newEndTime = `${newH.toString().padStart(2, "0")}:${newM.toString().padStart(2, "0")}`;
                    }
                    return { ...prev, type: newType, endTime: newEndTime };
                  });
                }}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              >
                {SESSION_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Track */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Track
              </label>
              <select
                value={formData.trackId === "all" ? "all" : formData.trackId?.toString() || "1"}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    trackId: val === "all" ? "all" : parseInt(val),
                  }));
                }}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="all">Todos (Full Width)</option>
                {tracks.map((track) => (
                  <option key={track.id} value={track.id}>
                    {track.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Horarios */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Hora Inicio
                </label>
                <input
                  type="time"
                  value={formData.startTime || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Hora Fin
                </label>
                <input
                  type="time"
                  value={formData.endTime || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, endTime: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Descripcion */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Descripcion
              </label>
              <textarea
                value={formData.description || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Tags (separados por coma)
              </label>
              <input
                type="text"
                value={formData.tags?.join(", ") || ""}
                onChange={(e) => handleTagsChange(e.target.value)}
                placeholder="Platform, Kubernetes, Cloud"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Sponsor Logo (para Lightning Talks) */}
            {formData.type === "LIGHTNING" && (
              <div className="border border-yellow-600/50 rounded-lg p-4 bg-yellow-900/10">
                <label className="block text-sm font-medium text-yellow-400 mb-2">
                  Logo del Sponsor
                </label>
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

            {/* Campos opcionales */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Ubicacion
                </label>
                <input
                  type="text"
                  value={formData.location || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                  placeholder="Sala de Talleres"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Duracion
                </label>
                <input
                  type="text"
                  value={formData.duration || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
                  placeholder="30 Minutos"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              {!isCreating && (
                <button
                  type="button"
                  onClick={onDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors text-sm"
                >
                  Eliminar
                </button>
              )}
              {!isCreating && session?.talkId && onReturnToBank && (
                <button
                  type="button"
                  onClick={onReturnToBank}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-slate-200 rounded-lg transition-colors text-sm flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                  </svg>
                  Al banco
                </button>
              )}
              <div className="flex-1" />
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors text-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors text-sm"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
