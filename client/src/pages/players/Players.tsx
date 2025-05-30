import { useState, useMemo, useEffect } from "react";
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

  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const playersPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, positionFilter, selectedGenderFilter]);

  const allPlayers = useMemo(() => players || [], [players]);

  const positionOptions = useMemo(() => {
    const positions = new Set<string>();
    allPlayers.forEach((p) => {
      if (p.gender === selectedGenderFilter) {
        positions.add(p.position);
      }
    });
    return Array.from(positions).sort();
  }, [allPlayers, selectedGenderFilter]);

  const filteredPlayers = useMemo(() => {
    const allPlayers: Player[] = players || [];
    return allPlayers
      .filter((player) => player.gender === selectedGenderFilter)
      .filter((player) => {
        const query = searchQuery.toLowerCase();
        const matchesName = player.name.toLowerCase().includes(query);
        const matchesNumber = player.number.toString().includes(query);
        const matchesPosition = positionFilter
          ? player.position.toLowerCase().includes(positionFilter.toLowerCase())
          : true;
        return (matchesName || matchesNumber) && matchesPosition;
      })
      .sort((a, b) => a.number - b.number);
  }, [players, selectedGenderFilter, searchQuery, positionFilter]);

  const currentPlayers = useMemo(() => {
    const indexOfLast = currentPage * playersPerPage;
    const indexOfFirst = indexOfLast - playersPerPage;
    return filteredPlayers.slice(indexOfFirst, indexOfLast);
  }, [filteredPlayers, currentPage, playersPerPage]);

  const totalPages = Math.ceil(filteredPlayers.length / playersPerPage);

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

  if (!players || players.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 md:p-10 text-center">
        <h1 className="text-5xl font-extrabold text-[#003b75] mb-10">
          Our Team
        </h1>
        <p className="text-gray-700">No players found.</p>
        <PlayersCard players={[]} onPlayerSelect={setSelectedPlayer} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">
      <h1 className="text-5xl font-extrabold text-[#003b75] mb-10 text-center">
        Our Team
      </h1>

      <div className="max-w-screen-xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 px-4">
          <div className="flex space-x-2">
            {["Male", "Female"].map((gender) => (
              <button
                key={gender}
                onClick={() =>
                  setSelectedGenderFilter(gender as SelectedGenderType)
                }
                className={`py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  selectedGenderFilter === gender
                    ? "bg-[#003b75] text-white shadow"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                }`}
              >
                {gender === "Male" ? "Men Team" : "Women Team"}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Search name or number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 text-black border border-gray-300 rounded-md min-w-[200px] flex-1"
          />

          <select
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            className="px-4 py-2 cursor-pointer text-black border border-gray-300 rounded-md w-full md:w-64"
          >
            <option value="">All Positions</option>
            {positionOptions.map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            ))}
          </select>
        </div>

        {/* Cards */}
        <section className="mb-8">
          {filteredPlayers.length === 0 ? (
            <p className="text-center text-gray-600 text-lg">
              No{" "}
              {selectedGenderFilter === "Male"
                ? ""
                : selectedGenderFilter.toLowerCase() + " "}
              players found in the roster yet.
            </p>
          ) : (
            <PlayersCard
              players={currentPlayers}
              onPlayerSelect={setSelectedPlayer}
            />
          )}
        </section>

        {totalPages > 1 && (
          <div className="flex justify-center space-x-2 mt-6">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 cursor-pointer rounded ${
                  currentPage === i + 1
                    ? "bg-[#003b75] text-white"
                    : "bg-white border text-[#003b75] border-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Player Modal */}
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
