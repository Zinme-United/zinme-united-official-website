import { useMemo } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { format } from "date-fns";
import { MapPin } from "lucide-react";
import useActivities from "../../hooks/useActivities";
import Loader from "../../components/Loader";
import PageHero from "../../components/PageHero";
import AnimatedSection from "../../components/AnimatedSection";
import type { Activity } from "../../types";

/* ---------- helpers ---------- */

const safeSrc = (s?: string | null) => (s && s.trim() ? s : undefined);

const defaultHomeLogo = "/ZMUTD Official.png";

const opponentPlaceholder = (name?: string) => {
  const tag = name?.trim()
    ? name.trim().split(/\s+/)[0].slice(0, 6).toUpperCase()
    : "OP";
  return `https://placehold.co/120x120/FFFFFF/003b75?text=${encodeURIComponent(tag)}`;
};

const resultBorderColor = (result?: string): string => {
  if (!result) return "border-l-gray-300";
  const match = result.match(/(\d+)\s*[-:]\s*(\d+)/);
  if (!match) return "border-l-gray-300";
  const home = parseInt(match[1], 10);
  const away = parseInt(match[2], 10);
  if (home > away) return "border-l-green-500";
  if (home < away) return "border-l-red-500";
  return "border-l-gray-400";
};

/* ---------- Sub-components ---------- */

function UpcomingMatchCard({ match }: { match: Activity }) {
  const homeLogoSrc = safeSrc(match.homeTeamLogoUrl) ?? defaultHomeLogo;
  const opponentLogoSrc =
    safeSrc(match.opponentTeamLogoUrl) ?? opponentPlaceholder(match.opponent);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 p-6 flex items-center gap-5">
      <div className="flex flex-col items-center flex-shrink-0">
        <img
          src={homeLogoSrc}
          alt="Home"
          className="w-14 h-14 object-contain"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = defaultHomeLogo;
          }}
        />
        <span className="text-xs font-bold text-primary mt-1.5 uppercase tracking-wide">
          Zinme
        </span>
      </div>
      <div className="flex-1 text-center">
        <p className="text-xs font-semibold text-accent uppercase tracking-wider">
          {format(new Date(match.date), "EEE, MMM d")}
          {match.time && ` - ${match.time}`}
        </p>
        <p className="text-2xl font-extrabold text-primary mt-1">VS</p>
        <p className="text-sm font-bold text-gray-700 mt-0.5">
          {match.opponent || "TBA"}
        </p>
        {match.location && (
          <p className="text-xs text-gray-500 mt-2 flex items-center justify-center gap-1">
            <MapPin size={12} /> {match.location}
          </p>
        )}
      </div>
      <div className="flex flex-col items-center flex-shrink-0">
        <img
          src={opponentLogoSrc}
          alt="Away"
          className="w-14 h-14 object-contain"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = opponentPlaceholder(match.opponent);
          }}
        />
        <span className="text-xs font-bold text-gray-500 mt-1.5 uppercase tracking-wide max-w-[60px] truncate text-center">
          {match.opponent?.split(/\s+/)[0] || "OPP"}
        </span>
      </div>
    </div>
  );
}

function ResultMatchCard({ match }: { match: Activity }) {
  const homeLogoSrc = safeSrc(match.homeTeamLogoUrl) ?? defaultHomeLogo;
  const opponentLogoSrc =
    safeSrc(match.opponentTeamLogoUrl) ?? opponentPlaceholder(match.opponent);

  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border-l-4 ${resultBorderColor(match.result)} p-6 flex items-center gap-5`}
    >
      <div className="flex flex-col items-center flex-shrink-0">
        <img
          src={homeLogoSrc}
          alt="Home"
          className="w-14 h-14 object-contain"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = defaultHomeLogo;
          }}
        />
        <span className="text-xs font-bold text-primary mt-1.5 uppercase tracking-wide">
          Zinme
        </span>
      </div>
      <div className="flex-1 text-center">
        <p className="text-3xl font-extrabold text-primary">
          {match.result || "---"}
        </p>
        <p className="text-sm font-bold text-gray-700 mt-1">
          vs {match.opponent || "Unknown"}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {format(new Date(match.date), "MMM d, yyyy")}
        </p>
        {match.location && (
          <p className="text-xs text-gray-500 mt-1.5 flex items-center justify-center gap-1">
            <MapPin size={12} /> {match.location}
          </p>
        )}
      </div>
      <div className="flex flex-col items-center flex-shrink-0">
        <img
          src={opponentLogoSrc}
          alt="Away"
          className="w-14 h-14 object-contain"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = opponentPlaceholder(match.opponent);
          }}
        />
        <span className="text-xs font-bold text-gray-500 mt-1.5 uppercase tracking-wide max-w-[60px] truncate text-center">
          {match.opponent?.split(/\s+/)[0] || "OPP"}
        </span>
      </div>
    </div>
  );
}

/* ---------- Main component ---------- */

const Activities = () => {
  const { activities, activitiesLoading, activitiesError } = useActivities({
    params: { type: "match" },
  });

  const upcoming = useMemo(
    () =>
      (activities || [])
        .filter((a) => !a.result && a.type === "match")
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        ),
    [activities]
  );

  const results = useMemo(
    () =>
      (activities || [])
        .filter((a) => a.result && a.type === "match")
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        ),
    [activities]
  );

  if (activitiesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <Loader size={80} />
      </div>
    );
  }

  if (activitiesError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface px-4">
        <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded-xl p-6">
          <p className="text-lg font-semibold">
            Error loading fixtures: {activitiesError?.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-surface">
      <PageHero
        title="Fixtures"
        breadcrumbs={[{ label: "Home", path: "/" }, { label: "Fixtures" }]}
      />

      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <AnimatedSection>
            {/* Section header */}
            <div className="text-center mb-10">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-1">
                Matchday
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-primary">
                Fixtures & Results
              </h2>
            </div>

            <TabGroup>
              <div className="flex justify-center mb-10">
                <TabList className="inline-flex rounded-2xl p-1 bg-gray-100 border border-gray-200">
                  <Tab
                    className={({ selected }) =>
                      `px-8 py-3 text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                        selected
                          ? "bg-primary text-white shadow-md"
                          : "bg-transparent text-gray-600 hover:text-primary hover:bg-gray-50"
                      }`
                    }
                  >
                    Upcoming ({upcoming.length})
                  </Tab>
                  <Tab
                    className={({ selected }) =>
                      `px-8 py-3 text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                        selected
                          ? "bg-primary text-white shadow-md"
                          : "bg-transparent text-gray-600 hover:text-primary hover:bg-gray-50"
                      }`
                    }
                  >
                    Results ({results.length})
                  </Tab>
                </TabList>
              </div>

              <TabPanels>
                <TabPanel>
                  <AnimatedSection>
                    {upcoming.length === 0 ? (
                      <p className="text-center text-gray-500 text-lg py-12">
                        No upcoming matches scheduled.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {upcoming.map((match) => (
                          <UpcomingMatchCard key={match._id} match={match} />
                        ))}
                      </div>
                    )}
                  </AnimatedSection>
                </TabPanel>

                <TabPanel>
                  <AnimatedSection>
                    {results.length === 0 ? (
                      <p className="text-center text-gray-500 text-lg py-12">
                        No results to display yet.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {results.map((match) => (
                          <ResultMatchCard key={match._id} match={match} />
                        ))}
                      </div>
                    )}
                  </AnimatedSection>
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
};

export default Activities;
