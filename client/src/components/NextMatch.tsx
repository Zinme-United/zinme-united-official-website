import React, { useState, useEffect, useMemo } from "react";
import { Calendar, MapPin, Clock } from "lucide-react";
import type { Activity } from "../types";

interface NextMatchBannerProps {
  nextMatch: Activity | undefined;
  error: Error | null;
}

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

  const defaultHomeLogo = "/ZMUTD Official.png";
  const defaultOpponentLogo = useMemo(() => {
    const tag = nextMatch?.opponent?.trim()
      ? nextMatch.opponent.trim().split(/\s+/)[0].slice(0, 6).toUpperCase()
      : "OP";
    return `https://placehold.co/120x120/FFFFFF/003b75?text=${encodeURIComponent(
      tag
    )}`;
  }, [nextMatch?.opponent]);

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
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetDateTime]);

  if (error) {
    return (
      <section className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center mt-16 mb-8">
        <p className="text-lg font-bold">Error loading next match</p>
        <p className="text-sm mt-1">{error.message}</p>
      </section>
    );
  }

  if (!nextMatch) {
    return (
      <section className="bg-primary text-white p-8 rounded-2xl text-center mt-16 mb-8">
        <p className="text-xl font-bold">No upcoming match scheduled</p>
        <p className="text-sm opacity-80 mt-1">Check back later for updates!</p>
      </section>
    );
  }

  const matchDate = new Date(nextMatch.date);
  const formattedDate = matchDate
    .toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .toUpperCase();

  const homeLogoSrc = safeSrc(nextMatch.homeTeamLogoUrl) ?? defaultHomeLogo;
  const opponentLogoSrc =
    safeSrc(nextMatch.opponentTeamLogoUrl) ?? defaultOpponentLogo;

  return (
    <section className="relative overflow-hidden rounded-2xl mt-16 mb-8">
      {/* Background with pattern */}
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
        {/* Section label */}
        <div className="text-center mb-2">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-accent bg-white/10 px-4 py-1.5 rounded-full">
            Next Match
          </span>
        </div>

        {/* Date & Time */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-5 text-blue-100">
          <span className="inline-flex items-center text-base md:text-lg font-medium">
            <Calendar className="w-4 h-4 md:w-5 md:h-5 mr-2 opacity-70" />
            {formattedDate}
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
          {/* Home Team */}
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
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-5xl font-black text-accent drop-shadow-lg">
              VS
            </span>
          </div>

          {/* Opponent */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/20 p-3 flex items-center justify-center shadow-lg">
              <img
                loading="lazy"
                src={opponentLogoSrc}
                alt={`${nextMatch.opponent || "Opponent"}`}
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
    </section>
  );
};

export default NextMatchBanner;
