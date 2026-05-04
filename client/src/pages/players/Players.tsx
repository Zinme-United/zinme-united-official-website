// import { useState, useMemo } from "react";
// import type { Player } from "../../types";
// import usePlayers from "../../hooks/usePlayers";
// import { PlayersCard } from "../../components";
// import Loader from "react-spinners/Loader";

// type SelectedGenderType = "Male" | "Female";

// const Players = () => {
//   const { players, playersLoading, playersError } = usePlayers();

//   const [selectedGenderFilter, setSelectedGenderFilter] =
//     useState<SelectedGenderType>("Male");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [positionFilter, setPositionFilter] = useState("");

//   const allPlayers = useMemo(() => players || [], [players]);

//   const positionOptions = useMemo(() => {
//     const positions = new Set<string>();
//     allPlayers.forEach((p) => {
//       if (p.gender === selectedGenderFilter) {
//         positions.add(p.position);
//       }
//     });
//     return Array.from(positions).sort();
//   }, [allPlayers, selectedGenderFilter]);

//   const filteredPlayers = useMemo(() => {
//     const allPlayers: Player[] = players || [];
//     return allPlayers
//       .filter((player) => player.gender === selectedGenderFilter)
//       .filter((player) => {
//         const query = searchQuery.toLowerCase();
//         const matchesName = player.name.toLowerCase().includes(query);
//         const matchesNumber = player.number.toString().includes(query);
//         const matchesPosition = positionFilter
//           ? player.position.toLowerCase().includes(positionFilter.toLowerCase())
//           : true;
//         return (matchesName || matchesNumber) && matchesPosition;
//       })
//       .sort((a, b) => a.number - b.number);
//   }, [players, selectedGenderFilter, searchQuery, positionFilter]);

//   if (playersLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <Loader
//           color="#003b75"
//           loading={playersLoading}
//           size={50}
//           aria-label="Loading Spinner"
//         />
//       </div>
//     );
//   }

//   if (playersError) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <p className="text-xl font-semibold text-red-600">
//           Error loading players:{" "}
//           {(playersError as any).message || "Unknown error"}
//         </p>
//       </div>
//     );
//   }

//   if (!players || players.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-100 p-6 md:p-10 text-center">
//         <h1 className="text-5xl font-extrabold text-primary mb-10">
//           Our Team
//         </h1>
//         <p className="text-gray-700">No players found.</p>
//         <PlayersCard players={[]} />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-6 md:p-10 relative">
//       <h1 className="text-5xl font-extrabold text-primary mb-10 text-center">
//         Our Team
//       </h1>

//       <div className="max-w-screen-xl mx-auto">
//         <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
//           {/* Gender Filter */}
//           <div className="flex space-x-2">
//             {["Male", "Female"].map((gender) => (
//               <button
//                 key={gender}
//                 onClick={() =>
//                   setSelectedGenderFilter(gender as SelectedGenderType)
//                 }
//                 className={`py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer ${
//                   selectedGenderFilter === gender
//                     ? "bg-primary text-white shadow"
//                     : "bg-white text-black hover:bg-gray-100 border border-gray-300"
//                 }`}
//               >
//                 {gender === "Male" ? "Men Team" : "Women Team"}
//               </button>
//             ))}
//           </div>

//           {/* Search */}
//           <input
//             type="text"
//             placeholder="Search name or number"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="px-4 py-2 text-black border border-gray-300 rounded-md min-w-[200px] flex-1"
//           />

//           {/* Position Filter */}
//           <select
//             value={positionFilter}
//             onChange={(e) => setPositionFilter(e.target.value)}
//             className="px-4 py-2 cursor-pointer text-black border border-gray-300 rounded-md w-full md:w-64"
//           >
//             <option value="">All Positions</option>
//             {positionOptions.map((pos) => (
//               <option key={pos} value={pos}>
//                 {pos}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Cards (No Pagination, Grid Style) */}
//         <PlayersCard players={filteredPlayers} />
//       </div>
//     </div>
//   );
// };

// export default Players;

