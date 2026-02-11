import { DaySchedule, Track, Session, SessionType } from "./types";

export const TRACKS: Track[] = [
  { id: 1, name: "Main Stage" },
  { id: 2, name: "Sala A" },
  { id: 3, name: "Sala B" },
  { id: 4, name: "Sala C" },
  { id: 5, name: "Talleres" },
];

export const TIME_SLOTS = [
  "08:00",
  "09:00",
  "09:30",
  "09:35",
  "09:40",
  "10:10",
  "10:15",
  "10:45",
  "10:50",
  "10:55",
  "11:25",
  "11:30",
  "12:00",
  "12:05",
  "12:35",
  "13:00",
  "14:00",
  "14:30",
  "14:35",
  "15:05",
  "15:10",
  "15:40",
  "15:45",
  "16:15",
  "16:45",
  "17:15",
  "17:20",
  "18:00",
  "18:40",
];

// Helper function to create "Por definir" sessions for tracks 2-5
function createPendingSession(
  id: string,
  trackId: number,
  startTime: string,
  endTime: string,
  isLightning = false,
  isWorkshop = false
): Session {
  const type: SessionType = isWorkshop ? "WORKSHOP" : "SESSION";
  return {
    id,
    title: "Por definir",
    type,
    trackId,
    startTime,
    endTime,
    tags: isLightning ? ["Lightning"] : isWorkshop ? ["Workshop"] : ["Por confirmar"],
  };
}

