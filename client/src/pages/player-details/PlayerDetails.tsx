import { useParams, useNavigate } from "react-router";
import ClipLoader from "react-spinners/ClipLoader";
// import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import usePlayerById from "../../hooks/useGetPlayerById";

const partners = [
  { id: 1, name: "Adidas", logo: "/adidas.png", url: "#" },
  { id: 2, name: "Coca-Cola", logo: "/coca-cola.png", url: "#" },
  { id: 3, name: "EA Sports", logo: "/easports.png", url: "#" },
  { id: 4, name: "Nike", logo: "/nike.png", url: "#" },
];

const PlayerDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: player, isLoading, error } = usePlayerById(id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <ClipLoader color="#003b75" size={50} />
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold text-red-600 mb-4">
          {error ? "Error loading player." : "Player not found."}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-[#003b75] text-white rounded-lg shadow hover:bg-blue-900"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section with Background Image */}
      <div className="relative text-white overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("/zinme.jpg")`,
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70" />

        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center gap-10 px-6 py-16 relative z-10">
          {/* Left Section: Text + Stats */}
          <div className="flex-1 relative">
            {/* Jersey Number Watermark */}
            <p className="text-[120px] md:text-[160px] font-extrabold text-white opacity-10 absolute -top-6 -left-2 select-none">
              {player.number}
            </p>

            {/* Name + Position */}
            <h1 className="text-4xl md:text-5xl font-bold relative z-10">
              {player.name}
            </h1>
            <p className="text-lg mt-2 text-gray-200 relative z-10">
              {player.number} • {player.position}
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 relative z-10">
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold">{player.stats.appearances}</p>
                <p className="text-xs uppercase text-gray-200">Appearances</p>
              </div>
              {player.stats.goals !== undefined && (
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold">{player.stats.goals}</p>
                  <p className="text-xs uppercase text-gray-200">Goals</p>
                </div>
              )}
              {player.stats.assists !== undefined && (
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold">{player.stats.assists}</p>
                  <p className="text-xs uppercase text-gray-200">Assists</p>
                </div>
              )}
              {player.stats.cleanSheets !== undefined && (
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold">
                    {player.stats.cleanSheets}
                  </p>
                  <p className="text-xs uppercase text-gray-200">
                    Clean Sheets
                  </p>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="grid grid-cols-2 gap-4 mt-6 text-sm relative z-10">
              <p>
                <span className="font-semibold">Position:</span>{" "}
                {player.position}
              </p>
              <p>
                <span className="font-semibold">Kit Number:</span>{" "}
                {player.number}
              </p>
              <p>
                <span className="font-semibold">Gender:</span> {player.gender}
              </p>
            </div>

            {/* Biography Snippet */}
            <p className="mt-6 text-gray-100 text-sm leading-relaxed line-clamp-3 relative z-10">
              {player.bio}
            </p>

            {/* Social Links */}
            {/* <div className="flex space-x-4 mt-4 relative z-10">
              {player.social?.facebook && (
                <a
                  href={player.social.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#003b75]"
                >
                  <FaFacebook size={22} />
                </a>
              )}
              {player.social?.twitter && (
                <a
                  href={player.social.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#003b75]"
                >
                  <FaTwitter size={22} />
                </a>
              )}
              {player.social?.instagram && (
                <a
                  href={player.social.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#003b75]"
                >
                  <FaInstagram size={22} />
                </a>
              )}
            </div> */}
          </div>

          {/* Right Section: Player Image (foreground focus) */}
          <div className="flex-shrink-0 relative">
            <img
              src={player.img || "/zinme.jpg"}
              alt={player.name}
              className="w-[320px] h-[420px] object-cover rounded-2xl shadow-2xl border-4 border-white/20 relative z-20"
            />
          </div>
        </div>
      </div>
      <div className="bg-white py-12">
        <h2 className="text-center text-2xl font-bold text-[#003b75] mb-8">
          Our Partners
        </h2>
        <div className="max-w-screen-xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 px-6">
          {partners.map((partner) => (
            <a
              key={partner.id}
              href={partner.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center grayscale hover:grayscale-0 transition"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-h-12 object-contain"
              />
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default PlayerDetailPage;
