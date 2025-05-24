import type { PlayerTypes } from "../types";

interface PlayersCardProps {
  players: PlayerTypes[];
  onPlayerSelect: (player: PlayerTypes) => void;
}

const PlayersCard = ({ players, onPlayerSelect }: PlayersCardProps) => {
  console.log(players);
  return (
    <section className="my-12 bg-white rounded-xl shadow-lg p-6 md:p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Players
      </h2>
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
              <span className="block text-sm font-bold text-blue-700 mb-1">
                #{player.number}
              </span>
              <h3 className="text-lg font-semibold text-gray-900">
                {player.name}
              </h3>
              <p className="text-gray-600 text-sm">{player.position}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PlayersCard;
