import React from "react";

type Marker =
  | { x: number; y: number; label?: string }
  | { role: keyof typeof ROLE_TO_COORD; label?: string };

const ROLE_TO_COORD = {
  GK: { x: 6, y: 50 },
  LB: { x: 18, y: 22 },
  LCB: { x: 15, y: 38 },
  CB: { x: 15, y: 50 },
  RCB: { x: 15, y: 62 },
  RB: { x: 18, y: 78 },
  DM: { x: 35, y: 50 },
  LCM: { x: 46, y: 38 },
  CM: { x: 50, y: 50 },
  RCM: { x: 46, y: 62 },
  LW: { x: 70, y: 22 },
  ST: { x: 78, y: 50 },
  RW: { x: 70, y: 78 },
} as const;

function resolveMarker(m: Marker) {
  if ("role" in m)
    return { ...ROLE_TO_COORD[m.role], label: m.label ?? m.role };
  return m;
}

interface PitchProps {
  markers?: Marker[];
  className?: string;
  showCenterCircle?: boolean;
  theme?: {
    bg?: string;
    line?: string;
    dotFill?: string;
    dotStroke?: string;
  };
}

const Pitch: React.FC<PitchProps> = ({
  markers = [
    { x: 50, y: 46 },
    { x: 50, y: 54 },
  ],
  className = "w-full max-w-[560px] aspect-[1.6] rounded-xl shadow",
  showCenterCircle = true,
  theme = {
    bg: "var(--color-primary)" /* token: --color-primary */,
    line: "var(--color-surface)" /* token: --color-surface */,
    dotFill: "#66E26F" /* chart-specific green, not a club color */,
    dotStroke: "rgba(0,0,0,0.25)",
  },
}) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    style={{ background: theme.bg }}
    aria-label="Football pitch"
    role="img"
  >
    {/* Outline */}
    <rect
      x="2"
      y="2"
      width="96"
      height="96"
      rx="1.5"
      fill="none"
      stroke={theme.line}
      strokeWidth="1.2"
    />
    {/* Halfway */}
    <line x1="50" y1="2" x2="50" y2="98" stroke={theme.line} strokeWidth="1" />
    {/* Boxes */}
    <rect
      x="2"
      y="30"
      width="16"
      height="40"
      fill="none"
      stroke={theme.line}
      strokeWidth="1"
    />
    <rect
      x="2"
      y="40"
      width="6"
      height="20"
      fill="none"
      stroke={theme.line}
      strokeWidth="1"
    />
    <rect
      x="82"
      y="30"
      width="16"
      height="40"
      fill="none"
      stroke={theme.line}
      strokeWidth="1"
    />
    <rect
      x="92"
      y="40"
      width="6"
      height="20"
      fill="none"
      stroke={theme.line}
      strokeWidth="1"
    />
    {/* Center */}
    {showCenterCircle && (
      <>
        <circle
          cx="50"
          cy="50"
          r="8.5"
          fill="none"
          stroke={theme.line}
          strokeWidth="1"
        />
        <circle cx="50" cy="50" r="0.8" fill={theme.line} />
      </>
    )}
    {/* Corners */}
    <path
      d="M4,2 A2,2 0 0 1 2,4"
      fill="none"
      stroke={theme.line}
      strokeWidth="0.8"
    />
    <path
      d="M98,4 A2,2 0 0 1 96,2"
      fill="none"
      stroke={theme.line}
      strokeWidth="0.8"
    />
    <path
      d="M4,98 A2,2 0 0 0 2,96"
      fill="none"
      stroke={theme.line}
      strokeWidth="0.8"
    />
    <path
      d="M98,96 A2,2 0 0 0 96,98"
      fill="none"
      stroke={theme.line}
      strokeWidth="0.8"
    />

    {/* Markers */}
    {markers.map((m, i) => {
      const { x, y, label } = resolveMarker(m);
      return (
        <g key={i} transform={`translate(${x} ${y})`}>
          <circle
            r="4.6"
            fill="rgba(0,0,0,0.18)"
            transform="translate(0 0.8)"
          />
          <circle
            r="4.6"
            fill={theme.dotFill}
            stroke={theme.dotStroke}
            strokeWidth="0.6"
          />
          {label && (
            <text
              y="8.5"
              textAnchor="middle"
              fontSize="3.2"
              fill={theme.line}
              style={{ fontWeight: 700 }}
            >
              {label}
            </text>
          )}
        </g>
      );
    })}
  </svg>
);

export default Pitch;
export type { Marker };
export { ROLE_TO_COORD };
