"use client";

import { useState, useEffect, useCallback } from "react";
import { Talk } from "./types";
import { supabase } from "./lib/supabase";

function mapTalkRow(row: Record<string, unknown>): Talk {
  return {
    id: row.id as string,
    title: row.title as string,
    type: row.type as Talk["type"],
    speaker: row.speaker as Talk["speaker"] | undefined,
    description: (row.description as string) || undefined,
    tags: (row.tags as string[]) || [],
    sponsorLogo: (row.sponsor_logo as string) || undefined,
    trackId: (row.track_id as number) || undefined,
    topicId: (row.topic_id as number) || undefined,
  };
}

interface UseTalksBankReturn {
  talks: Talk[];
  addTalk: (talk: Omit<Talk, "id">) => Talk;
  updateTalk: (id: string, updates: Partial<Talk>) => void;
  deleteTalk: (id: string) => void;
  scheduledTalkIds: Set<string>;
  setScheduledTalkIds: (ids: Set<string>) => void;
}

export function useTalksBank(): UseTalksBankReturn {
  const [talks, setTalks] = useState<Talk[]>([]);
  const [scheduledTalkIds, setScheduledTalkIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    supabase.from("talks").select("*").then(({ data, error }) => {
      if (error) { console.error("Error loading talks:", error); return; }
      setTalks((data ?? []).map(row => mapTalkRow(row as Record<string, unknown>)));
    });
  }, []);

  const addTalk = useCallback((talkData: Omit<Talk, "id">): Talk => {
    const talk: Talk = { ...talkData, id: `talk-${Date.now()}` };
    setTalks(prev => [...prev, talk]);
    supabase.from("talks").insert({
      id: talk.id,
      title: talk.title,
      type: talk.type,
      speaker: talk.speaker ?? null,
      description: talk.description ?? null,
      tags: talk.tags ?? [],
      sponsor_logo: talk.sponsorLogo ?? null,
    }).then(({ error }) => {
      if (error) console.error("Error adding talk:", error);
    });
    return talk;
  }, []);

  const updateTalk = useCallback((id: string, updates: Partial<Talk>) => {
    setTalks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    const dbUpdates: Record<string, unknown> = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.type !== undefined) dbUpdates.type = updates.type;
    if (updates.speaker !== undefined) dbUpdates.speaker = updates.speaker ?? null;
    if (updates.description !== undefined) dbUpdates.description = updates.description ?? null;
    if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
    if (updates.sponsorLogo !== undefined) dbUpdates.sponsor_logo = updates.sponsorLogo ?? null;
    supabase.from("talks").update(dbUpdates).eq("id", id).then(({ error }) => {
      if (error) console.error("Error updating talk:", error);
    });
  }, []);

  const deleteTalk = useCallback((id: string) => {
    setTalks(prev => prev.filter(t => t.id !== id));
    supabase.from("talks").delete().eq("id", id).then(({ error }) => {
      if (error) console.error("Error deleting talk:", error);
    });
  }, []);

  return { talks, addTalk, updateTalk, deleteTalk, scheduledTalkIds, setScheduledTalkIds };
}
