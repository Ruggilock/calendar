"use client";

import { useState, useMemo, useCallback } from "react";
import { Session, DaySchedule, Track, Talk } from "./types";
import AiChat from "./AiChat";
import { useAuth } from "./AuthContext";
import { useScheduleData } from "./useScheduleData";
import { useTalksBank } from "./useTalksBank";
import SessionEditModal from "./SessionEditModal";
import TalksPanel from "./TalksPanel";
import TalkEditModal from "./TalkEditModal";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useDroppable, useDraggable, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { TALKS_PANEL_DROP_ID } from "./TalksPanel";

const TAG_COLORS: Record<string, string> = {
  // Platform & Infrastructure
  Platform: "text-emerald-400",
  Infrastructure: "text-emerald-400",
  Kubernetes: "text-blue-400",
  Cloud: "text-cyan-400",
  IaC: "text-teal-400",
  Serverless: "text-indigo-400",
  Wasm: "text-purple-400",
  Containers: "text-blue-400",
  Nix: "text-violet-400",

  // CI/CD & GitOps
  "CI/CD": "text-orange-400",
  GitOps: "text-orange-400",
  Progressive: "text-amber-400",
  Monorepo: "text-yellow-400",

  // Observability & SRE
  Observability: "text-pink-400",
  Monitoring: "text-pink-400",
  Profiling: "text-rose-400",
  SRE: "text-red-400",
  Incidents: "text-red-400",
  Chaos: "text-red-500",
  DR: "text-red-400",

  // Security
  Security: "text-green-400",
  Secrets: "text-green-500",
  Policy: "text-green-400",
  Compliance: "text-lime-400",

  // AI/ML
  MLOps: "text-violet-400",
  LLMOps: "text-purple-400",

  // Culture & Experience
  Culture: "text-sky-400",
  DevEx: "text-sky-400",
  Experience: "text-sky-400",

  // Special
  Lightning: "text-yellow-400",
  Workshop: "text-pink-500",
  Sponsors: "text-slate-400",
  "Por confirmar": "text-slate-500",
  "Feature Flags": "text-amber-400",
  "Service Mesh": "text-indigo-400",
  eBPF: "text-purple-500",
  FinOps: "text-emerald-500",
  GreenOps: "text-green-500",
  Future: "text-violet-400",
  Testing: "text-blue-400",
};

function KeynoteIcon() {
  return (
    <svg
      className="w-10 h-10"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="40" height="40" rx="8" fill="#1e3a5f" />
      <path
        d="M20 12L26 16V24L20 28L14 24V16L20 12Z"
        stroke="#60a5fa"
        strokeWidth="2"
        fill="none"
      />
      <circle cx="20" cy="20" r="3" fill="#60a5fa" />
    </svg>
  );
}

function BreakIcon() {
  return (
    <svg
      className="w-10 h-10"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="40" height="40" rx="8" fill="#422006" />
      <path
        d="M14 14H24V26C24 27.1046 23.1046 28 22 28H16C14.8954 28 14 27.1046 14 26V14Z"
        stroke="#f59e0b"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M24 16H26C27.1046 16 28 16.8954 28 18V20C28 21.1046 27.1046 22 26 22H24"
        stroke="#f59e0b"
        strokeWidth="2"
      />
      <path
        d="M16 11V14M19 11V14M22 11V14"
        stroke="#f59e0b"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LunchIcon() {
  return (
    <svg
      className="w-10 h-10"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="40" height="40" rx="8" fill="#1e3a5f" />
      <path
        d="M12 20H28M14 16C14 14 16 12 20 12C24 12 26 14 26 16"
        stroke="#60a5fa"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M14 20V24C14 26 16 28 20 28C24 28 26 26 26 24V20"
        stroke="#60a5fa"
        strokeWidth="2"
      />
    </svg>
  );
}

function NetworkingIcon() {
  return (
    <svg
      className="w-10 h-10"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="40" height="40" rx="8" fill="#1e3a5f" />
      <circle cx="20" cy="14" r="3" stroke="#60a5fa" strokeWidth="2" />
      <circle cx="12" cy="24" r="3" stroke="#60a5fa" strokeWidth="2" />
      <circle cx="28" cy="24" r="3" stroke="#60a5fa" strokeWidth="2" />
      <path d="M20 17V21M15 22L18 19M25 22L22 19" stroke="#60a5fa" strokeWidth="2" />
    </svg>
  );
}

function SpeakerAvatar({ name, avatar }: { name: string; avatar?: string }) {
  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className="w-10 h-10 rounded-full object-cover"
      />
    );
  }

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const colors = [
    "bg-orange-500",
    "bg-emerald-500",
    "bg-blue-500",
    "bg-pink-500",
    "bg-purple-500",
    "bg-cyan-500",
  ];
  const colorIndex =
    name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colors.length;

  return (
    <div
      className={`w-6 h-6 rounded-full ${colors[colorIndex]} flex items-center justify-center text-[10px] font-medium text-white`}
    >
      {initials}
    </div>
  );
}

