export interface Speaker {
  name: string;
  role?: string;
  avatar?: string;
}

export type SessionType = "KEYNOTE" | "SESSION" | "WORKSHOP" | "NETWORKING" | "BREAK" | "LUNCH" | "PANEL" | "LIGHTNING";

export interface Session {
  id: string;
  title: string;
  type: SessionType;
  trackId: number | "all";
  startTime: string;
  endTime: string;
  tags?: string[];
  speaker?: Speaker;
  location?: string;
  description?: string;
  duration?: string;
  sponsorLogo?: string; // URL del logo del sponsor para lightning talks
  talkId?: string; // referencia al Talk del banco (FK para Supabase)
}

export interface Track {
  id: number;
  name: string;
}

// Talk = charla en el banco, independiente de si está programada o no
// Cuando está programada, su id aparece como session.talkId en el schedule
export interface Talk {
  id: string;
  title: string;
  type: SessionType;
  speaker?: Speaker;
  description?: string;
  tags?: string[];
  sponsorLogo?: string;
}

export interface DaySchedule {
  id: number;
  dateLabel: string;
  fullDate: string;
  sessions: Session[];
}
