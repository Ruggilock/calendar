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
}

export interface Track {
  id: number;
  name: string;
}

export interface DaySchedule {
  id: number;
  dateLabel: string;
  fullDate: string;
  sessions: Session[];
}
