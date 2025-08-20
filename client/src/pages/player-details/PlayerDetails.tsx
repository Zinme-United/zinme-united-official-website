import { useParams, useNavigate } from "react-router";
import ClipLoader from "react-spinners/ClipLoader";
// import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import usePlayerById from "../../hooks/useGetPlayerById";
import Pitch from "../../components/Pitch";
import { positionToMarkers } from "../../utils/positionToMarkers";

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
      <section className="relative overflow-hidden text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${player.img})` }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />

        <div className="relative z-10">
          <div className="max-w-screen-xl mx-auto px-6 py-16 md:py-20">
            <div className="grid grid-cols-1 md:grid-cols-[1.3fr_0.9fr] gap-10 items-center">
              <div className="relative">
                <span className="absolute -top-10 -left-2 select-none text-white/10 font-extrabold leading-none text-[120px] md:text-[160px]">
                  {player.number}
                </span>

                <div className="relative">
                  <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-sm">
                    {player.name}
                  </h1>
                  <p className="mt-2 text-lg text-gray-200">
                    <span className="font-semibold text-white">
                      {player.number}
                    </span>{" "}
                    • {player.position}
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white/10 rounded-lg p-3 text-center backdrop-blur">
                    <p className="text-2xl font-extrabold">
                      {player.stats.appearances}
                    </p>
                    <p className="text-[11px] uppercase tracking-wide text-gray-200">
                      Appearances
                    </p>
                  </div>
                  {player.stats.goals !== undefined && (
                    <div className="bg-white/10 rounded-lg p-3 text-center backdrop-blur">
                      <p className="text-2xl font-extrabold">
                        {player.stats.goals}
                      </p>
                      <p className="text-[11px] uppercase tracking-wide text-gray-200">
                        Goals
                      </p>
                    </div>
                  )}
                  {player.stats.assists !== undefined && (
                    <div className="bg-white/10 rounded-lg p-3 text-center backdrop-blur">
                      <p className="text-2xl font-extrabold">
                        {player.stats.assists}
                      </p>
                      <p className="text-[11px] uppercase tracking-wide text-gray-200">
                        Assists
                      </p>
                    </div>
                  )}
                  {player.stats.cleanSheets !== undefined && (
                    <div className="bg-white/10 rounded-lg p-3 text-center backdrop-blur">
                      <p className="text-2xl font-extrabold">
                        {player.stats.cleanSheets}
                      </p>
                      <p className="text-[11px] uppercase tracking-wide text-gray-200">
                        Clean Sheets
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                  <p>
                    <span className="font-semibold text-white">Position:</span>{" "}
                    {player.position}
                  </p>
                  <p>
                    <span className="font-semibold text-white">
                      Kit Number:
                    </span>{" "}
                    {player.number}
                  </p>
                </div>

                <p className="mt-6 text-gray-100/90 text-sm leading-relaxed">
                  {player.bio}
                </p>

                <div className="mt-8 rounded-2xl bg-[#0D5BD7] shadow-lg ring-1 ring-white/10 p-4 md:p-5">
                  <h3 className="text-lg font-bold mb-3">Main Position</h3>
                  <div className="flex justify-center">
                    <Pitch
                      className="w-full max-w-[500px] aspect-[1.6] rounded-lg"
                      theme={{
                        bg: "#0D5BD7",
                        line: "#FFFFFF",
                        dotFill: "#69E36F",
                        dotStroke: "rgba(0,0,0,0.25)",
                      }}
                      markers={positionToMarkers(player.position)}
                    />
                  </div>
                </div>
              </div>

              <div className="justify-self-center md:justify-self-end">
                <div className="relative">
                  <img
                    src={player.img || "/zinme.jpg"}
                    alt={player.name}
                    className="w-[300px] h-[420px] md:w-[340px] md:h-[460px] object-cover rounded-2xl shadow-2xl border-4 border-white/15"
                    loading="eager"
                  />

                  <div className="absolute -inset-2 -z-10 rounded-3xl bg-white/5 blur-2xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
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
      </section>
    </>
  );
};

export default PlayerDetailPage;
