import { useState, useMemo, useEffect } from "react";
import type { Player } from "../../types";
import usePlayers from "../../hooks/usePlayers";
import { PlayerProfileModal, PlayersCard } from "../../components";
import ClipLoader from "react-spinners/ClipLoader";
import { ChevronLeft, ChevronRight } from "lucide-react";

type SelectedGenderType = "Male" | "Female";

const Players = () => {
  const { players, playersLoading, playersError } = usePlayers();

  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedGenderFilter, setSelectedGenderFilter] =
    useState<SelectedGenderType>("Male");

  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PLAYERS_PER_PAGE = 10;

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
    const indexOfLast = currentPage * PLAYERS_PER_PAGE;
    const indexOfFirst = indexOfLast - PLAYERS_PER_PAGE;
    return filteredPlayers.slice(indexOfFirst, indexOfLast);
  }, [filteredPlayers, currentPage, PLAYERS_PER_PAGE]);

  const totalPages = Math.ceil(filteredPlayers.length / PLAYERS_PER_PAGE);

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
    <div className="min-h-screen bg-gray-100 p-6 md:p-10 relative">
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
                    : "bg-white text-black hover:bg-gray-100 border border-gray-300"
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
        <section className="min-h-[500px] mb-8">
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
          <div className="flex justify-center items-center mt-4 space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 cursor-pointer rounded-full text-[#003b75] disabled:opacity-30"
              title="Previous Page"
            >
              <ChevronLeft color="#003b75" size={24} />
            </button>

            <span className="text-[#003b75] font-medium">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 cursor-pointer rounded-full text-[#003b75] disabled:opacity-30"
              title="Next Page"
            >
              <ChevronRight color="#003b75" size={24} />
            </button>
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
