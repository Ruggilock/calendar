"use client";

import { useState, useEffect, useCallback } from "react";
import { DaySchedule, Track, Session } from "./types";
import { DAY_SCHEDULES as DEFAULT_SCHEDULES, TRACKS as DEFAULT_TRACKS } from "./schedule-data";

const STORAGE_KEY = "devopsdays-schedule-data";

interface ScheduleData {
  schedules: DaySchedule[];
  tracks: Track[];
}

interface UseScheduleDataReturn {
  schedules: DaySchedule[];
  tracks: Track[];
  isLoading: boolean;
  uploadData: (jsonString: string) => { success: boolean; error?: string };
  downloadData: () => void;
  resetToDefault: () => void;
  updateSession: (dayId: number, sessionId: string, updates: Partial<Session>) => void;
  addSession: (dayId: number, session: Session) => void;
  deleteSession: (dayId: number, sessionId: string) => void;
}

function validateScheduleData(data: unknown): data is ScheduleData {
  if (!data || typeof data !== "object") return false;

  const d = data as Record<string, unknown>;

  if (!Array.isArray(d.schedules) || !Array.isArray(d.tracks)) return false;

  // Validate schedules structure
  for (const schedule of d.schedules) {
    if (
      typeof schedule !== "object" ||
      !schedule ||
      typeof (schedule as DaySchedule).id !== "number" ||
      typeof (schedule as DaySchedule).dateLabel !== "string" ||
      typeof (schedule as DaySchedule).fullDate !== "string" ||
      !Array.isArray((schedule as DaySchedule).sessions)
    ) {
      return false;
    }
  }

  // Validate tracks structure
  for (const track of d.tracks) {
    if (
      typeof track !== "object" ||
      !track ||
      typeof (track as Track).id !== "number" ||
      typeof (track as Track).name !== "string"
    ) {
      return false;
    }
  }

  return true;
}

export function useScheduleData(): UseScheduleDataReturn {
  const [schedules, setSchedules] = useState<DaySchedule[]>(DEFAULT_SCHEDULES);
  const [tracks, setTracks] = useState<Track[]>(DEFAULT_TRACKS);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (validateScheduleData(parsed)) {
          setSchedules(parsed.schedules);
          setTracks(parsed.tracks);
        }
      }
    } catch (error) {
      console.error("Error loading schedule data from localStorage:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (!isLoading) {
      const data: ScheduleData = { schedules, tracks };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [schedules, tracks, isLoading]);

  const uploadData = useCallback((jsonString: string): { success: boolean; error?: string } => {
    try {
      const parsed = JSON.parse(jsonString);

      if (!validateScheduleData(parsed)) {
        return {
          success: false,
          error: "Formato JSON invalido. Debe tener 'schedules' y 'tracks' con la estructura correcta."
        };
      }

      setSchedules(parsed.schedules);
      setTracks(parsed.tracks);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: `Error al parsear JSON: ${error instanceof Error ? error.message : "Error desconocido"}`
      };
    }
  }, []);

  const downloadData = useCallback(() => {
    const data: ScheduleData = { schedules, tracks };
    const jsonString = JSON.stringify(data, null, 2);

    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `devopsdays-schedule-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }, [schedules, tracks]);

  const resetToDefault = useCallback(() => {
    setSchedules(DEFAULT_SCHEDULES);
    setTracks(DEFAULT_TRACKS);
  }, []);

  const updateSession = useCallback((dayId: number, sessionId: string, updates: Partial<Session>) => {
    setSchedules(prev => prev.map(day => {
      if (day.id !== dayId) return day;
      return {
        ...day,
        sessions: day.sessions.map(session =>
          session.id === sessionId ? { ...session, ...updates } : session
        )
      };
    }));
  }, []);

  const addSession = useCallback((dayId: number, session: Session) => {
    setSchedules(prev => prev.map(day => {
      if (day.id !== dayId) return day;
      return {
        ...day,
        sessions: [...day.sessions, session]
      };
    }));
  }, []);

  const deleteSession = useCallback((dayId: number, sessionId: string) => {
    setSchedules(prev => prev.map(day => {
      if (day.id !== dayId) return day;
      return {
        ...day,
        sessions: day.sessions.filter(session => session.id !== sessionId)
      };
    }));
  }, []);

  return {
    schedules,
    tracks,
    isLoading,
    uploadData,
    downloadData,
    resetToDefault,
    updateSession,
    addSession,
    deleteSession,
  };
}
