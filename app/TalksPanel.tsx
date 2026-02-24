"use client";

import { useState } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Talk, SessionType } from "./types";

export const TALKS_PANEL_DROP_ID = "talks-bank-panel";

const TYPE_COLORS: Record<SessionType, string> = {
  KEYNOTE: "text-blue-400 bg-blue-900/30 border-blue-700/50",
  SESSION: "text-emerald-400 bg-emerald-900/30 border-emerald-700/50",
  LIGHTNING: "text-yellow-400 bg-yellow-900/30 border-yellow-700/50",
  WORKSHOP: "text-pink-400 bg-pink-900/30 border-pink-700/50",
  PANEL: "text-purple-400 bg-purple-900/30 border-purple-700/50",
  NETWORKING: "text-cyan-400 bg-cyan-900/30 border-cyan-700/50",
  BREAK: "text-amber-400 bg-amber-900/30 border-amber-700/50",
  LUNCH: "text-orange-400 bg-orange-900/30 border-orange-700/50",
};

const TYPE_LABELS: Record<SessionType, string> = {
  KEYNOTE: "Keynote",
  SESSION: "Sesión",
  LIGHTNING: "Lightning",
  WORKSHOP: "Workshop",
  PANEL: "Panel",
  NETWORKING: "Networking",
  BREAK: "Break",
  LUNCH: "Almuerzo",
};

function DraggableTalkCard({
  talk,
  isScheduled,
  onEdit,
  onDelete,
}: {
  talk: Talk;
  isScheduled: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: talk.id,
    data: { talk },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 999 : undefined,
  };

  const colorClass = TYPE_COLORS[talk.type] || TYPE_COLORS.SESSION;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative rounded-lg border p-3 cursor-grab active:cursor-grabbing transition-colors ${colorClass} ${
        isScheduled ? "opacity-50" : ""
      }`}
    >
      {/* Drag handle area */}
      <div {...listeners} {...attributes} className="flex flex-col gap-1">
        {/* Type badge */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wide opacity-80">
            {TYPE_LABELS[talk.type]}
          </span>
          {isScheduled && (
            <span className="text-[9px] bg-slate-700 text-slate-300 rounded px-1 py-0.5">
              programado
            </span>
          )}
        </div>

        {/* Logo del sponsor si es lightning */}
        {talk.sponsorLogo && (
          <img
            src={talk.sponsorLogo}
            alt="Sponsor"
            className="h-5 w-auto object-contain bg-white rounded px-1"
          />
        )}

        {/* Title */}
        <p className="text-white text-xs font-medium leading-tight">{talk.title}</p>

        {/* Speaker */}
        {talk.speaker && (
          <div className="flex items-center gap-1.5 mt-1">
            {talk.speaker.avatar ? (
              <img
                src={talk.speaker.avatar}
                alt={talk.speaker.name}
                className="w-5 h-5 rounded-full object-cover"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-slate-600 flex items-center justify-center text-[9px] text-white">
                {talk.speaker.name[0]}
              </div>
            )}
            <span className="text-[11px] text-white/70 leading-tight">{talk.speaker.name}</span>
          </div>
        )}
      </div>

      {/* Action buttons - outside drag area */}
      <div className="flex gap-1 mt-2 pt-2 border-t border-current/20">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="flex-1 text-[10px] text-current opacity-60 hover:opacity-100 transition-opacity"
        >
          Editar
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="flex-1 text-[10px] text-red-400 opacity-60 hover:opacity-100 transition-opacity"
        >
          Borrar
        </button>
      </div>
    </div>
  );
}

interface TalksPanelProps {
  talks: Talk[];
  scheduledTalkIds: Set<string>;
  onAddTalk: (talk: Omit<Talk, "id">) => void;
  onEditTalk: (talk: Talk) => void;
  onDeleteTalk: (id: string) => void;
}

export default function TalksPanel({
  talks,
  scheduledTalkIds,
  onAddTalk,
  onEditTalk,
  onDeleteTalk,
}: TalksPanelProps) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<SessionType | "ALL">("ALL");
  const { isOver, setNodeRef } = useDroppable({ id: TALKS_PANEL_DROP_ID });

  const filtered = talks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.speaker?.name.toLowerCase().includes(search.toLowerCase()) || false;
    const matchesType = filterType === "ALL" || t.type === filterType;
    return matchesSearch && matchesType;
  });

  const unscheduled = filtered.filter((t) => !scheduledTalkIds.has(t.id));
  const scheduled = filtered.filter((t) => scheduledTalkIds.has(t.id));

  return (
    <div
      ref={setNodeRef}
      className={`w-72 flex-shrink-0 rounded-2xl flex flex-col overflow-hidden transition-colors border ${
        isOver
          ? "bg-emerald-900/20 border-emerald-500/70"
          : "bg-slate-800/50 border-slate-700/50"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-white font-semibold text-sm">Banco de Charlas</h2>
          {isOver ? (
            <span className="text-xs text-emerald-400 font-medium animate-pulse">Soltar aquí</span>
          ) : (
            <span className="text-xs text-slate-400">{talks.length} charlas</span>
          )}
        </div>

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar..."
          className="w-full px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500 mb-2"
        />

        {/* Filter by type */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as SessionType | "ALL")}
          className="w-full px-2 py-1.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500"
        >
          <option value="ALL">Todos los tipos</option>
          <option value="KEYNOTE">Keynote</option>
          <option value="SESSION">Sesión</option>
          <option value="LIGHTNING">Lightning Talk</option>
          <option value="WORKSHOP">Workshop</option>
          <option value="PANEL">Panel</option>
        </select>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {/* Unscheduled */}
        {unscheduled.length > 0 && (
          <>
            {unscheduled.map((talk) => (
              <DraggableTalkCard
                key={talk.id}
                talk={talk}
                isScheduled={false}
                onEdit={() => onEditTalk(talk)}
                onDelete={() => onDeleteTalk(talk.id)}
              />
            ))}
          </>
        )}

        {/* Scheduled (collapsed visually) */}
        {scheduled.length > 0 && (
          <>
            <div className="text-[10px] text-slate-500 uppercase tracking-wide pt-2 pb-1">
              Ya programadas ({scheduled.length})
            </div>
            {scheduled.map((talk) => (
              <DraggableTalkCard
                key={talk.id}
                talk={talk}
                isScheduled={true}
                onEdit={() => onEditTalk(talk)}
                onDelete={() => onDeleteTalk(talk.id)}
              />
            ))}
          </>
        )}

        {filtered.length === 0 && (
          <p className="text-slate-500 text-xs text-center py-4">
            {search ? "Sin resultados" : "Banco vacío"}
          </p>
        )}
      </div>

      {/* Add button */}
      <div className="p-3 border-t border-slate-700/50">
        <button
          onClick={() =>
            onAddTalk({
              title: "Nueva charla",
              type: "SESSION",
              tags: [],
            })
          }
          className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Agregar Charla
        </button>
      </div>
    </div>
  );
}
