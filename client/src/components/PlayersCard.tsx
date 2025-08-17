import { Link } from "react-router";
import type { Player } from "../types";

interface PlayersCardProps {
  players: Player[];
}

const PlayersCard = ({ players }: PlayersCardProps) => {
  if (!players || players.length === 0) {
    return (
      <p className="text-center text-gray-600 text-lg col-span-full">
        No players available.
      </p>
    );
  }

  return (
    <section>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {players.map((player) => (
          <Link to={`/player/${player._id}`} key={player._id}>
            <div className="cursor-pointer bg-white shadow rounded-lg overflow-hidden transition transform hover:-translate-y-1 hover:shadow-lg">
              {/* Player Image */}
              <img
                loading="lazy"
                src={player.img || "/zinme.jpg"}
                alt={player.name}
                className="w-full h-[280px] object-cover object-top"
              />

              {/* Number + Name Bar */}
              <div className="bg-[#003b75] text-white text-center py-2 font-semibold">
                <span className="mr-2">{player.number}</span>
                {player.name}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default PlayersCard;
