import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router";
import { Calendar, MapPin, Clock, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import useActivities from "../hooks/useActivities";
import type { Activity } from "../types";

/* ---------- helpers ---------- */

const safeSrc = (s?: string | null) => (s && s.trim() ? s : undefined);

const defaultHomeLogo = "/ZMUTD Official.png";

const opponentPlaceholder = (name?: string) => {
  const tag = name?.trim()
    ? name.trim().split(/\s+/)[0].slice(0, 6).toUpperCase()
    : "OP";
  return `https://placehold.co/120x120/FFFFFF/003b75?text=${encodeURIComponent(tag)}`;
};

/**
 * Parse a result string like "3-1" and return a border color class.
 * first number = home, second = away.
 */
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

/* ---------- Countdown hook ---------- */

function useCountdown(nextMatch: Activity | undefined) {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const targetDateTime = useMemo(() => {
    if (!nextMatch?.date) return null;
    const datePart = nextMatch.date.split("T")[0];
    const timePart = nextMatch.time?.trim() || "00:00";
    const dt = new Date(`${datePart}T${timePart}`);
    return Number.isNaN(dt.getTime()) ? null : dt.getTime();
  }, [nextMatch?.date, nextMatch?.time]);

  useEffect(() => {
    if (!targetDateTime) return;
    const tick = () => {
      const now = Date.now();
      const distance = targetDateTime - now;
      if (distance <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetDateTime]);

  return countdown;
}

/* ---------- Sub-components ---------- */

function NextMatchCard({
  nextMatch,
  loading,
  error,
}: {
  nextMatch: Activity | undefined;
  loading: boolean;
  error: unknown;
}) {
  const countdown = useCountdown(nextMatch);

  const defaultOpponentLogo = useMemo(
    () => opponentPlaceholder(nextMatch?.opponent),
    [nextMatch?.opponent],
  );

  if (loading) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-primary-dark via-primary to-primary-light p-10 animate-pulse">
        <div className="h-6 w-32 bg-white/20 rounded mx-auto mb-6" />
        <div className="flex justify-center gap-12">
          <div className="w-20 h-20 rounded-full bg-white/10" />
          <div className="w-12 h-8 bg-white/10 rounded self-center" />
          <div className="w-20 h-20 rounded-full bg-white/10" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 border border-red-200 text-red-700 p-6 text-center">
        <p className="text-lg font-bold">Error loading next match</p>
        <p className="text-sm mt-1">
          {error instanceof Error ? error.message : "Something went wrong"}
        </p>
      </div>
    );
  }

  if (!nextMatch) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-primary-dark via-primary to-primary-light text-white p-8 text-center">
        <p className="text-xl font-bold">No upcoming match scheduled</p>
        <p className="text-sm opacity-80 mt-1">
          Check back later for updates!
        </p>
      </div>
    );
  }

  const homeLogoSrc = safeSrc(nextMatch.homeTeamLogoUrl) ?? defaultHomeLogo;
  const opponentLogoSrc =
    safeSrc(nextMatch.opponentTeamLogoUrl) ?? defaultOpponentLogo;

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-primary-light" />
      <div className="absolute inset-0 opacity-[0.04]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="relative z-10 text-white px-6 md:px-12 py-10 md:py-14">
        {/* Label */}
        <div className="text-center mb-2">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-accent bg-white/10 px-4 py-1.5 rounded-full">
            Next Match
          </span>
        </div>

        {/* Date & Time */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-5 text-blue-100">
          <span className="inline-flex items-center text-base md:text-lg font-medium">
            <Calendar className="w-4 h-4 md:w-5 md:h-5 mr-2 opacity-70" />
            {format(new Date(nextMatch.date), "EEEE, MMMM d, yyyy").toUpperCase()}
          </span>
          {nextMatch.time && (
            <>
              <span className="hidden sm:inline text-white/30">|</span>
              <span className="inline-flex items-center text-base md:text-lg font-medium">
                <Clock className="w-4 h-4 md:w-5 md:h-5 mr-2 opacity-70" />
                {nextMatch.time}
              </span>
            </>
          )}
        </div>

        {/* Teams matchup */}
        <div className="mt-8 md:mt-10 flex items-center justify-center gap-6 md:gap-12">
          {/* Home */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/20 p-3 flex items-center justify-center shadow-lg">
              <img
                loading="lazy"
                src={homeLogoSrc}
                alt="Zinme United"
                className="w-full h-full object-contain rounded-full"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = defaultHomeLogo;
                }}
              />
            </div>
            <span className="text-sm md:text-base font-bold uppercase tracking-wide">
              Zinme United
            </span>
          </div>

          {/* VS */}
          <span className="text-3xl md:text-5xl font-black text-accent drop-shadow-lg">
            VS
          </span>

          {/* Opponent */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/20 p-3 flex items-center justify-center shadow-lg">
              <img
                loading="lazy"
                src={opponentLogoSrc}
                alt={nextMatch.opponent || "Opponent"}
                className="w-full h-full object-contain rounded-full"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = defaultOpponentLogo;
                }}
              />
            </div>
            <span className="text-sm md:text-base font-bold uppercase tracking-wide">
              {nextMatch.opponent || "TBA"}
            </span>
          </div>
        </div>

        {/* Location */}
        {nextMatch.location && (
          <div className="mt-6 flex items-center justify-center gap-2 text-blue-200">
            <MapPin className="w-4 h-4" />
            <p className="text-sm md:text-base font-medium">
              {nextMatch.location}
            </p>
          </div>
        )}

        {/* Countdown */}
        <div className="mt-8 md:mt-10 flex justify-center">
          <div className="grid grid-cols-4 gap-3 md:gap-5">
            {[
              { label: "Days", value: countdown.days },
              { label: "Hours", value: countdown.hours },
              { label: "Mins", value: countdown.minutes },
              { label: "Secs", value: countdown.seconds },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl px-4 py-3 md:px-6 md:py-4 flex flex-col items-center min-w-[70px] md:min-w-[90px]"
              >
                <span className="text-3xl md:text-5xl font-black text-white tabular-nums leading-none">
                  {String(item.value).padStart(2, "0")}
                </span>
                <span className="text-[10px] md:text-xs uppercase tracking-widest text-blue-200 mt-1.5">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RecentResultCard({ activity }: { activity: Activity }) {
  const homeLogoSrc =
    safeSrc(activity.homeTeamLogoUrl) ?? defaultHomeLogo;
  const opponentLogoSrc =
    safeSrc(activity.opponentTeamLogoUrl) ??
    opponentPlaceholder(activity.opponent);
  const borderColor = resultBorderColor(activity.result);

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 border-l-4 ${borderColor} p-4 flex items-center gap-4`}
    >
      {/* Home logo */}
      <img
        src={homeLogoSrc}
        alt="Zinme United"
        className="w-10 h-10 object-contain flex-shrink-0"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = defaultHomeLogo;
        }}
      />

      {/* Score + date */}
      <div className="flex-1 text-center">
        <p className="text-lg font-extrabold text-primary">
          {activity.result || "—"}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          {format(new Date(activity.date), "MMM dd, yyyy")}
        </p>
      </div>

      {/* Opponent logo + name */}
      <div className="flex flex-col items-center flex-shrink-0">
        <img
          src={opponentLogoSrc}
          alt={activity.opponent || "Opponent"}
          className="w-10 h-10 object-contain"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = opponentPlaceholder(activity.opponent);
          }}
        />
        <span className="text-[10px] text-gray-500 mt-1 max-w-[60px] truncate text-center">
          {activity.opponent || "TBA"}
        </span>
      </div>
    </div>
  );
}

/* ---------- Main component ---------- */

const MatchesSection = () => {
  const {
    nextMatch,
    nextMatchLoading,
    nextMatchError,
  } = useActivities({ params: { isNextMatch: true }, enabled: true });

  const {
    activities: matchActivities,
    activitiesLoading: matchesLoading,
  } = useActivities({ params: { type: "match" }, enabled: true });

  const recentResults = useMemo(() => {
    if (!matchActivities) return [];
    return matchActivities
      .filter((m) => m.result)
      .sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      )
      .slice(0, 3);
  }, [matchActivities]);

  return (
    <section className="py-12 md:py-16">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-1">
            Matchday
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary">
            Fixtures &amp; Results
          </h2>
        </div>
        <Link
          to="/activities"
          className="hidden sm:flex items-center gap-1 text-sm font-semibold text-primary hover:text-accent transition-colors"
        >
          View all fixtures
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Next Match Card */}
      <NextMatchCard
        nextMatch={nextMatch}
        loading={nextMatchLoading}
        error={nextMatchError}
      />

      {/* Recent Results */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-primary mb-4">Recent Results</h3>
        {matchesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-100 p-4 h-20 animate-pulse"
              />
            ))}
          </div>
        ) : recentResults.length === 0 ? (
          <p className="text-gray-500 text-sm">No recent results</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentResults.map((activity) => (
              <RecentResultCard key={activity._id} activity={activity} />
            ))}
          </div>
        )}
      </div>

      {/* Mobile view-all link */}
      <div className="mt-6 sm:hidden text-center">
        <Link
          to="/activities"
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-accent transition-colors"
        >
          View all fixtures
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};

export default MatchesSection;
