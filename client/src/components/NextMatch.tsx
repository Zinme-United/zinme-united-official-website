import React, { useState, useEffect, useMemo } from "react";
import { Calendar, MapPin, Clock } from "lucide-react";
import type { Activity } from "../types";

interface NextMatchBannerProps {
  nextMatch: Activity | undefined;
  error: Error | null;
}

// Convert empty string -> undefined
const safeSrc = (s?: string | null) => (s && s.trim() ? s : undefined);

const NextMatchBanner: React.FC<NextMatchBannerProps> = ({
  nextMatch,
  error,
}) => {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Fallbacks
  const defaultHomeLogo = "/zinme.jpg";
  const defaultOpponentLogo = useMemo(() => {
    const tag = nextMatch?.opponent?.trim()
      ? nextMatch.opponent.trim().split(/\s+/)[0].slice(0, 6).toUpperCase()
      : "OP";
    return `https://placehold.co/120x120/FFFFFF/003b75?text=${encodeURIComponent(
      tag
    )}`;
  }, [nextMatch?.opponent]);

  // Build a safe target datetime if you have both date + time
  const targetDateTime = useMemo(() => {
    if (!nextMatch?.date) return null;
    const datePart = nextMatch.date.split("T")[0]; // yyyy-mm-dd
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
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setCountdown({ days, hours, minutes, seconds });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetDateTime]);

  if (error) {
    return (
      <section className="bg-red-600 text-white p-6 md:p-8 rounded-xl shadow-lg text-center my-8 md:my-12">
        <p className="text-xl font-bold">Error loading next match</p>
        <p className="text-sm opacity-90 mt-1">{error.message}</p>
      </section>
    );
  }

  if (!nextMatch) {
    return (
      <section className="bg-gray-800 text-white p-6 md:p-8 rounded-xl shadow-lg text-center my-8 md:my-12">
        <p className="text-xl font-bold">No upcoming match scheduled</p>
        <p className="text-sm opacity-90 mt-1">Check back later for updates!</p>
      </section>
    );
  }

  const matchDate = new Date(nextMatch.date);
  const formattedDate = matchDate
    .toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    .toUpperCase();

  const homeLogoSrc = safeSrc(nextMatch.homeTeamLogoUrl) ?? defaultHomeLogo;
  const opponentLogoSrc =
    safeSrc(nextMatch.opponentTeamLogoUrl) ?? defaultOpponentLogo;

  return (
    <section className="relative overflow-hidden rounded-2xl my-8 md:my-12">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#001e3a] via-[#003b75] to-[#0a7abf]" />
      <div
        className="absolute inset-0 opacity-15 bg-[url('/zinme.jpg')] bg-cover bg-center"
        aria-hidden="true"
      />
      <div className="relative z-10 text-white px-5 md:px-8 py-8 md:py-10">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold drop-shadow-sm tracking-tight">
            NEXT MATCH
          </h2>
        </div>

        {/* Date & Time */}
        <div className="mt-4 md:mt-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-blue-100">
          <span className="inline-flex items-center text-lg md:text-2xl font-semibold">
            <Calendar className="w-5 h-5 md:w-6 md:h-6 mr-2 opacity-90" />
            {formattedDate}
          </span>
          {nextMatch.time && (
            <>
              <span className="hidden sm:inline opacity-50">•</span>
              <span className="inline-flex items-center text-lg md:text-2xl font-semibold">
                <Clock className="w-5 h-5 md:w-6 md:h-6 mr-2 opacity-90" />
                {nextMatch.time}
              </span>
            </>
          )}
        </div>

        {/* Logos + VS */}
        <div className="mt-6 md:mt-8 flex items-center justify-center gap-5 md:gap-8">
          <img
            loading="lazy"
            src={homeLogoSrc}
            alt="Home Team Logo"
            className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-4 border-white/30 shadow"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = defaultHomeLogo;
            }}
          />
          <span className="text-3xl md:text-5xl font-extrabold text-blue-100 select-none">
            VS
          </span>
          <img
            loading="lazy"
            src={opponentLogoSrc}
            alt={`${nextMatch.opponent || "Opponent"} Logo`}
            className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-4 border-white/30 shadow"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = defaultOpponentLogo;
            }}
          />
        </div>

        {/* Teams line */}
        <p className="mt-4 md:mt-6 text-center text-2xl md:text-4xl font-extrabold tracking-wide">
          Zinme United{" "}
          {nextMatch.opponent ? `VS ${nextMatch.opponent}` : "— OPPONENT TBA —"}
        </p>

        {/* Location */}
        {nextMatch.location && (
          <div className="mt-3 md:mt-4 flex items-center justify-center gap-2 text-blue-100">
            <MapPin className="w-5 h-5 md:w-6 md:h-6" />
            <p className="text-lg md:text-2xl font-medium">
              {nextMatch.location}
            </p>
          </div>
        )}

        {/* Countdown */}
        <div className="mt-6 md:mt-8 flex justify-center">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-4 md:px-6 md:py-6 shadow-inner">
            <div className="grid grid-cols-4 gap-3 md:gap-6">
              {[
                { label: "DAYS", value: countdown.days },
                { label: "HOURS", value: countdown.hours },
                { label: "MINUTES", value: countdown.minutes },
                { label: "SECONDS", value: countdown.seconds },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center min-w-[60px]"
                >
                  <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-yellow-300 tabular-nums">
                    {String(item.value).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] sm:text-xs md:text-sm tracking-wider opacity-90">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NextMatchBanner;