import { useState, useMemo, useEffect, useRef } from "react";
import type { Player } from "../../types";
import usePlayers from "../../hooks/usePlayers";
import { PlayersCard } from "../../components";
import { Search, X } from "lucide-react";
import Loader from "../../components/Loader";
import PageHero from "../../components/PageHero";

// Tabs for gender + chips for position + hero search bar

type SelectedGenderType = "Male" | "Female";

const Players = () => {
  const { players, playersLoading, playersError } = usePlayers();

  const [selectedGender, setSelectedGender] =
    useState<SelectedGenderType>("Male");
  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilters, setPositionFilters] = useState<string[]>([]); // multi-select chips

  const searchRef = useRef<HTMLInputElement | null>(null);

  // Keyboard shortcut to focus search with "/"
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
      <div className="min-h-screen flex items-center bg-white justify-center">
        <Loader size={100} />
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
        <h1 className="text-5xl font-extrabold text-primary mb-10">
          Our Team
        </h1>
        <p className="text-gray-700">No players found.</p>
        <PlayersCard players={[]} />
      </div>
    );
  }

  return (
    <div className="min-h-screen mx-auto">
      <PageHero
        title="Squad"
        breadcrumbs={[{ label: "Home", path: "/" }, { label: "Squad" }]}
      />

      {/* Filters section */}
      <section className="bg-gradient-to-br from-primary-dark via-primary to-primary-light">
        <div className="mx-auto max-w-[var(--container-content)] px-6 py-8">
          {/* Gender Tabs */}
          <div className="inline-flex rounded-2xl bg-white/10 p-1 backdrop-blur border border-white/20">
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
                      : "text-white/90 hover:bg-white/10"
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

          {/* Hero Search */}
          <div className="mt-6">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search players by name, number, or position"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-4 rounded-2xl border border-white/30 bg-white/90 backdrop-blur text-black placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-white/40"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl cursor-pointer hover:bg-white/70"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4 text-gray-600" />
                </button>
              )}
            </div>
          </div>

          {/* Position Chips */}
          <div className="mt-4 flex flex-wrap gap-2 max-w-3xl">
            {positionOptions.map((pos) => {
              const active = positionFilters.includes(pos);
              return (
                <button
                  key={pos}
                  onClick={() => togglePosition(pos)}
                  className={`px-3 py-1.5 rounded-full border text-sm transition-all cursor-pointer ${
                    active
                      ? "bg-white text-primary border-white shadow"
                      : "bg-white/10 text-white border-white/30 hover:bg-white/20"
                  }`}
                  aria-pressed={active}
                >
                  {pos}
                </button>
              );
            })}
            {positionOptions.length === 0 && (
              <span className="text-white/80 text-sm">
                No positions available.
              </span>
            )}
          </div>

          {/* Active filter pills + Clear */}
          {(searchQuery || positionFilters.length > 0) && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 text-xs bg-white/20 border border-white/30 text-white rounded-full px-3 py-1">
                  <Search className="h-3.5 w-3.5" /> “{searchQuery}”
                  <button
                    onClick={() => setSearchQuery("")}
                    className="ml-1 rounded-full p-0.5 hover:bg-white/30 cursor-pointer"
                    aria-label="Remove search"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {positionFilters.map((pos) => (
                <span
                  key={pos}
                  className="inline-flex items-center gap-1.5 text-xs bg-white/20 border border-white/30 text-white rounded-full px-3 py-1"
                >
                  {pos}
                  <button
                    onClick={() => togglePosition(pos)}
                    className="ml-1 rounded-full p-0.5 hover:bg-white/30 cursor-pointer"
                    aria-label={`Remove ${pos}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <button
                onClick={clearAll}
                className="text-xs cursor-pointer px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 hover:bg-white/30"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

      </section>

      {/* Content */}
      <div className="max-w-[var(--container-content)] mx-auto px-4 sm:px-6 pb-12 pt-8">
        <PlayersCard players={filteredPlayers} />
      </div>
    </div>
  );
};

export default Players;
