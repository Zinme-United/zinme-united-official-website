import { useState } from "react";
import type { Player } from "../../types";
import usePlayers from "../../hooks/usePlayers";
import { PlayerProfileModal, PlayersCard } from "../../components";

import ClipLoader from "react-spinners/ClipLoader";

type SelectedGenderType = "Male" | "Female";

const Players = () => {
  const { players, playersLoading, playersError } = usePlayers();

  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedGenderFilter, setSelectedGenderFilter] =
    useState<SelectedGenderType>("Male");

  if (playersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <ClipLoader
          color="#003b75"
          loading={playersLoading}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }

  if (playersError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold text-red-600">
          Error loading players:{" "}
          {(playersError as any).message || "Unknown error"}
        </p>
      </div>
    );
  }

  const allPlayers: Player[] = players || [];
  const filteredPlayers = allPlayers
    .filter((player) => player.gender === selectedGenderFilter)
    .sort((a, b) => a.number - b.number);

  // Ensure players is an array before rendering PlayersCard
  if (!players || players.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 md:p-10 text-center">
        <h1 className="text-5xl font-extrabold text-[#003b75] mb-10">
          Our Team
        </h1>
        <p className="text-gray-700">No players found.</p>
        <PlayersCard players={[]} onPlayerSelect={setSelectedPlayer} />{" "}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">
      <h1 className="text-5xl font-extrabold text-[#003b75] mb-10 text-center">
        Our Team
      </h1>

      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => setSelectedGenderFilter("Male")}
          className={`py-3 px-6 rounded-lg text-lg font-semibold transition-all duration-300 cursor-pointer ${
            selectedGenderFilter === "Male"
              ? "bg-[#003b75] text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
          }`}
        >
          Men's Team
        </button>
        <button
          onClick={() => setSelectedGenderFilter("Female")}
          className={`py-3 px-6 rounded-lg text-lg font-semibold transition-all duration-300 cursor-pointer ${
            selectedGenderFilter === "Female"
              ? "bg-[#003b75] text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
          }`}
        >
          Women's Team
        </button>
      </div>

      <section className="mb-12">
        {filteredPlayers.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            No{"  "}
            {selectedGenderFilter === "Male"
              ? ""
              : selectedGenderFilter.toLowerCase() + " "}
            players found in the roster yet.
          </p>
        ) : (
          <PlayersCard
            players={filteredPlayers}
            onPlayerSelect={setSelectedPlayer}
          />
        )}
      </section>

      {/* Player Profile Modal */}
      {selectedPlayer && (
        <PlayerProfileModal
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
    </div>
  );
};

export default Players;