// Background colors for each track
const TRACK_BG_COLORS: Record<number, string> = {
  1: "bg-slate-800/60", // Main Stage
  2: "bg-slate-800/40", // Sala A
  3: "bg-slate-800/40", // Sala B
  4: "bg-slate-800/40", // Sala C
  5: "bg-pink-900/20", // Talleres
};

function isLightningTalk(session: Session): boolean {
  return session.type === "LIGHTNING" || session.tags?.includes("Lightning") || false;
}

function DraggableSessionWrapper({ session, children }: { session: Session; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `grid-session-${session.id}`,
    data: { session },
  });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), opacity: isDragging ? 0.35 : 1 }}
      className="h-full relative group"
    >
      {/* Handle de drag visible — arrastra al banco */}
      <div
        {...listeners}
        {...attributes}
        className="absolute top-1.5 right-1.5 z-10 px-1.5 py-0.5 rounded text-[9px] font-medium opacity-30 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing bg-slate-600 hover:bg-slate-500 text-slate-200 select-none"
        title="Arrastrar al banco de charlas"
        onClick={(e) => e.stopPropagation()}
      >
        ⠿ banco
      </div>
      {children}
    </div>
  );
}

function SessionCard({ session, onClick }: { session: Session; onClick?: () => void }) {
  const tag = session.tags?.[0];
  const tagColor = tag ? TAG_COLORS[tag] || "text-gray-400" : "text-gray-400";
  const isLightning = isLightningTalk(session);
  const trackBg = TRACK_BG_COLORS[session.trackId as number] || "bg-slate-800/50";

  // Compact version for lightning talks
  if (isLightning) {
    return (
      <div
        onClick={onClick}
        className={`${trackBg} rounded-lg p-3 h-full flex items-center gap-3 border border-slate-700/50 hover:border-emerald-500/50 transition-colors cursor-pointer`}
      >
        {session.sponsorLogo && (
          <img
            src={session.sponsorLogo}
            alt="Sponsor"
            className="h-6 w-auto object-contain bg-white rounded px-1"
          />
        )}
        <span className="text-[10px] font-semibold tracking-wide uppercase text-yellow-400">
          Lightning
        </span>
        <h3 className="text-white font-medium text-xs leading-tight flex-1">
          {session.title}
        </h3>
        {session.speaker && session.speaker.name !== "Por definir" && (
          <span className="text-slate-500 text-[10px]">{session.speaker.name}</span>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`${trackBg} rounded-lg p-4 h-full flex flex-col border border-slate-700/50 hover:border-emerald-500/50 transition-colors cursor-pointer`}
    >
      {tag && (
        <span className={`text-xs font-semibold tracking-wide uppercase ${tagColor}`}>
          {tag}
        </span>
      )}
      <h3 className="text-white font-medium mt-1 text-sm leading-tight">
        {session.title}
      </h3>
      {session.speaker && (
        <div className="flex items-center gap-2 mt-auto pt-3">
          <SpeakerAvatar
            name={session.speaker.name}
            avatar={session.speaker.avatar}
          />
          <span className="text-slate-400 text-sm">{session.speaker.name}</span>
        </div>
      )}
      {session.location && !session.speaker && session.title !== "Por definir" && (
        <p className="text-slate-500 text-sm mt-2">{session.location}</p>
      )}
    </div>
  );
}

function FullWidthSession({ session, onClick }: { session: Session; onClick?: () => void }) {
  const isBreak = session.type === "BREAK";
  const isLunch = session.type === "LUNCH";
  const isPanel = session.type === "PANEL";

  const isNetworking = session.type === "NETWORKING" && session.trackId === "all";

  const getIcon = () => {
    if (isBreak) return <BreakIcon />;
    if (isLunch) return <LunchIcon />;
    if (isNetworking) return <NetworkingIcon />;
    return <KeynoteIcon />;
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-lg p-4 flex items-center gap-4 cursor-pointer transition-colors ${isBreak
        ? "bg-gradient-to-r from-amber-900/30 to-transparent border-l-4 border-amber-500 hover:from-amber-900/50"
        : "bg-slate-800/50 border border-slate-700/50 hover:border-emerald-500/50"
        }`}
    >
      <div className="flex-grow">
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0">{getIcon()}</div>
          <div className="flex-grow">
            <h3 className="text-white font-semibold text-lg">{session.title}</h3>
            {session.description && (
              <p className="text-slate-400 text-sm">{session.description}</p>
            )}
          </div>
        </div>
        {session.speaker && (
          <div className="flex -space-x-2">
            {session.speaker && (
              <div className="flex items-center gap-2 mt-auto ">
                <SpeakerAvatar
                  name={session.speaker.name}
                  avatar={session.speaker.avatar}
                />
                <div className="flex flex-col">
                  <span className="text-slate-400 text-sm">{session.speaker.name}</span>
                  <span className="text-slate-400 text-sm">{session.speaker.role}</span>
                </div>

              </div>
            )}
          </div>
        )}
        {isBreak && session.startTime && session.endTime && (
          <p className="text-slate-500 text-sm">
          </p>
        )}
      </div>
      {session.duration && (
        <div className="flex-shrink-0 text-slate-500 text-sm font-medium uppercase">
          {session.duration}
        </div>
      )}
      {isPanel && (
        <div className="flex -space-x-2">
          <div className="w-8 h-8 rounded-full bg-emerald-600 border-2 border-slate-900" />
          <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-slate-900" />
          <div className="w-8 h-8 rounded-full bg-orange-600 border-2 border-slate-900" />
        </div>
      )}
    </div>
  );
}

function TrackHeader({ track, index }: { track: Track; index: number }) {
  const subtitleColors = [
    "text-emerald-400",
    "text-slate-400",
    "text-slate-400",
    "text-pink-400",
    "text-green-400",
  ];

  return (
    <div className="text-center pb-4">
      <p className={`text-xs font-semibold tracking-wider ${subtitleColors[index]}`}>
        TRACK {track.id}
      </p>
      <h2 className="text-white font-medium mt-1">{track.name}</h2>
    </div>
  );
}

function DayTab({
  day,
  isActive,
  onClick,
}: {
  day: DaySchedule;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 text-center transition-colors ${isActive
        ? "text-emerald-400 border-b-2 border-emerald-400"
        : "text-slate-400 hover:text-slate-300"
        }`}
    >
      <span className="font-medium">{day.dateLabel}</span>
      <p className={`text-xs ${isActive ? "text-emerald-400" : "text-slate-500"}`}>
        {day.fullDate}
      </p>
    </button>
  );
}

function DroppableCell({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { isOver, setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`h-full transition-colors rounded-lg ${isOver ? "ring-2 ring-emerald-400 ring-offset-1 ring-offset-slate-900" : ""}`}
    >
      {children}
    </div>
  );
}

export default function Schedule() {
  const { schedules, tracks, isLoading, updateSession, deleteSession, addSession } = useScheduleData();
  const { talks, addTalk, updateTalk, deleteTalk } = useTalksBank();
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [activeDragTalk, setActiveDragTalk] = useState<Talk | null>(null);
  const [talkToEdit, setTalkToEdit] = useState<Talk | null>(null);
  const { logout } = useAuth();

  const effectiveActiveDay = activeDay ?? schedules[0]?.id ?? 1;
  const currentDay = schedules.find((d) => d.id === effectiveActiveDay) || schedules[0];

  // Set de talkIds que ya están programados en el día activo
  const scheduledTalkIds = useMemo(() => {
    const day = schedules.find((d) => d.id === effectiveActiveDay);
    const ids = new Set<string>();
    day?.sessions.forEach((s) => { if (s.talkId) ids.add(s.talkId); });
    return ids;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedules, activeDay]);

  const [activeDragSession, setActiveDragSession] = useState<Session | null>(null);

  const handleDeleteTalk = useCallback((id: string) => {
    deleteTalk(id);
    // También borrar cualquier sesión vinculada a este talk en todos los días
    schedules.forEach((day) => {
      day.sessions.forEach((s) => {
        if (s.talkId === id) deleteSession(day.id, s.id);
      });
    });
  }, [deleteTalk, deleteSession, schedules]);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const talk = event.active.data.current?.talk as Talk | undefined;
    const session = event.active.data.current?.session as Session | undefined;
    if (talk) setActiveDragTalk(talk);
    if (session) setActiveDragSession(session);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragTalk(null);
    setActiveDragSession(null);
    const { active, over } = event;
    if (!over) return;

    const overId = over.id as string;

    // Drag de sesión del grid → panel (devolver al banco)
    const session = active.data.current?.session as Session | undefined;
    if (session && overId === TALKS_PANEL_DROP_ID) {
      // Solo borrar la sesión — el talk ya está en el banco (nunca se borró)
      deleteSession(effectiveActiveDay, session.id);
      return;
    }

    const talk = active.data.current?.talk as Talk | undefined;
    if (!talk) return;

    // droppable id format: "cell-{time}-{trackId}"
    if (!overId.startsWith("cell-")) return;

    const [, time, trackIdStr] = overId.split("-");
    const trackId = trackIdStr === "all" ? "all" : parseInt(trackIdStr);
    const startTime = time;
    const endTime = talk.type === "LIGHTNING" ? addMinutes(startTime, 5) : addMinutes(startTime, 30);

    const currentDay = schedules.find((d) => d.id === effectiveActiveDay);
    if (!currentDay) return;

    // Buscar si ya hay una sesión en ese slot/track para reemplazarla
    const existingSession = currentDay.sessions.find(
      (s) => s.startTime === startTime && s.trackId === trackId
    );

    if (existingSession) {
      updateSession(effectiveActiveDay, existingSession.id, {
        title: talk.title,
        type: talk.type,
        speaker: talk.speaker,
        tags: talk.tags,
        sponsorLogo: talk.sponsorLogo,
        description: talk.description,
        talkId: talk.id,
        endTime,
      });
    } else {
      addSession(effectiveActiveDay, {
        id: `session-${Date.now()}`,
        title: talk.title,
        type: talk.type,
        trackId,
        startTime,
        endTime,
        speaker: talk.speaker,
        tags: talk.tags,
        sponsorLogo: talk.sponsorLogo,
        description: talk.description,
        talkId: talk.id,
      });
    }

    // Auto-asignar el track del slot al talk (el talk permanece en el banco como "ya programado")
    if (typeof trackId === "number") {
      updateTalk(talk.id, { trackId });
    }
  };

  const handleSessionClick = (session: Session) => {
    setSelectedSession(session);
    setIsCreating(false);
    setIsModalOpen(true);
  };

  const handleCreateSession = (startTime?: string, trackId?: number | "all") => {
    const newSession: Session = {
      id: `new-${Date.now()}`,
      title: "Nueva Sesión",
      type: "SESSION",
      trackId: trackId ?? 1,
      startTime: startTime ?? "09:00",
      endTime: startTime ? addMinutes(startTime, 30) : "09:30",
      tags: [],
    };
    setSelectedSession(newSession);
    setIsCreating(true);
    setIsModalOpen(true);
  };

  const handleSessionSave = (updates: Partial<Session>) => {
    if (isCreating && selectedSession) {
      const newSession = { ...selectedSession, ...updates };
      addSession(effectiveActiveDay, newSession);
    } else if (selectedSession) {
      updateSession(effectiveActiveDay, selectedSession.id, updates);
    }
    setIsCreating(false);
  };

  const handleSessionDelete = () => {
    if (selectedSession && !isCreating && confirm("Estas seguro de eliminar esta sesion?")) {
      deleteSession(effectiveActiveDay, selectedSession.id);
      setIsModalOpen(false);
      setSelectedSession(null);
    }
  };

  // Helper to add minutes to time string
  function addMinutes(time: string, minutes: number): string {
    const [h, m] = time.split(":").map(Number);
    const totalMinutes = h * 60 + m + minutes;
    const newH = Math.floor(totalMinutes / 60) % 24;
    const newM = totalMinutes % 60;
    return `${newH.toString().padStart(2, "0")}:${newM.toString().padStart(2, "0")}`;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white text-xl">Cargando schedule...</div>
      </div>
    );
  }

  const getSessionsForTimeSlot = (time: string) => {
    return currentDay.sessions.filter((s) => s.startTime === time);
  };

  const isFullWidthSession = (session: Session) => {
    return session.trackId === "all";
  };

  // Get unique time slots from current day's sessions
  const dayTimeSlots = [...new Set(currentDay.sessions.map((s) => s.startTime))].sort();

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="w-24" />
          <h1 className="text-4xl font-bold text-center">
            DevOpsDays Schedule
          </h1>
          <button
            onClick={logout}
            className="w-24 px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            Salir
          </button>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => handleCreateSession()}
            className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva Sesión
          </button>
        </div>

        {/* Day Tabs */}
        <div className="flex justify-center gap-8 mb-8 border-b border-slate-700">
          {schedules.map((day) => (
            <DayTab
              key={day.id}
              day={day}
              isActive={effectiveActiveDay === day.id}
              onClick={() => setActiveDay(day.id)}
            />
          ))}
        </div>

        {/* Main layout: Panel + Grid */}
        <div className="flex gap-6 items-start">
          {/* Talks Panel */}
          <TalksPanel
            talks={talks}
            tracks={tracks}
            scheduledTalkIds={scheduledTalkIds}
            onAddTalk={addTalk}
            onEditTalk={(t) => setTalkToEdit(t)}
            onDeleteTalk={handleDeleteTalk}
          />

          {/* Schedule Grid */}
          <div className="flex-1 min-w-0 bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
            {/* Track Headers */}
            <div className="grid grid-cols-[80px_repeat(5,1fr)] gap-4 mb-6">
              <div />
              {tracks.map((track, index) => (
                <TrackHeader key={track.id} track={track} index={index} />
              ))}
            </div>

            {/* Time Slots */}
            <div className="space-y-2">
              {dayTimeSlots.map((time) => {
                const sessions = getSessionsForTimeSlot(time);
                if (sessions.length === 0) return null;

                const fullWidthSessions = sessions.filter(isFullWidthSession);
                const trackSessions = sessions.filter((s) => !isFullWidthSession(s));
                const isLightningSlot = trackSessions.some(s => isLightningTalk(s));

                return (
                  <div key={time} className="mb-2">
                    {fullWidthSessions.map((session) => (
                      <div key={session.id} className="grid grid-cols-[80px_1fr] gap-4 mb-3">
                        <div className="text-slate-400 text-sm font-medium pt-4">{time}</div>
                        <DroppableCell id={`cell-${time}-all`}>
                          <FullWidthSession session={session} onClick={() => handleSessionClick(session)} />
                        </DroppableCell>
                      </div>
                    ))}

                    {trackSessions.length > 0 && (
                      <div className="grid grid-cols-[80px_repeat(5,1fr)] items-stretch gap-3">
                        <div className={`text-slate-400 text-sm font-medium ${isLightningSlot ? "pt-2" : "pt-3"}`}>
                          {fullWidthSessions.length === 0 ? time : ""}
                        </div>
                        {tracks.map((track) => {
                          const session = trackSessions.find((s) => s.trackId === track.id);
                          const cellId = `cell-${time}-${track.id}`;
                          return (
                            <DroppableCell key={track.id} id={cellId}>
                              {session ? (
                                <DraggableSessionWrapper session={session}>
                                  <SessionCard session={session} onClick={() => handleSessionClick(session)} />
                                </DraggableSessionWrapper>
                              ) : (
                                <button
                                  onClick={() => handleCreateSession(time, track.id)}
                                  className="w-full h-full min-h-[60px] rounded-lg border-2 border-dashed border-slate-700 hover:border-emerald-500/50 flex items-center justify-center text-slate-600 hover:text-emerald-400 transition-colors"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                  </svg>
                                </button>
                              )}
                            </DroppableCell>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat Button */}
      <AiChat />

      {/* Session Edit Modal */}
      <SessionEditModal
        session={selectedSession}
        tracks={tracks}
        isOpen={isModalOpen}
        isCreating={isCreating}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSession(null);
          setIsCreating(false);
        }}
        onSave={handleSessionSave}
        onDelete={handleSessionDelete}
        onReturnToBank={selectedSession?.talkId ? () => {
          deleteSession(effectiveActiveDay, selectedSession!.id);
          setIsModalOpen(false);
          setSelectedSession(null);
        } : undefined}
      />

      {/* Talk Edit Modal */}
      <TalkEditModal
        talk={talkToEdit}
        isOpen={!!talkToEdit}
        tracks={tracks}
        onClose={() => setTalkToEdit(null)}
        onSave={(updates) => {
          if (talkToEdit) updateTalk(talkToEdit.id, updates);
          setTalkToEdit(null);
        }}
      />

      {/* Drag Overlay */}
      <DragOverlay>
        {(activeDragTalk || activeDragSession) && (
          <div className="bg-slate-700 border border-emerald-500 rounded-lg p-3 shadow-2xl w-56 opacity-95 cursor-grabbing">
            <span className="text-[10px] text-yellow-400 uppercase font-semibold">
              {activeDragTalk?.type ?? activeDragSession?.type}
            </span>
            <p className="text-white text-xs font-medium mt-1">
              {activeDragTalk?.title ?? activeDragSession?.title}
            </p>
            {(activeDragTalk?.speaker ?? activeDragSession?.speaker) && (
              <p className="text-slate-400 text-[11px] mt-1">
                {activeDragTalk?.speaker?.name ?? activeDragSession?.speaker?.name}
              </p>
            )}
          </div>
        )}
      </DragOverlay>
    </div>
    </DndContext>
  );
}