export const DAY_SCHEDULES: DaySchedule[] = [
  {
    id: 1,
    dateLabel: "Día 1",
    fullDate: "15 de Mayo, 2025",
    sessions: [
      // 08:00 - Bienvenida
      {
        id: "d1-welcome",
        title: "Bienvenida / Apertura",
        type: "KEYNOTE",
        trackId: "all",
        startTime: "08:00",
        endTime: "09:00",
        description: "Registro y bienvenida • Main Stage",
      },

      // 09:00 - Keynote 1
      {
        id: "d1-keynote-1",
        title: "Keynote de Apertura",
        type: "KEYNOTE",
        trackId: "all",
        startTime: "09:00",
        endTime: "09:30",
        speaker: {
          name: "Tanya Janca",
          role: "Trainer, Keynote Speaker, Best Selling Author",
          avatar: "https://media.licdn.com/dms/image/v2/D5603AQG6Pc9fQ226iA/profile-displayphoto-shrink_400_400/B56ZS4RSgaGUAo-/0/1738258328212?e=1772064000&v=beta&t=Cd1unvOBfuU-U_EGQgKxOCDt_pWpdxgYQd3xpsOhNio",
        },
      },

      // 09:30 - Lightning Talk 1 (entre keynote 1 y 2)
      createPendingSession("d1-light-k1", 1, "09:30", "09:35", true),
      createPendingSession("d1-light-k1-a", 2, "09:30", "09:35", true),
      createPendingSession("d1-light-k1-b", 3, "09:30", "09:35", true),
      createPendingSession("d1-light-k1-c", 4, "09:30", "09:35", true),

      // 09:35 - Lightning Talk 2 (entre keynote 1 y 2)
      createPendingSession("d1-light-k2", 1, "09:35", "09:40", true),
      createPendingSession("d1-light-k2-a", 2, "09:35", "09:40", true),
      createPendingSession("d1-light-k2-b", 3, "09:35", "09:40", true),
      createPendingSession("d1-light-k2-c", 4, "09:35", "09:40", true),

      // 09:40 - Keynote 2
      {
        id: "d1-keynote-2",
        title: "Keynote",
        type: "KEYNOTE",
        trackId: "all",
        startTime: "09:40",
        endTime: "10:10",
        speaker: {
          name: "Luca Galante",
          role: "Core Contributor @ Platform Engineering",
          avatar: "https://media.licdn.com/dms/image/v2/D4D03AQGnsxN-OqvLIQ/profile-displayphoto-shrink_400_400/B4DZSTWTmlHYAo-/0/1737638886442?e=1772064000&v=beta&t=pHBDvQssQiEBt-q97i69-wI1HNbpocu-AEJKkRHnceg",
        },
      },

      // 10:10 - Lightning Talk 3 (entre keynote 2 y 3)
      createPendingSession("d1-light-k3", 1, "10:10", "10:15", true),
      createPendingSession("d1-light-k3-a", 2, "10:10", "10:15", true),
      createPendingSession("d1-light-k3-b", 3, "10:10", "10:15", true),
      createPendingSession("d1-light-k3-c", 4, "10:10", "10:15", true),

      // 10:15 - Keynote 3
      {
        id: "d1-keynote-3",
        title: "Keynote",
        type: "KEYNOTE",
        trackId: "all",
        startTime: "10:15",
        endTime: "10:45",
        speaker: {
          name: "Alberto Indacochea",
          role: "Director General en Salesforce Perú",
          avatar: "https://media.licdn.com/dms/image/v2/D4E03AQHVolk_yQPCew/profile-displayphoto-scale_400_400/B4EZkqub5_KUAk-/0/1757358441180?e=1772064000&v=beta&t=oBhUNpuZLvNkRK8Mik3tip_lS36XjDSSwqzs1DRaQ-M",
        },
      },

      // === CHARLAS CON LIGHTNING ENTRE CADA UNA ===

      // 10:45 - Charlas Bloque 1
      createPendingSession("d1-a1", 1, "10:45", "11:15"),
      createPendingSession("d1-a1-sala", 2, "10:45", "11:15"),
      createPendingSession("d1-b1", 3, "10:45", "11:15"),
      createPendingSession("d1-c1", 4, "10:45", "11:15"),
      {
        id: "d1-taller1",
        title: "Por definir",
        type: "WORKSHOP",
        trackId: 5,
        startTime: "10:45",
        endTime: "12:45",
        tags: ["Workshop", "2h"],
        location: "Sala de Talleres",
      },

      // 11:15 - Lightning
      createPendingSession("d1-light-1", 1, "11:15", "11:20", true),
      createPendingSession("d1-light-1-a", 2, "11:15", "11:20", true),
      createPendingSession("d1-light-1-b", 3, "11:15", "11:20", true),
      createPendingSession("d1-light-1-c", 4, "11:15", "11:20", true),

      // 11:20 - Charlas Bloque 2
      createPendingSession("d1-a2", 1, "11:20", "11:50"),
      createPendingSession("d1-a2-sala", 2, "11:20", "11:50"),
      createPendingSession("d1-b2", 3, "11:20", "11:50"),
      createPendingSession("d1-c2", 4, "11:20", "11:50"),

      // 11:50 - Lightning
      createPendingSession("d1-light-2", 1, "11:50", "11:55", true),
      createPendingSession("d1-light-2-a", 2, "11:50", "11:55", true),
      createPendingSession("d1-light-2-b", 3, "11:50", "11:55", true),
      createPendingSession("d1-light-2-c", 4, "11:50", "11:55", true),

      // 11:55 - Charlas Bloque 3
      createPendingSession("d1-a3", 1, "11:55", "12:25"),
      createPendingSession("d1-a3-sala", 2, "11:55", "12:25"),
      createPendingSession("d1-b3", 3, "11:55", "12:25"),
      createPendingSession("d1-c3", 4, "11:55", "12:25"),

      // 12:25 - Lightning
      createPendingSession("d1-light-3", 1, "12:25", "12:30", true),
      createPendingSession("d1-light-3-a", 2, "12:25", "12:30", true),
      createPendingSession("d1-light-3-b", 3, "12:25", "12:30", true),
      createPendingSession("d1-light-3-c", 4, "12:25", "12:30", true),

      // 12:30 - Charlas Bloque 4
      createPendingSession("d1-a4", 1, "12:30", "13:00"),
      createPendingSession("d1-a4-sala", 2, "12:30", "13:00"),
      createPendingSession("d1-b4", 3, "12:30", "13:00"),
      createPendingSession("d1-c4", 4, "12:30", "13:00"),

      // 13:00 - Almuerzo
      {
        id: "d1-lunch",
        title: "Almuerzo & Networking",
        type: "BREAK",
        trackId: "all",
        startTime: "13:00",
        endTime: "14:00",
        duration: "60 Minutos",
        description: "Patio Central • Buffet disponible",
      },

      // 14:00 - Charlas Bloque 5
      createPendingSession("d1-a5", 1, "14:00", "14:30"),
      createPendingSession("d1-a5-sala", 2, "14:00", "14:30"),
      createPendingSession("d1-b5", 3, "14:00", "14:30"),
      createPendingSession("d1-c5", 4, "14:00", "14:30"),
      {
        id: "d1-taller3",
        title: "Por definir",
        type: "WORKSHOP",
        trackId: 5,
        startTime: "14:00",
        endTime: "15:10",
        tags: ["Workshop"],
        location: "Sala de Talleres",
      },

      // 14:30 - Lightning
      createPendingSession("d1-light-4", 1, "14:30", "14:35", true),
      createPendingSession("d1-light-4-a", 2, "14:30", "14:35", true),
      createPendingSession("d1-light-4-b", 3, "14:30", "14:35", true),
      createPendingSession("d1-light-4-c", 4, "14:30", "14:35", true),

      // 14:35 - Charlas Bloque 6
      createPendingSession("d1-a6", 1, "14:35", "15:05"),
      createPendingSession("d1-a6-sala", 2, "14:35", "15:05"),
      createPendingSession("d1-b6", 3, "14:35", "15:05"),
      createPendingSession("d1-c6", 4, "14:35", "15:05"),

      // 15:05 - Lightning
      createPendingSession("d1-light-5", 1, "15:05", "15:10", true),
      createPendingSession("d1-light-5-a", 2, "15:05", "15:10", true),
      createPendingSession("d1-light-5-b", 3, "15:05", "15:10", true),
      createPendingSession("d1-light-5-c", 4, "15:05", "15:10", true),

      // 15:10 - Charlas Bloque 7
      createPendingSession("d1-a7", 1, "15:10", "15:40"),
      createPendingSession("d1-a7-sala", 2, "15:10", "15:40"),
      createPendingSession("d1-b7", 3, "15:10", "15:40"),
      createPendingSession("d1-c7", 4, "15:10", "15:40"),

      // 15:40 - Lightning
      createPendingSession("d1-light-6", 1, "15:40", "15:45", true),
      createPendingSession("d1-light-6-a", 2, "15:40", "15:45", true),
      createPendingSession("d1-light-6-b", 3, "15:40", "15:45", true),
      createPendingSession("d1-light-6-c", 4, "15:40", "15:45", true),

      // 15:45 - Charlas Bloque 8
      createPendingSession("d1-a8", 1, "15:45", "16:15"),
      createPendingSession("d1-a8-sala", 2, "15:45", "16:15"),
      createPendingSession("d1-b8", 3, "15:45", "16:15"),
      createPendingSession("d1-c8", 4, "15:45", "16:15"),

      // 16:15 - Break
      {
        id: "d1-break",
        title: "Break & Networking",
        type: "BREAK",
        trackId: "all",
        startTime: "16:15",
        endTime: "16:45",
        duration: "30 Minutos",
        description: "Patio Central • Buffet disponible",
      },

      // 16:45 - Charlas Bloque 9
      createPendingSession("d1-a9", 1, "16:45", "17:15"),
      createPendingSession("d1-a9-sala", 2, "16:45", "17:15"),
      createPendingSession("d1-b9", 3, "16:45", "17:15"),
      createPendingSession("d1-c9", 4, "16:45", "17:15"),

      // 17:15 - Lightning
      createPendingSession("d1-light-7", 1, "17:15", "17:20", true),
      createPendingSession("d1-light-7-a", 2, "17:15", "17:20", true),
      createPendingSession("d1-light-7-b", 3, "17:15", "17:20", true),
      createPendingSession("d1-light-7-c", 4, "17:15", "17:20", true),

      // 17:20 - Conversatorio
      {
        id: "d1-panel",
        title: "Conversatorio",
        type: "PANEL",
        trackId: "all",
        startTime: "17:20",
        endTime: "18:00",
        description: "Main Stage • Lemon - Revolut - Tyba - Tenpo - Kushki",
      },

      // 18:00 - Cierre
      {
        id: "d1-closing",
        title: "Cierre & Networking Final",
        type: "NETWORKING",
        trackId: "all",
        startTime: "18:00",
        endTime: "18:40",
        description: "Main Stage • Sorteos y despedida",
      },
    ],
  },
  {
    id: 2,
    dateLabel: "Día 2",
    fullDate: "16 de Mayo, 2025",
    sessions: [
      // 08:00 - Bienvenida
      {
        id: "d2-welcome",
        title: "Bienvenida Día 2",
        type: "KEYNOTE",
        trackId: "all",
        startTime: "08:00",
        endTime: "09:00",
        description: "Registro y café • Main Stage",
      },

      // 09:00 - Keynote 1
      {
        id: "d2-keynote-1",
        title: "Keynote de Apertura",
        type: "KEYNOTE",
        trackId: "all",
        startTime: "09:00",
        endTime: "09:30",
        speaker: {
          name: "Charity Majors",
          role: "cofounder/CTO, honeycomb.io",
          avatar: "https://media.licdn.com/dms/image/v2/C4E03AQGubx-J6rhmaA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1517662949252?e=1772064000&v=beta&t=XIgge4plus-vapx0qMczyhxrIFYF8gAhzsjuIIEkMIA",
        },
      },

      // 09:30 - Lightning Talk 1 (entre keynote 1 y 2)
      createPendingSession("d2-light-k1", 1, "09:30", "09:35", true),
      createPendingSession("d2-light-k1-a", 2, "09:30", "09:35", true),
      createPendingSession("d2-light-k1-b", 3, "09:30", "09:35", true),
      createPendingSession("d2-light-k1-c", 4, "09:30", "09:35", true),

      // 09:35 - Lightning Talk 2 (entre keynote 1 y 2)
      createPendingSession("d2-light-k2", 1, "09:35", "09:40", true),
      createPendingSession("d2-light-k2-a", 2, "09:35", "09:40", true),
      createPendingSession("d2-light-k2-b", 3, "09:35", "09:40", true),
      createPendingSession("d2-light-k2-c", 4, "09:35", "09:40", true),

      // 09:40 - Keynote 2
      {
        id: "d2-keynote-2",
        title: "Keynote",
        type: "KEYNOTE",
        trackId: "all",
        startTime: "09:40",
        endTime: "10:10",
        speaker: {
          name: "Boris Tane",
          role: "Workers Observability @ Cloudflare",
          avatar: "https://media.licdn.com/dms/image/v2/C4D03AQEv4nH779KUDQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1647352089327?e=1772064000&v=beta&t=sac5dPHkFWoDJXJ5SkyEAWrjywFvAMZZj034qm5djg4",
        },
      },

      // 10:10 - Lightning Talk 3 (entre keynote 2 y 3)
      createPendingSession("d2-light-k3", 1, "10:10", "10:15", true),
      createPendingSession("d2-light-k3-a", 2, "10:10", "10:15", true),
      createPendingSession("d2-light-k3-b", 3, "10:10", "10:15", true),
      createPendingSession("d2-light-k3-c", 4, "10:10", "10:15", true),

      // 10:15 - Keynote 3
      {
        id: "d2-keynote-3",
        title: "Keynote",
        type: "KEYNOTE",
        trackId: "all",
        startTime: "10:15",
        endTime: "10:45",
        speaker: {
          name: "Ricardo Amarilla",
          role: "Senior Solutions Architect @ GitLab",
          avatar: "https://media.licdn.com/dms/image/v2/D4D03AQH2w5dB_8Kt-w/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1728315293907?e=1772064000&v=beta&t=CHJsn_mWWL4hfyGshoWINGMoKNF3BWJ3Pa6AkwK_cXo",
        },
      },

      // === CHARLAS CON LIGHTNING ENTRE CADA UNA ===

      // 10:45 - Charlas Bloque 1
      createPendingSession("d2-a1", 1, "10:45", "11:15"),
      createPendingSession("d2-a1-sala", 2, "10:45", "11:15"),
      createPendingSession("d2-b1", 3, "10:45", "11:15"),
      createPendingSession("d2-c1", 4, "10:45", "11:15"),
      {
        id: "d2-taller1",
        title: "Por definir",
        type: "WORKSHOP",
        trackId: 5,
        startTime: "10:45",
        endTime: "12:00",
        tags: ["Workshop"],
        location: "Sala de Talleres",
      },

      // 11:15 - Lightning
      createPendingSession("d2-light-1", 1, "11:15", "11:20", true),
      createPendingSession("d2-light-1-a", 2, "11:15", "11:20", true),
      createPendingSession("d2-light-1-b", 3, "11:15", "11:20", true),
      createPendingSession("d2-light-1-c", 4, "11:15", "11:20", true),

      // 11:20 - Charlas Bloque 2
      createPendingSession("d2-a2", 1, "11:20", "11:50"),
      createPendingSession("d2-a2-sala", 2, "11:20", "11:50"),
      createPendingSession("d2-b2", 3, "11:20", "11:50"),
      createPendingSession("d2-c2", 4, "11:20", "11:50"),

      // 11:50 - Lightning
      createPendingSession("d2-light-2", 1, "11:50", "11:55", true),
      createPendingSession("d2-light-2-a", 2, "11:50", "11:55", true),
      createPendingSession("d2-light-2-b", 3, "11:50", "11:55", true),
      createPendingSession("d2-light-2-c", 4, "11:50", "11:55", true),

      // 11:55 - Charlas Bloque 3
      createPendingSession("d2-a3", 1, "11:55", "12:25"),
      createPendingSession("d2-a3-sala", 2, "11:55", "12:25"),
      createPendingSession("d2-b3", 3, "11:55", "12:25"),
      createPendingSession("d2-c3", 4, "11:55", "12:25"),
      {
        id: "d2-taller2",
        title: "Por definir",
        type: "WORKSHOP",
        trackId: 5,
        startTime: "12:05",
        endTime: "13:00",
        tags: ["Workshop"],
        location: "Sala de Talleres",
      },

      // 12:25 - Lightning
      createPendingSession("d2-light-3", 1, "12:25", "12:30", true),
      createPendingSession("d2-light-3-a", 2, "12:25", "12:30", true),
      createPendingSession("d2-light-3-b", 3, "12:25", "12:30", true),
      createPendingSession("d2-light-3-c", 4, "12:25", "12:30", true),

      // 12:30 - Charlas Bloque 4
      createPendingSession("d2-a4", 1, "12:30", "13:00"),
      createPendingSession("d2-a4-sala", 2, "12:30", "13:00"),
      createPendingSession("d2-b4", 3, "12:30", "13:00"),
      createPendingSession("d2-c4", 4, "12:30", "13:00"),

      // 13:00 - Almuerzo
      {
        id: "d2-lunch",
        title: "Almuerzo & Networking",
        type: "BREAK",
        trackId: "all",
        startTime: "13:00",
        endTime: "14:00",
        duration: "60 Minutos",
        description: "Patio Central • Buffet disponible",
      },

      // 14:00 - Charlas Bloque 5
      createPendingSession("d2-a5", 1, "14:00", "14:30"),
      createPendingSession("d2-a5-sala", 2, "14:00", "14:30"),
      createPendingSession("d2-b5", 3, "14:00", "14:30"),
      createPendingSession("d2-c5", 4, "14:00", "14:30"),
      {
        id: "d2-taller3",
        title: "Por definir",
        type: "WORKSHOP",
        trackId: 5,
        startTime: "14:00",
        endTime: "15:10",
        tags: ["Workshop"],
        location: "Sala de Talleres",
      },

      // 14:30 - Lightning
      createPendingSession("d2-light-4", 1, "14:30", "14:35", true),
      createPendingSession("d2-light-4-a", 2, "14:30", "14:35", true),
      createPendingSession("d2-light-4-b", 3, "14:30", "14:35", true),
      createPendingSession("d2-light-4-c", 4, "14:30", "14:35", true),

      // 14:35 - Charlas Bloque 6
      createPendingSession("d2-a6", 1, "14:35", "15:05"),
      createPendingSession("d2-a6-sala", 2, "14:35", "15:05"),
      createPendingSession("d2-b6", 3, "14:35", "15:05"),
      createPendingSession("d2-c6", 4, "14:35", "15:05"),

      // 15:05 - Lightning
      createPendingSession("d2-light-5", 1, "15:05", "15:10", true),
      createPendingSession("d2-light-5-a", 2, "15:05", "15:10", true),
      createPendingSession("d2-light-5-b", 3, "15:05", "15:10", true),
      createPendingSession("d2-light-5-c", 4, "15:05", "15:10", true),

      // 15:10 - Charlas Bloque 7
      createPendingSession("d2-a7", 1, "15:10", "15:40"),
      createPendingSession("d2-a7-sala", 2, "15:10", "15:40"),
      createPendingSession("d2-b7", 3, "15:10", "15:40"),
      createPendingSession("d2-c7", 4, "15:10", "15:40"),

      // 15:40 - Lightning
      createPendingSession("d2-light-6", 1, "15:40", "15:45", true),
      createPendingSession("d2-light-6-a", 2, "15:40", "15:45", true),
      createPendingSession("d2-light-6-b", 3, "15:40", "15:45", true),
      createPendingSession("d2-light-6-c", 4, "15:40", "15:45", true),

      // 15:45 - Charlas Bloque 8
      createPendingSession("d2-a8", 1, "15:45", "16:15"),
      createPendingSession("d2-a8-sala", 2, "15:45", "16:15"),
      createPendingSession("d2-b8", 3, "15:45", "16:15"),
      createPendingSession("d2-c8", 4, "15:45", "16:15"),

      // 16:15 - Break
      {
        id: "d2-break",
        title: "Break & Networking",
        type: "BREAK",
        trackId: "all",
        startTime: "16:15",
        endTime: "16:45",
        duration: "30 Minutos",
        description: "Patio Central • Buffet disponible",
      },

      // 16:45 - Charlas Bloque 9
      createPendingSession("d2-a9", 1, "16:45", "17:15"),
      createPendingSession("d2-a9-sala", 2, "16:45", "17:15"),
      createPendingSession("d2-b9", 3, "16:45", "17:15"),
      createPendingSession("d2-c9", 4, "16:45", "17:15"),

      // 17:15 - Lightning
      createPendingSession("d2-light-7", 1, "17:15", "17:20", true),
      createPendingSession("d2-light-7-a", 2, "17:15", "17:20", true),
      createPendingSession("d2-light-7-b", 3, "17:15", "17:20", true),
      createPendingSession("d2-light-7-c", 4, "17:15", "17:20", true),

      // 17:20 - Conversatorio
      {
        id: "d2-panel",
        title: "Conversatorio",
        type: "PANEL",
        trackId: "all",
        startTime: "17:20",
        endTime: "18:00",
        description: "Main Stage • Lemon - Revolut - Tyba - Tenpo - Kushki",
      },

      // 18:00 - Cierre
      {
        id: "d2-closing",
        title: "Cierre & Networking Final",
        type: "NETWORKING",
        trackId: "all",
        startTime: "18:00",
        endTime: "18:40",
        description: "Main Stage • Sorteos y despedida",
      },
    ],
  },
];
