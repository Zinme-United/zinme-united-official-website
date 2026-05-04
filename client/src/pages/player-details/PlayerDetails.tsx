import { useParams, useNavigate, Link } from "react-router";
import usePlayerById from "../../hooks/useGetPlayerById";
import Pitch from "../../components/Pitch";
import { positionToMarkers } from "../../utils/positionToMarkers";
import { format } from "date-fns";
import Loader from "../../components/Loader";
import { ChevronRight } from "lucide-react";

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
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <Loader size={100} />
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface">
        <p className="text-xl font-semibold text-red-600 mb-4">
          {error ? "Error loading player." : "Player not found."}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary-light transition-colors"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Hero — player image visible on the right */}
      <section className="relative min-h-[60vh] md:min-h-[70vh] overflow-hidden text-white bg-primary-dark">
        {/* Dark background base */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-primary-dark" />

        {/* Player photo — right side, full visible */}
        <div className="absolute right-0 bottom-0 h-full w-[55%] md:w-[45%] pointer-events-none">
          <img
            src={player.img || "/zinme.jpg"}
            alt={player.name}
            className="h-full w-full object-contain object-bottom"
          />
          {/* Fade on left edge so it blends into dark bg */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-transparent to-transparent" />
        </div>

        {/* Content overlay */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Breadcrumbs */}
          <nav
            className="pt-24 md:pt-28 px-6 max-w-screen-xl mx-auto w-full"
            aria-label="Breadcrumb"
          >
            <ol className="flex items-center gap-1 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <ChevronRight size={14} className="text-white/40" />
              </li>
              <li>
                <Link
                  to="/players"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Squad
                </Link>
              </li>
              <li>
                <ChevronRight size={14} className="text-white/40" />
              </li>
              <li className="text-accent font-medium">{player.name}</li>
            </ol>
          </nav>

          {/* Player identity — left side */}
          <div className="flex-grow flex items-end">
            <div className="max-w-screen-xl mx-auto w-full px-6 pb-10 md:pb-14">
              {/* Large jersey number watermark */}
              <span className="block select-none font-heading font-black leading-none text-white/10 text-[100px] md:text-[180px] -mb-6 md:-mb-10">
                {player.number}
              </span>

              <h1 className="text-4xl md:text-6xl font-heading uppercase tracking-wide drop-shadow-lg">
                {player.name}
              </h1>
              <p className="mt-2 text-lg md:text-xl text-white/80">
                <span className="text-accent font-bold">#{player.number}</span>
                <span className="mx-2 text-white/30">|</span>
                {player.position}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-primary text-white">
        <div className="max-w-screen-xl mx-auto px-6 py-6">
          <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6">
            <div className="text-center px-5 py-3 bg-white/10 rounded-lg backdrop-blur-sm min-w-[100px]">
              <p className="text-2xl md:text-3xl font-heading font-bold">
                {player.stats.appearances}
              </p>
              <p className="text-[11px] uppercase tracking-wider text-white/60 mt-1">
                Appearances
              </p>
            </div>
            {player.stats.goals !== undefined && (
              <div className="text-center px-5 py-3 bg-white/10 rounded-lg backdrop-blur-sm min-w-[100px]">
                <p className="text-2xl md:text-3xl font-heading font-bold">
                  {player.stats.goals}
                </p>
                <p className="text-[11px] uppercase tracking-wider text-white/60 mt-1">
                  Goals
                </p>
              </div>
            )}
            {player.stats.assists !== undefined && (
              <div className="text-center px-5 py-3 bg-white/10 rounded-lg backdrop-blur-sm min-w-[100px]">
                <p className="text-2xl md:text-3xl font-heading font-bold">
                  {player.stats.assists}
                </p>
                <p className="text-[11px] uppercase tracking-wider text-white/60 mt-1">
                  Assists
                </p>
              </div>
            )}
            {player.stats.cleanSheets !== undefined && (
              <div className="text-center px-5 py-3 bg-white/10 rounded-lg backdrop-blur-sm min-w-[100px]">
                <p className="text-2xl md:text-3xl font-heading font-bold">
                  {player.stats.cleanSheets}
                </p>
                <p className="text-[11px] uppercase tracking-wider text-white/60 mt-1">
                  Clean Sheets
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Player details */}
      <section className="bg-surface">
        <div className="max-w-screen-xl mx-auto px-6 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-10 lg:gap-16">
            {/* Left — Bio & Info */}
            <div>
              <h2 className="text-2xl font-heading uppercase tracking-wide text-primary mb-6">
                Player Profile
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-surface-alt rounded-lg p-4">
                  <p className="text-xs uppercase tracking-wider text-text-muted mb-1">Position</p>
                  <p className="font-heading text-lg text-text">{player.position}</p>
                </div>
                <div className="bg-surface-alt rounded-lg p-4">
                  <p className="text-xs uppercase tracking-wider text-text-muted mb-1">Kit Number</p>
                  <p className="font-heading text-lg text-text">#{player.number}</p>
                </div>
                <div className="bg-surface-alt rounded-lg p-4">
                  <p className="text-xs uppercase tracking-wider text-text-muted mb-1">Age</p>
                  <p className="font-heading text-lg text-text">{player.age}</p>
                </div>
                <div className="bg-surface-alt rounded-lg p-4">
                  <p className="text-xs uppercase tracking-wider text-text-muted mb-1">Date of Birth</p>
                  <p className="font-heading text-lg text-text">
                    {player.dateOfBirth
                      ? format(player.dateOfBirth, "dd MMM yyyy")
                      : "—"}
                  </p>
                </div>
              </div>

              {player.bio && (
                <>
                  <h3 className="text-lg font-heading uppercase tracking-wide text-primary mb-3">
                    Biography
                  </h3>
                  <p className="text-text-muted leading-relaxed">
                    {player.bio}
                  </p>
                </>
              )}
            </div>

            {/* Right — Position map */}
            <div>
              <h2 className="text-2xl font-heading uppercase tracking-wide text-primary mb-6">
                Main Position
              </h2>
              <div
                className="rounded-xl p-5 md:p-6 shadow-card"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                <div className="flex justify-center">
                  <Pitch
                    className="w-full max-w-[500px] aspect-[1.6] rounded-lg"
                    theme={{
                      bg: "var(--color-primary)",
                      line: "#FFFFFF",
                      dotFill: "#69E36F",
                      dotStroke: "rgba(0,0,0,0.25)",
                    }}
                    markers={positionToMarkers(player.position)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="bg-surface-alt py-12">
        <h2 className="text-center text-2xl font-heading uppercase tracking-wide text-primary mb-8">
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
