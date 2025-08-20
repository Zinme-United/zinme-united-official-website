// import { useState, useMemo } from "react";
// import type { Player } from "../../types";
// import usePlayers from "../../hooks/usePlayers";
// import { PlayersCard } from "../../components";
// import ClipLoader from "react-spinners/ClipLoader";

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
//         <ClipLoader
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
//         <h1 className="text-5xl font-extrabold text-[#003b75] mb-10">
//           Our Team
//         </h1>
//         <p className="text-gray-700">No players found.</p>
//         <PlayersCard players={[]} />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-6 md:p-10 relative">
//       <h1 className="text-5xl font-extrabold text-[#003b75] mb-10 text-center">
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
//                     ? "bg-[#003b75] text-white shadow"
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

// import { useState, useMemo, useEffect, useRef } from "react";
// import type { Player } from "../../types";
// import usePlayers from "../../hooks/usePlayers";
// import { PlayerProfileModal, PlayersCard } from "../../components";
// import ClipLoader from "react-spinners/ClipLoader";
// import { Search, ChevronDown, X, Filter } from "lucide-react";

// // Keep your original type
// type SelectedGenderType = "Male" | "Female";

// const Players = () => {
//   const { players, playersLoading, playersError } = usePlayers();

//   const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
//   const [selectedGenderFilter, setSelectedGenderFilter] =
//     useState<SelectedGenderType>("Male");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [positionFilter, setPositionFilter] = useState("");
//   const [posMenuOpen, setPosMenuOpen] = useState(false);

//   const searchRef = useRef<HTMLInputElement | null>(null);

//   // Keyboard shortcut to focus search with " / "
//   useEffect(() => {
//     const onKey = (e: KeyboardEvent) => {
//       if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
//         e.preventDefault();
//         searchRef.current?.focus();
//       }
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, []);

//   const allPlayers = useMemo(() => players || [], [players]);

//   const menCount = useMemo(
//     () => allPlayers.filter((p) => p.gender === "Male").length,
//     [allPlayers]
//   );
//   const womenCount = useMemo(
//     () => allPlayers.filter((p) => p.gender === "Female").length,
//     [allPlayers]
//   );

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
//     const all: Player[] = players || [];
//     return all
//       .filter((player) => player.gender === selectedGenderFilter)
//       .filter((player) => {
//         const query = searchQuery.toLowerCase().trim();
//         const matchesName = player.name.toLowerCase().includes(query);
//         const matchesNumber = player.number.toString().includes(query);
//         const matchesPosition = positionFilter
//           ? player.position.toLowerCase().includes(positionFilter.toLowerCase())
//           : true;
//         return (
//           (matchesName || matchesNumber || query === "") && matchesPosition
//         );
//       })
//       .sort((a, b) => a.number - b.number);
//   }, [players, selectedGenderFilter, searchQuery, positionFilter]);

//   const clearFilters = () => {
//     setSearchQuery("");
//     setPositionFilter("");
//   };

//   if (playersLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <ClipLoader
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
//         <h1 className="text-5xl font-extrabold text-[#003b75] mb-10">
//           Our Team
//         </h1>
//         <p className="text-gray-700">No players found.</p>
//         <PlayersCard players={[]} />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen p-6 md:p-10 relative">
//       <h1 className="text-5xl font-extrabold text-[#003b75] mb-8 text-center">
//         Our Team
//       </h1>

//       <div className="max-w-screen-xl mx-auto space-y-4">
//         {/* Sticky, elevated filter bar */}
//         <div className="sticky top-0 z-20">
//           <div className="backdrop-blur bg-[#003b75] border border-gray-200 rounded-2xl shadow-sm p-3 md:p-4">
//             <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
//               {/* Gender segmented control */}
//               <div className="inline-flex rounded-xl border border-gray-200 bg-gray-100 p-1">
//                 {(["Male", "Female"] as SelectedGenderType[]).map((g) => {
//                   const isActive = selectedGenderFilter === g;
//                   const count = g === "Male" ? menCount : womenCount;
//                   return (
//                     <button
//                       key={g}
//                       onClick={() => setSelectedGenderFilter(g)}
//                       className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#003b75] focus-visible:ring-offset-2 ${
//                         isActive
//                           ? "bg-white text-[#003b75] shadow"
//                           : "text-gray-700 hover:text-black"
//                       }`}
//                       aria-pressed={isActive}
//                     >
//                       <span className="mr-2">
//                         {g === "Male" ? "Men" : "Women"}
//                       </span>
//                       <span
//                         className={`inline-flex items-center justify-center text-[11px] leading-none font-semibold rounded-full px-2 py-1 ${
//                           isActive
//                             ? "bg-[#003b75] text-white"
//                             : "bg-white text-gray-700"
//                         }`}
//                         aria-label={`${count} players`}
//                         title={`${count} players`}
//                       >
//                         {count}
//                       </span>
//                     </button>
//                   );
//                 })}
//               </div>

//               {/* Search */}
//               <div className="flex-1">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                   <input
//                     ref={searchRef}
//                     type="text"
//                     placeholder="Search player name or number"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#003b75] focus:border-transparent"
//                   />
//                   {searchQuery && (
//                     <button
//                       onClick={() => setSearchQuery("")}
//                       className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-gray-100"
//                       aria-label="Clear search"
//                     >
//                       <X className="h-4 w-4 text-gray-500" />
//                     </button>
//                   )}
//                 </div>
//               </div>

