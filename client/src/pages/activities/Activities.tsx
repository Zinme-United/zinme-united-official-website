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
    <div className="bg-surface rounded-[var(--radius-card)] shadow-card p-5 flex items-center gap-4">
      <img
        src={homeLogoSrc}
        alt="Home"
        className="w-12 h-12 object-contain"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = defaultHomeLogo;
        }}
      />
      <div className="flex-1 text-center">
        <p className="text-xs text-text-muted uppercase tracking-wider">
          {format(new Date(match.date), "EEE, MMM d")}
          {match.time && ` - ${match.time}`}
        </p>
        <p className="font-heading text-lg text-primary mt-1">
          Zinme United <span className="text-text-muted mx-2">vs</span>{" "}
          {match.opponent || "TBA"}
        </p>
        {match.location && (
          <p className="text-xs text-text-muted mt-1 flex items-center justify-center gap-1">
            <MapPin size={12} /> {match.location}
          </p>
        )}
      </div>
      <img
        src={opponentLogoSrc}
        alt="Away"
        className="w-12 h-12 object-contain"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = opponentPlaceholder(match.opponent);
        }}
      />
    </div>
  );
}

function ResultMatchCard({ match }: { match: Activity }) {
  const homeLogoSrc = safeSrc(match.homeTeamLogoUrl) ?? defaultHomeLogo;
  const opponentLogoSrc =
    safeSrc(match.opponentTeamLogoUrl) ?? opponentPlaceholder(match.opponent);

  return (
    <div
      className={`bg-surface rounded-[var(--radius-card)] shadow-card border-l-4 ${resultBorderColor(match.result)} p-5 flex items-center gap-4`}
    >
      <img
        src={homeLogoSrc}
        alt="Home"
        className="w-12 h-12 object-contain"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = defaultHomeLogo;
        }}
      />
      <div className="flex-1 text-center">
        <p className="font-heading text-2xl text-primary">
          {match.result || "---"}
        </p>
        <p className="text-xs text-text-muted mt-1">
          vs {match.opponent || "Unknown"} -{" "}
          {format(new Date(match.date), "MMM d, yyyy")}
        </p>
        {match.location && (
          <p className="text-xs text-text-muted mt-1 flex items-center justify-center gap-1">
            <MapPin size={12} /> {match.location}
          </p>
        )}
      </div>
      <img
        src={opponentLogoSrc}
        alt="Away"
        className="w-12 h-12 object-contain"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = opponentPlaceholder(match.opponent);
        }}
      />
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

      <section className="max-w-[var(--container-content)] mx-auto px-4 sm:px-6 py-8 md:py-12">
        <TabGroup>
          <div className="flex justify-center mb-8">
            <TabList className="inline-flex rounded-2xl bg-white/10 p-1 backdrop-blur-sm border border-primary/20 bg-primary-dark">
              <Tab
                className={({ selected }) =>
                  `px-6 py-2.5 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                    selected
                      ? "bg-white text-primary shadow"
                      : "text-white/80 hover:bg-white/10"
                  }`
                }
              >
                Upcoming ({upcoming.length})
              </Tab>
              <Tab
                className={({ selected }) =>
                  `px-6 py-2.5 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                    selected
                      ? "bg-white text-primary shadow"
                      : "text-white/80 hover:bg-white/10"
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
                  <p className="text-center text-text-muted text-lg py-12">
                    No upcoming matches scheduled.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <p className="text-center text-text-muted text-lg py-12">
                    No results to display yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.map((match) => (
                      <ResultMatchCard key={match._id} match={match} />
                    ))}
                  </div>
                )}
              </AnimatedSection>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </section>
    </main>
  );
};

export default Activities;
