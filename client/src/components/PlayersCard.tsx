import type { Player } from "../types";

interface PlayersCardProps {
  players: Player[];
  onPlayerSelect: (player: Player) => void;
}

const PlayersCard = ({ players, onPlayerSelect }: PlayersCardProps) => {
  return (
    <section>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {players.map((player) => (
          <div
            key={player._id}
            className="bg-blue-50 rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transform hover:scale-105 transition-all duration-300 border border-blue-200"
            onClick={() => onPlayerSelect(player)} // Call the prop function
          >
            <img
              src={"/zinme.jpg"}
              alt={player.name}
              className="w-full h-40 object-cover rounded-t-xl"
            />
            <div className="p-4 text-center">
              <span className="block text-sm font-bold text-[#003b75] mb-1">
                Kit Number - {player.number}
              </span>
              <h3 className="text-lg font-semibold text-[#003b75]">
                {player.name}
              </h3>
              <p className="text-[#003b75] text-sm">{player.position}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PlayersCard;
