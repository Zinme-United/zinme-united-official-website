import type { Marker } from "../components/Pitch";

const normalize = (s: string) => s.replace(/\./g, "").toUpperCase().trim(); // e.g., "C.M." -> "CM"

export function positionToMarkers(position: string): Marker[] {
  // supports "CM", "DM", "LW", "ST", "RW", etc.
  // and combos like "CM / DM" or "RW, LW"
  const parts = position
    .split(/[\/,]/)
    .map((p) => normalize(p))
    .filter(Boolean);

  if (parts.length === 0) return [{ x: 50, y: 50 }];

  return parts.map((p) => ({ role: p as any, label: undefined })) as Marker[];
}
