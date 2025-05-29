import type { Player } from "../types";
import { BarChart3, Facebook, Instagram, Share2, X } from "lucide-react";
import { formatStatLabel } from "../utils/formatStatLabel";

interface ProfileModalProps {
  player: Player;
  onClose: () => void;
}

const PlayerProfileModal = ({ player, onClose }: ProfileModalProps) => {
  return (
    <div className="fixed inset-0 bg-[#003b75] bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 md:p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 cursor-pointer right-4 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-full p-2 transition-colors duration-200"
            aria-label="Close player profile"
          >
            <X color="#003b75" size={24} />
          </button>

          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 mb-6">
            <img
              src={player.img || "/zinme.jpg"}
              alt={player.name}
              className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-[#003b75] shadow-lg flex-shrink-0"
            />
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-bold text-[#003b75] mb-2">
                {player.name}
              </h2>
              <p className="text-[#003b75] text-xl font-semibold mb-2">
                Kit Number - {player.number} | {player.position}
              </p>
              <p className="text-[#003b75] text-md leading-relaxed">
                {player.bio}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold text-[#003b75] mb-4 flex items-center">
                <BarChart3 color="#003b75" size={20} className="mr-2" />{" "}
                Statistics
              </h3>
              <ul className="space-y-2 text-[#003b75]">
                {Object.entries(player.stats).map(([key, value]) => (
                  <li key={key} className="flex justify-between items-center">
                    <span className="font-medium">{formatStatLabel(key)}:</span>
                    <span className="font-bold text-[#003b75]">{value}</span>
                  </li>
                ))}
              </ul>
            </div>

            {player.social &&
              (player.social.facebook ||
                player.social.twitter ||
                player.social.instagram) && (
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-xl font-bold text-[#003b75] mb-4 flex items-center">
                    <Share2 size={20} className="mr-2" color="#003b75" />{" "}
                    Connect
                  </h3>
                  <div className="flex justify-center md:justify-start space-x-4">
                    {player.social.facebook && (
                      <a
                        href={player.social.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${player.name}'s Facebook`}
                      >
                        <Facebook color="#003b75" size={28} />
                      </a>
                    )}
                    {player.social.twitter && (
                      <a
                        href={player.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${player.name}'s Twitter`}
                      >
                        <Facebook color="#003b75" size={28} />
                      </a>
                    )}
                    {player.social.instagram && (
                      <a
                        href={player.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${player.name}'s Instagram`}
                      >
                        <Instagram color="#003b75" size={28} />
                      </a>
                    )}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfileModal;
