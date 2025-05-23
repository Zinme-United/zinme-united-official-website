import { ChartBar, Image, Share2, Twitter, X } from "lucide-react";
import { useState } from "react";

const Players = () => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const players = [
    {
      id: 1,
      name: "John Doe",
      number: 10,
      position: "Forward",
      img: "https://placehold.co/150x150/3B82F6/FFFFFF?text=JD",
      bio: "A prolific goal scorer known for his agility and powerful shots.",
      stats: { appearances: 25, goals: 18, assists: 5 },
      social: { twitter: "#", instagram: "#" },
    },
    {
      id: 2,
      name: "Jane Smith",
      number: 4,
      position: "Defender",
      img: "https://placehold.co/150x150/F97316/FFFFFF?text=JS",
      bio: "A rock-solid defender with exceptional tackling skills and leadership.",
      stats: { appearances: 28, goals: 1, assists: 2 },
      social: { twitter: "#", instagram: "#" },
    },
    {
      id: 3,
      name: "Peter Jones",
      number: 7,
      position: "Midfielder",
      img: "https://placehold.co/150x150/10B981/FFFFFF?text=PJ",
      bio: "The engine of the midfield, known for his vision and passing range.",
      stats: { appearances: 27, goals: 5, assists: 10 },
      social: { twitter: "#", instagram: "#" },
    },
    {
      id: 4,
      name: "Alice Brown",
      number: 1,
      position: "Goalkeeper",
      img: "https://placehold.co/150x150/6366F1/FFFFFF?text=AB",
      bio: "An agile goalkeeper with quick reflexes and excellent command of the box.",
      stats: { appearances: 20, cleanSheets: 8 },
      social: { twitter: "#", instagram: "#" },
    },
    {
      id: 5,
      name: "Michael Green",
      number: 9,
      position: "Forward",
      img: "https://placehold.co/150x150/EF4444/FFFFFF?text=MG",
      bio: "A clinical finisher with a knack for being in the right place at the right time.",
      stats: { appearances: 22, goals: 12, assists: 3 },
      social: { twitter: "#", instagram: "#" },
    },
    {
      id: 6,
      name: "Sarah White",
      number: 5,
      position: "Defender",
      img: "https://placehold.co/150x150/06B6D4/FFFFFF?text=SW",
      bio: "A versatile defender capable of playing center-back or full-back with great composure.",
      stats: { appearances: 26, goals: 0, assists: 1 },
      social: { twitter: "#", instagram: "#" },
    },
  ];

  const coachingStaff = [
    {
      id: 1,
      name: "Coach Smith",
      role: "Head Coach",
      img: "https://placehold.co/100x100/374151/FFFFFF?text=CS",
    },
    {
      id: 2,
      name: "Coach Johnson",
      role: "Assistant Coach",
      img: "https://placehold.co/100x100/374151/FFFFFF?text=CJ",
    },
    {
      id: 3,
      name: "Dr. Lee",
      role: "Team Doctor",
      img: "https://placehold.co/100x100/374151/FFFFFF?text=DL",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 font-inter p-6 md:p-10">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-10 text-center">
        Our Team
      </h1>

      {/* Player Roster Grid */}
      <section className="my-12 bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Players
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {players.map((player) => (
            <div
              key={player.id}
              className="bg-blue-50 rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transform hover:scale-105 transition-all duration-300 border border-blue-200"
              onClick={() => setSelectedPlayer(player)}
            >
              <img
                src={player.img}
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

      {/* Player Profile Modal/Details */}
      {selectedPlayer && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto transform scale-95 animate-fade-in">
            <div className="p-6 md:p-8 relative">
              <button
                onClick={() => setSelectedPlayer(null)}
                className="absolute top-4 right-4 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-full p-2 transition-colors duration-200"
              >
                <X size={24} /> {/* Assuming X icon for close */}
              </button>
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 mb-6">
                <img
                  src={selectedPlayer.img.replace("150x150", "300x300")} // Larger image for profile
                  alt={selectedPlayer.name}
                  className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-blue-500 shadow-lg flex-shrink-0"
                />
                <div className="text-center md:text-left">
                  <h2 className="text-4xl font-bold text-gray-900 mb-2">
                    {selectedPlayer.name}
                  </h2>
                  <p className="text-blue-600 text-xl font-semibold mb-2">
                    #{selectedPlayer.number} | {selectedPlayer.position}
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
                    <ChartBar size={20} className="mr-2" /> Statistics
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    {Object.entries(selectedPlayer.stats).map(
                      ([key, value]) => (
                        <li
                          key={key}
                          className="flex justify-between items-center"
                        >
                          <span className="font-medium capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}:
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
                    {selectedPlayer.social.twitter && (
                      <a
                        href={selectedPlayer.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                      >
                        <Twitter size={32} />
                      </a>
                    )}
                    {selectedPlayer.social.instagram && (
                      <a
                        href={selectedPlayer.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-500 hover:text-pink-700 transition-colors duration-200"
                      >
                        <Instagram size={32} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
              {/* Placeholder for Photo & Video Gallery, Achievements */}
              <div className="mt-8 bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Image size={20} className="mr-2" /> Gallery & Achievements
                </h3>
                <p className="text-gray-700">
                  More content like photo galleries and career achievements
                  would go here.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Coaching Staff & Management */}
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
};

export default Players;
