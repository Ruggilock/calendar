/**
 * Seed sessions into Supabase from a JSON file.
 * Usage: bun run scripts/seed-sessions.ts
 *
 * Place your full JSON (same format as the app export) at:
 *   scripts/sessions.json
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

// Read .env.local manually (not in Next.js context)
const env: Record<string, string> = {};
for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
  const eq = line.indexOf("=");
  if (eq > 0 && !line.startsWith("#")) {
    env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
  }
}

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
);

const data = JSON.parse(readFileSync("scripts/sessions.json", "utf-8"));

async function seed() {
  let ok = 0, fail = 0;

  for (const day of data.schedules) {
    for (const session of day.sessions) {
      const row = {
        id: session.id,
        day_id: day.id,
        title: session.title,
        type: session.type,
        track_id: String(session.trackId),
        start_time: session.startTime,
        end_time: session.endTime,
        speaker: session.speaker ?? null,
        tags: session.tags ?? [],
        description: session.description || null,
        location: session.location || null,
        duration: session.duration || null,
        sponsor_logo: session.sponsorLogo || null,
        talk_id: null,
      };

      const { error } = await supabase.from("sessions").upsert(row);
      if (error) {
        console.error(`✗ ${session.id}: ${error.message}`);
        fail++;
      } else {
        console.log(`✓ ${session.id}`);
        ok++;
      }
    }
  }

  console.log(`\nDone: ${ok} inserted, ${fail} failed.`);
}

seed();
