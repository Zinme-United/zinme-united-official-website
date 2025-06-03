import React, { useState, useEffect } from "react";
import { Calendar, MapPin } from "lucide-react";
import type { Activity } from "../types";
import ClipLoader from "react-spinners/ClipLoader";

interface NextMatchBannerProps {
  nextMatch: Activity | undefined;
  isLoading: boolean;
  error: Error | null;
}

const NextMatchBanner: React.FC<NextMatchBannerProps> = ({
  nextMatch,
  isLoading,
  error,
}) => {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!nextMatch || !nextMatch.date || !nextMatch.time) return;

    const targetDateTime = new Date(
      `${nextMatch.date.split("T")[0]}T${nextMatch.time}`
    ).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDateTime - now;

      if (distance < 0) {
        clearInterval(interval);
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
    }, 1000);

    return () => clearInterval(interval);
  }, [nextMatch]);

  if (isLoading) {
    return (
      <div className="bg-[#003b75] text-white p-8 rounded-xl shadow-lg flex flex-col items-center justify-center min-h-[200px]">
        <ClipLoader color="#fff" loading={isLoading} size={40} />
        <p className="mt-4 text-lg">Loading next match...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-600 text-white p-8 rounded-xl shadow-lg text-center">
        <p className="text-xl font-bold">Error loading next match:</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  if (!nextMatch) {
    return (
      <div className="bg-gray-700 text-white p-8 rounded-xl shadow-lg text-center">
        <p className="text-xl font-bold">No upcoming match scheduled.</p>
        <p className="text-sm mt-2">Check back later for updates!</p>
      </div>
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
    .toUpperCase(); // E.g., "SAT, JUN 15, 2025"

  // Placeholder for your team's logo if not provided
  const defaultHomeLogo = "/zinme.jpg";
  // Placeholder for opponent's logo if not provided
  const defaultOpponentLogo = nextMatch.opponent
    ? `https://placehold.co/80x80/FFFFFF/003b75?text=${nextMatch.opponent
        .split(" ")[0]
        .toUpperCase()}`
    : "https://placehold.co/80x80/FFFFFF/003b75?text=OP";

  return (
    <section className="bg-[#003b75] text-white py-8 px-6 rounded-xl shadow-2xl text-center w-full my-12">
      <h2 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
        NEXT MATCH
      </h2>

      <div className="flex items-center justify-center space-x-4 mb-6">
        <Calendar size={28} className="text-blue-200" />
        <p className="text-2xl md:text-3xl font-bold">
          {formattedDate} | {nextMatch.time}
        </p>
      </div>

      <div className="flex items-center justify-center space-x-6 mb-8">
        <img
          src={nextMatch.homeTeamLogoUrl}
          alt="Home Team Logo"
          className="w-20 h-20 rounded-full object-cover border-4 border-blue-400 shadow-md"
          onError={(e) => {
            e.currentTarget.src = defaultHomeLogo;
          }}
        />
        <span className="text-4xl md:text-5xl font-extrabold text-blue-200">
          VS.
        </span>
        <img
          src={nextMatch.opponentTeamLogoUrl}
          alt={`${nextMatch.opponent || "Opponent"} Logo`}
          className="w-20 h-20 rounded-full object-cover border-4 border-blue-400 shadow-md"
          onError={(e) => {
            e.currentTarget.src = defaultOpponentLogo;
          }}
        />
      </div>

      <p className="text-3xl md:text-4xl font-bold mb-6">
        Zinme United VS. {nextMatch.opponent?.toUpperCase() || "OPPONENT TBD"}
      </p>

      <div className="flex items-center justify-center space-x-4 mb-8">
        <MapPin size={24} className="text-blue-200" />
        <p className="text-xl md:text-2xl font-medium">{nextMatch.location}</p>
      </div>

      {/* Countdown Timer */}
      <div className="bg-blue-800 p-4 md:p-6 rounded-lg shadow-inner inline-block w-full max-w-lg">
        <div className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-8 justify-items-center">
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-yellow-300">
              {countdown.days.toString().padStart(2, "0")}
            </span>
            <span className="text-xs sm:text-sm md:text-base font-medium">
              DAYS
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-yellow-300">
              {countdown.hours.toString().padStart(2, "0")}
            </span>
            <span className="text-xs sm:text-sm md:text-base font-medium">
              HOURS
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-yellow-300">
              {countdown.minutes.toString().padStart(2, "0")}
            </span>
            <span className="text-xs sm:text-sm md:text-base font-medium">
              MINUTES
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-yellow-300">
              {countdown.seconds.toString().padStart(2, "0")}
            </span>
            <span className="text-xs sm:text-sm md:text-base font-medium">
              SECONDS
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NextMatchBanner;
