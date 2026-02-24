"use client";

import { useState, useEffect, useCallback } from "react";
import { DaySchedule, Track, Session, SessionType } from "./types";
import { DAY_SCHEDULES as DEFAULT_SCHEDULES, TRACKS as DEFAULT_TRACKS } from "./schedule-data";
import { supabase } from "./lib/supabase";

interface UseScheduleDataReturn {
  schedules: DaySchedule[];
  tracks: Track[];
  isLoading: boolean;
  updateSession: (dayId: number, sessionId: string, updates: Partial<Session>) => void;
  addSession: (dayId: number, session: Session) => void;
  deleteSession: (dayId: number, sessionId: string) => void;
}

function mapRow(row: Record<string, unknown>): Session {
  return {
    id: row.id as string,
    title: row.title as string,
    type: row.type as SessionType,
    trackId: row.track_id === "all" ? "all" : Number(row.track_id),
    startTime: row.start_time as string,
    endTime: row.end_time as string,
    speaker: row.speaker as Session["speaker"] | undefined,
    tags: (row.tags as string[]) || [],
    description: (row.description as string) || undefined,
    location: (row.location as string) || undefined,
    duration: (row.duration as string) || undefined,
    sponsorLogo: (row.sponsor_logo as string) || undefined,
    talkId: (row.talk_id as string) || undefined,
  };
}

function sessionToRow(dayId: number, session: Session): Record<string, unknown> {
  return {
    id: session.id,
    day_id: dayId,
    title: session.title,
    type: session.type,
    track_id: String(session.trackId),
    start_time: session.startTime,
    end_time: session.endTime,
    speaker: session.speaker ?? null,
    tags: session.tags ?? [],
    description: session.description ?? null,
    location: session.location ?? null,
    duration: session.duration ?? null,
    sponsor_logo: session.sponsorLogo ?? null,
    talk_id: session.talkId ?? null,
  };
}

export function useScheduleData(): UseScheduleDataReturn {
  const [schedules, setSchedules] = useState<DaySchedule[]>(DEFAULT_SCHEDULES);
  const [tracks] = useState<Track[]>(DEFAULT_TRACKS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSessions() {
      const { data, error } = await supabase.from("sessions").select("*");
      if (error) {
        console.error("Error loading sessions:", error);
        setIsLoading(false);
        return;
      }
      const byDay = (data ?? []).reduce<Record<number, Session[]>>((acc, row) => {
        const dayId = row.day_id as number;
        if (!acc[dayId]) acc[dayId] = [];
        acc[dayId].push(mapRow(row as Record<string, unknown>));
        return acc;
      }, {});

      setSchedules(DEFAULT_SCHEDULES.map(day => ({
        ...day,
        sessions: byDay[day.id] ?? [],
      })));
      setIsLoading(false);
    }
    loadSessions();
  }, []);

  const updateSession = useCallback((dayId: number, sessionId: string, updates: Partial<Session>) => {
    setSchedules(prev => prev.map(day => {
      if (day.id !== dayId) return day;
      return {
        ...day,
        sessions: day.sessions.map(s => s.id === sessionId ? { ...s, ...updates } : s),
      };
    }));

    const dbUpdates: Record<string, unknown> = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.type !== undefined) dbUpdates.type = updates.type;
    if (updates.trackId !== undefined) dbUpdates.track_id = String(updates.trackId);
    if (updates.startTime !== undefined) dbUpdates.start_time = updates.startTime;
    if (updates.endTime !== undefined) dbUpdates.end_time = updates.endTime;
    if (updates.speaker !== undefined) dbUpdates.speaker = updates.speaker ?? null;
    if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
    if (updates.description !== undefined) dbUpdates.description = updates.description ?? null;
    if (updates.location !== undefined) dbUpdates.location = updates.location ?? null;
    if (updates.duration !== undefined) dbUpdates.duration = updates.duration ?? null;
    if (updates.sponsorLogo !== undefined) dbUpdates.sponsor_logo = updates.sponsorLogo ?? null;
    if (updates.talkId !== undefined) dbUpdates.talk_id = updates.talkId ?? null;

    supabase.from("sessions").update(dbUpdates).eq("id", sessionId).then(({ error }) => {
      if (error) console.error("Error updating session:", error);
    });
  }, []);

  const addSession = useCallback((dayId: number, session: Session) => {
    setSchedules(prev => prev.map(day => {
      if (day.id !== dayId) return day;
      return { ...day, sessions: [...day.sessions, session] };
    }));

    supabase.from("sessions").insert(sessionToRow(dayId, session)).then(({ error }) => {
      if (error) console.error("Error adding session:", error);
    });
  }, []);

  const deleteSession = useCallback((dayId: number, sessionId: string) => {
    setSchedules(prev => prev.map(day => {
      if (day.id !== dayId) return day;
      return { ...day, sessions: day.sessions.filter(s => s.id !== sessionId) };
    }));

    supabase.from("sessions").delete().eq("id", sessionId).then(({ error }) => {
      if (error) console.error("Error deleting session:", error);
    });
  }, []);

  return { schedules, tracks, isLoading, updateSession, addSession, deleteSession };
}
