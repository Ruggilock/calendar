import { DaySchedule, Track } from "./types";

export const TRACKS: Track[] = [
  { id: 1, name: "Main Stage" },
  { id: 2, name: "Sala A" },
  { id: 3, name: "Sala B" },
  { id: 4, name: "Sala C" },
  { id: 5, name: "Talleres" },
];

export const TOPICS: { id: number; name: string }[] = [
  { id: 1, name: "Enterprise AI & Data Strategy" },
  { id: 2, name: "Modern Leadership & Culture" },
  { id: 3, name: "Platform Engineering & DevOps" },
  { id: 4, name: "Security & Technology Transformation" },
];

export const DAY_SCHEDULES: DaySchedule[] = [
  {
    id: 1,
    dateLabel: "Día 1",
    fullDate: "27 de agosto, 2025",
    sessions: [],
  },
  {
    id: 2,
    dateLabel: "Día 2",
    fullDate: "28 de agosto, 2025",
    sessions: [],
  },
];
