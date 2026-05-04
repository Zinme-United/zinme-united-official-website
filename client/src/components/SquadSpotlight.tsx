import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import type { Player } from "../types";

interface SquadSpotlightProps {
  players: Player[];
}

const SquadSpotlight = ({ players }: SquadSpotlightProps) => {
  // Select one player per position group
  // Position values are abbreviations: GK, CB, LB, RB, CM, DM, AM, LW, RW, ST, CF, etc.
  const positionGroupMap: Record<string, string[]> = {
    GK: ["GK"],
    DEF: ["CB", "LB", "RB", "LWB", "RWB", "SW"],
    MID: ["CM", "DM", "AM", "LM", "RM", "CDM", "CAM"],
    FWD: ["ST", "CF", "LW", "RW", "SS"],
  };

  const spotlightPlayers = Object.entries(positionGroupMap)
    .map(([, abbrevs]) =>
      players.find((p) =>
        abbrevs.includes(p.position.replace(/\./g, "").toUpperCase().trim()),
      ),
    )
    .filter(Boolean) as Player[];

  return (
    <section className="my-12">
      {/* Section header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-1">
            The Team
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary">
            Squad Spotlight
          </h2>
        </div>
        <Link
          to="/players"
          className="hidden sm:flex items-center text-sm font-semibold text-primary hover:text-primary-light transition-colors"
        >
          View Full Squad <ChevronRight size={16} className="ml-1" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {spotlightPlayers.map((player) => (
          <Link to={`/player/${player._id}`} key={player._id} className="group">
            <div className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              {/* Player image */}
              <div className="relative h-[300px] md:h-[320px]">
                <img
                  loading="lazy"
                  src={player.img || "/zinme.jpg"}
                  alt={player.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent" />

                {/* Jersey number */}
                <div className="absolute top-3 right-3 bg-accent text-primary text-lg font-black w-10 h-10 rounded-full flex items-center justify-center shadow-md">
                  {player.number}
                </div>

                {/* Player info at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-bold text-base leading-tight">
                    {player.name}
                  </p>
                  <p className="text-blue-200 text-xs uppercase tracking-wider mt-0.5 font-medium">
                    {player.position}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Mobile link */}
      <div className="sm:hidden text-center mt-6">
        <Link
          to="/players"
          className="inline-flex items-center text-sm font-semibold text-primary"
        >
          View Full Squad <ChevronRight size={16} className="ml-1" />
        </Link>
      </div>
    </section>
  );
};

export default SquadSpotlight;