//               {/* Position dropdown (custom) */}
//               <div className="relative">
//                 <button
//                   onClick={() => setPosMenuOpen((s) => !s)}
//                   className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-sm"
//                   aria-haspopup="listbox"
//                   aria-expanded={posMenuOpen}
//                 >
//                   <Filter className="h-4 w-4 text-[#003b75]" />
//                   <span className="hidden sm:inline text-[#003b75]">
//                     Position
//                   </span>
//                   {positionFilter ? (
//                     <span className="text-[#003b75] font-semibold">
//                       {positionFilter}
//                     </span>
//                   ) : (
//                     <span className="text-gray-500">All Positions</span>
//                   )}
//                   <ChevronDown className="h-4 w-4" />
//                 </button>

//                 {posMenuOpen && (
//                   <div
//                     className="absolute right-0 mt-2 w-56 max-h-72 overflow-auto rounded-xl border border-gray-200 bg-white shadow-lg z-30"
//                     role="listbox"
//                     tabIndex={-1}
//                   >
//                     <button
//                       className={`w-full text-left px-3 py-2.5 text-[#003b75] text-sm hover:bg-gray-50 ${
//                         positionFilter === "" ? "bg-gray-50" : ""
//                       }`}
//                       onClick={() => {
//                         setPositionFilter("");
//                         setPosMenuOpen(false);
//                       }}
//                     >
//                       All Positions
//                     </button>
//                     <div className="my-1 border-t" />
//                     {positionOptions.map((pos) => (
//                       <button
//                         key={pos}
//                         className={`w-full text-left px-3 text-[#003b75] py-2.5 text-sm hover:bg-gray-50 ${
//                           positionFilter === pos
//                             ? "bg-gray-50 text-[#003b75] font-semibold"
//                             : ""
//                         }`}
//                         onClick={() => {
//                           setPositionFilter(pos);
//                           setPosMenuOpen(false);
//                         }}
//                       >
//                         {pos}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Clear filters */}
//               <div className="flex gap-2">
//                 <button
//                   onClick={clearFilters}
//                   className="px-4 py-2.5 rounded-xl border text-[#003b75] border-gray-200 bg-white hover:bg-gray-50 text-sm"
//                 >
//                   Clear
//                 </button>
//               </div>
//             </div>

//             {/* Active pills */}
//             {(searchQuery || positionFilter) && (
//               <div className="mt-3 flex flex-wrap items-center gap-2">
//                 {searchQuery && (
//                   <span className="inline-flex items-center gap-1.5 text-xs bg-gray-100 border border-gray-200 text-gray-700 rounded-full px-2.5 py-1">
//                     <Search className="h-3.5 w-3.5" />“{searchQuery}”
//                     <button
//                       onClick={() => setSearchQuery("")}
//                       className="ml-1 rounded-full p-0.5 hover:bg-gray-200"
//                       aria-label="Remove search"
//                     >
//                       <X className="h-3 w-3" />
//                     </button>
//                   </span>
//                 )}
//                 {positionFilter && (
//                   <span className="inline-flex items-center gap-1.5 text-xs bg-gray-100 border border-gray-200 text-gray-700 rounded-full px-2.5 py-1">
//                     {positionFilter}
//                     <button
//                       onClick={() => setPositionFilter("")}
//                       className="ml-1 rounded-full p-0.5 hover:bg-gray-200"
//                       aria-label="Remove position filter"
//                     >
//                       <X className="h-3 w-3" />
//                     </button>
//                   </span>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Cards Grid */}
//         <PlayersCard players={filteredPlayers} />
//       </div>

//       {/* Player Modal */}
//       {selectedPlayer && (
//         <PlayerProfileModal
//           player={selectedPlayer}
//           onClose={() => setSelectedPlayer(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default Players;

import { useState, useMemo, useEffect, useRef } from "react";
import type { Player } from "../../types";
import usePlayers from "../../hooks/usePlayers";
import { PlayersCard } from "../../components";
import ClipLoader from "react-spinners/ClipLoader";
import { Search, X } from "lucide-react";

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
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <ClipLoader
          color="#003b75"
          loading={playersLoading}
          size={50}
          aria-label="Loading Spinner"
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
        <PlayersCard players={[]} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mx-auto">
      {/* HERO with big search */}
      <section className="relative rounded-t-xl isolate overflow-hidden bg-gradient-to-br from-[#001e3a] via-[#003b75] to-[#0a7abf]">
        <div
          className="absolute inset-0 opacity-10 bg-[url('/zinme.jpg')] bg-cover pointer-events-none"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto max-w-screen-xl px-6 py-12 md:py-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-sm">
            Our Team
          </h1>

          {/* Gender Tabs */}
          <div className="mt-6 inline-flex rounded-2xl bg-white/10 p-1 backdrop-blur border border-white/20">
            {["Male", "Female"].map((g) => {
              const isActive = selectedGender === g;
              const count = g === "Male" ? menCount : womenCount;
              return (
                <button
                  key={g}
                  onClick={() => setSelectedGender(g as SelectedGenderType)}
                  className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? "bg-white text-[#003b75] shadow"
                      : "text-white/90 hover:bg-white/10"
                  }`}
                  aria-pressed={isActive}
                >
                  <span className="mr-2">{g === "Male" ? "Men" : "Women"}</span>
                  <span
                    className={`inline-flex items-center justify-center text-[11px] leading-none font-semibold rounded-full px-2 py-1 ${
                      isActive
                        ? "bg-[#003b75] text-white"
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
                      ? "bg-white text-[#003b75] border-white shadow"
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

        {/* Wave divider */}
        <svg
          className="block w-full text-white pointer-events-none"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M0,64 C240,96 480,0 720,32 C960,64 1200,96 1440,32 L1440,80 L0,80 Z"
          />
        </svg>
      </section>

      {/* Content */}
      <div className="max-w-screen-xl mx-auto px-6 pb-12 mt-2">
        <PlayersCard players={filteredPlayers} />
      </div>
    </div>
  );
};

export default Players;
