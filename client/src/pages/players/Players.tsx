import { useState, useMemo, useEffect, useRef } from "react";
import type { Player } from "../../types";
import usePlayers from "../../hooks/usePlayers";
import { Link } from "react-router";
import { Search, X } from "lucide-react";
import Loader from "../../components/Loader";

type SelectedGenderType = "Male" | "Female";

const Players = () => {
  const { players, playersLoading, playersError } = usePlayers();

  const [selectedGender, setSelectedGender] =
    useState<SelectedGenderType>("Male");
  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilters, setPositionFilters] = useState<string[]>([]);

  const searchRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const allPlayers = useMemo(() => players || [], [players]);

  const menCount = useMemo(
    () => allPlayers.filter((p) => p.gender === "Male").length,
    [allPlayers]
  );
  const womenCount = useMemo(
    () => allPlayers.filter((p) => p.gender === "Female").length,
    [allPlayers]
  );

  const positionOptions = useMemo(() => {
    const positions = new Set<string>();
    allPlayers.forEach((p) => {
      if (p.gender === selectedGender) positions.add(p.position);
    });
    return Array.from(positions).sort();
  }, [allPlayers, selectedGender]);

  const togglePosition = (pos: string) => {
    setPositionFilters((prev) =>
      prev.includes(pos) ? prev.filter((p) => p !== pos) : [...prev, pos]
    );
  };

  const clearAll = () => {
    setSearchQuery("");
    setPositionFilters([]);
  };

  const filteredPlayers = useMemo(() => {
    const list: Player[] = allPlayers
      .filter((p) => p.gender === selectedGender)
      .filter((p) => {
        const q = searchQuery.trim().toLowerCase();
        const matchesQuery =
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.number.toString().includes(q) ||
          p.position.toLowerCase().includes(q);
        const matchesPositions =
          positionFilters.length === 0 || positionFilters.includes(p.position);
        return matchesQuery && matchesPositions;
      })
      .sort((a, b) => a.number - b.number);

    return list;
  }, [allPlayers, selectedGender, searchQuery, positionFilters]);

  if (playersLoading) {
    return (
      <div className="min-h-screen flex items-center bg-surface justify-center">
        <Loader size={100} />
      </div>
    );
  }

  if (playersError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <p className="text-xl font-semibold text-red-600">
          Error loading players:{" "}
          {(playersError as any).message || "Unknown error"}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Hero + Filters */}
      <section className="relative bg-primary-dark overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/zinme-group-photo.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/80 to-primary-dark" />

        <div className="relative z-10 max-w-[var(--container-content)] mx-auto px-6">
          <div className="pt-28 md:pt-32 pb-6 text-center">
            <h1 className="text-4xl md:text-5xl font-heading uppercase tracking-wide text-white">
              Squad
            </h1>
            <p className="mt-2 text-white/60 text-sm">
              Meet the players of Zinme United
            </p>
          </div>

          <div className="flex justify-center">
            <div className="inline-flex rounded-2xl bg-white/10 p-1 backdrop-blur-sm border border-white/20">
              {["Male", "Female"].map((g) => {
                const isActive = selectedGender === g;
                const count = g === "Male" ? menCount : womenCount;
                return (
                  <button
                    key={g}
                    onClick={() => setSelectedGender(g as SelectedGenderType)}
                    className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                      isActive
                        ? "bg-white text-primary shadow"
                        : "text-white/80 hover:bg-white/10"
                    }`}
                    aria-pressed={isActive}
                  >
                    <span className="mr-2">{g === "Male" ? "Men" : "Women"}</span>
                    <span
                      className={`inline-flex items-center justify-center text-[11px] leading-none font-semibold rounded-full px-2 py-1 ${
                        isActive
                          ? "bg-primary text-white"
                          : "bg-white/20 text-white"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <div className="relative w-full max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search by name, number, or position..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:bg-white/15 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg cursor-pointer hover:bg-white/20"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4 text-white/60" />
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 pb-8 flex flex-wrap justify-center gap-2">
            {positionOptions.map((pos) => {
              const active = positionFilters.includes(pos);
              return (
                <button
                  key={pos}
                  onClick={() => togglePosition(pos)}
                  className={`px-3.5 py-1.5 rounded-full border text-sm transition-all cursor-pointer ${
                    active
                      ? "bg-accent text-primary-dark border-accent font-semibold"
                      : "bg-white/10 text-white/80 border-white/20 hover:bg-white/20 hover:text-white"
                  }`}
                  aria-pressed={active}
                >
                  {pos}
                </button>
              );
            })}

            {(searchQuery || positionFilters.length > 0) && (
              <button
                onClick={clearAll}
                className="px-3.5 py-1.5 rounded-full text-sm cursor-pointer text-white/60 hover:text-white border border-white/10 hover:border-white/30 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Player Grid */}
      <section className="bg-surface-alt">
        <div className="max-w-[var(--container-content)] mx-auto px-4 sm:px-6 py-10 md:py-14">
          {filteredPlayers.length === 0 ? (
            <p className="text-center text-text-muted text-lg py-12">
              No players found.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-6">
              {filteredPlayers.map((player) => (
                <Link
                  to={`/player/${player._id}`}
                  key={player._id}
                  className="group relative rounded-xl overflow-hidden bg-primary shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      loading="lazy"
                      src={player.img || "/zinme.jpg"}
                      alt={player.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-transparent to-transparent" />
                    <span className="absolute top-2 left-2 bg-accent text-primary-dark text-xs font-bold px-2 py-1 rounded-md">
                      #{player.number}
                    </span>
                  </div>

                  <div className="px-3 py-3 text-white">
                    <p className="font-heading text-sm md:text-base uppercase tracking-wide truncate">
                      {player.name}
                    </p>
                    <p className="text-[11px] text-white/60 uppercase tracking-wider mt-0.5">
                      {player.position}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Players;
