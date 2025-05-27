import { BarChart3, Facebook, Instagram, Share2, X } from "lucide-react";
import { useState } from "react";
import type { Player } from "../../types";
import usePlayers from "../../hooks/usePlayers";
import { PlayersCard } from "../../components";

type SelectedGenderType = "All" | "Male" | "Female";

const Players = () => {
  const { players, playersLoading, playersError } = usePlayers();

  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedGenderFilter, setSelectedGenderFilter] =
    useState<SelectedGenderType>("All");

  const formatStatLabel = (key: string): string => {
    return key
      .replace(/([A-Z])/g, " $1")
      .trim()
      .replace(/^\w/, (c) => c.toUpperCase());
  };

  if (playersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold text-gray-700">
          Loading players...
        </p>
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
  const filteredPlayers = allPlayers.filter((player) => {
    if (selectedGenderFilter === "All") {
      return true;
    }
    return player.gender === selectedGenderFilter; // Filter by 'Male' or 'Female'
  });

  // Ensure players is an array before rendering PlayersCard
  if (!players || players.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 md:p-10 text-center">
        <h1 className="text-5xl font-extrabold text-[#003b75] mb-10">
          Our Team
        </h1>
        <p className="text-gray-700">No players found.</p>
        <PlayersCard players={[]} onPlayerSelect={setSelectedPlayer} />{" "}
        {/* Pass empty array */}
        <section className="my-12 bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Coaching Staff & Management
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {coachingStaff.map((member) => (
              <div
                key={member.id}
                className="bg-gray-50 rounded-xl shadow-md p-4 text-center border border-gray-200"
              >
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-3 border-2 border-gray-300"
                />
                <h3 className="text-lg font-semibold text-gray-900">
                  {member.name}
                </h3>
                <p className="text-gray-600 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </section>
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
          onClick={() => setSelectedGenderFilter("All")}
          className={`py-3 px-6 rounded-lg text-lg font-semibold transition-all duration-300 cursor-pointer ${
            selectedGenderFilter === "All"
              ? "bg-[#003b75] text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
          }`}
        >
          All Players
        </button>
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
            No
            {selectedGenderFilter === "All"
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
        <div className="fixed inset-0 bg-[#003b75] bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 md:p-8 relative">
              <button
                onClick={() => setSelectedPlayer(null)}
                className="absolute top-4 right-4 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-full p-2 transition-colors duration-200"
                aria-label="Close player profile"
              >
                <X size={24} />
              </button>

              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 mb-6">
                <img
                  src={"/zinme.jpg"}
                  alt={selectedPlayer.name}
                  className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-blue-500 shadow-lg flex-shrink-0"
                />
                <div className="text-center md:text-left">
                  <h2 className="text-4xl font-bold text-gray-900 mb-2">
                    {selectedPlayer.name}
                  </h2>
                  <p className="text-blue-600 text-xl font-semibold mb-2">
                    Kit Number - {selectedPlayer.number} |{" "}
                    {selectedPlayer.position}
                  </p>
                  <p className="text-gray-700 text-md leading-relaxed">
                    {selectedPlayer.bio}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Statistics */}
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <BarChart3 size={20} className="mr-2" /> Statistics
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    {Object.entries(selectedPlayer.stats).map(
                      ([key, value]) => (
                        <li
                          key={key}
                          className="flex justify-between items-center"
                        >
                          <span className="font-medium">
                            {formatStatLabel(key)}:
                          </span>
                          <span className="font-bold text-blue-700">
                            {value}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                {/* Social Media */}
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <Share2 size={20} className="mr-2" /> Connect
                  </h3>
                  <div className="flex justify-center md:justify-start space-x-4">
                    {/* Use optional chaining for social properties */}
                    {selectedPlayer.social?.twitter && (
                      <a
                        href={selectedPlayer.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#003b75] hover:text-[#003b75] transition-colors duration-200"
                        aria-label={`${selectedPlayer.name}'s Twitter`}
                      >
                        <Facebook color="#003b75" size={28} />
                      </a>
                    )}
                    {selectedPlayer.social?.instagram && (
                      <a
                        href={selectedPlayer.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-500 hover:text-pink-700 transition-colors duration-200"
                        aria-label={`${selectedPlayer.name}'s Instagram`}
                      >
                        <Instagram color="#003b75" size={28} />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Gallery & Achievements */}
              {/* <div className="mt-8 bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Image size={20} className="mr-2" /> Gallery & Achievements
                </h3>
                <p className="text-gray-700">
                  More content like photo galleries and career achievements
                  would go here.
                </p>
              </div> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Players;
