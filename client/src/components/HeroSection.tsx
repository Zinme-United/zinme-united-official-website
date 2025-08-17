import { Calendar, MapPin } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Button from "./Button";
import type { Activity } from "../types";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

type HeroSectionProps = {
  /** Optional: pass the next match Activity to show the overlay card */
  nextMatch?: Activity | null;
  /** Optional: override slides (fallbacks included) */
  slides?: Array<{
    image: string;
    headline: string;
    sub: string;
    ctaText: string;
    ctaHref: string;
  }>;
};

const defaultSlides = [
  {
    image: "/zinme.jpg",
    headline: "Unleash the Passion",
    sub: "Join us for triumphs, dedication, and unforgettable moments.",
    ctaText: "Latest News",
    ctaHref: "#news",
  },
  {
    image: "/zinme-group-photo.jpg",
    headline: "Matchday Experience",
    sub: "Feel the roar. Live the moment. Be part of the story.",
    ctaText: "I have no idea:)",
    ctaHref: "#tickets",
  },
  {
    image: "/zinme-training.jpg",
    headline: "Relentless Training",
    sub: "Commitment that defines champions.",
    ctaText: "Watch Highlights",
    ctaHref: "#highlights",
  },
];

const HeroSection = ({
  nextMatch,
  slides = defaultSlides,
}: HeroSectionProps) => {
  return (
    <section className="relative rounded-b-xl overflow-hidden">
      {/* Carousel */}
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        pagination={{ clickable: true }}
        navigation
        className="h-[460px] md:h-[640px]"
      >
        {slides.map((s, i) => (
          <SwiperSlide key={i}>
            <div
              className="relative h-[460px] md:h-[640px] bg-cover bg-center"
              style={{ backgroundImage: `url('${s.image}')` }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
              <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
                <div className="max-w-3xl">
                  <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow mb-4">
                    {s.headline}
                  </h1>
                  <p className="text-lg md:text-xl mb-8 text-gray-100">
                    {s.sub}
                  </p>
                  <a href={s.ctaHref}>
                    <Button
                      style={{ color: "white", backgroundColor: "#003b75" }}
                    >
                      {s.ctaText}
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Next Match overlay (uses Activity fields) */}
      {nextMatch && (
        <div className="pointer-events-none">
          <div className="absolute left-1/2 -translate-x-1/2 bottom-4 md:bottom-6 w-[92%] md:w-auto">
            <div className="pointer-events-auto mx-auto md:mx-0 md:ml-6 bg-white/95 backdrop-blur rounded-2xl shadow-2xl px-6 py-5 flex flex-col md:flex-row items-center gap-6 border border-white">
              {/* Logos + VS */}
              <div className="flex items-center gap-4">
                <img
                  src={nextMatch.homeTeamLogoUrl || "/default-logo.png"}
                  alt="Home Team"
                  className="w-14 h-14 object-contain bg-white rounded-full p-1"
                />
                <span className="text-xl font-bold text-gray-700">vs</span>
                <img
                  src={nextMatch.opponentTeamLogoUrl || "/default-logo.png"}
                  alt={nextMatch.opponent || "Opponent"}
                  className="w-14 h-14 object-contain bg-white rounded-full p-1"
                />
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <p className="text-[#003b75] font-extrabold text-lg md:text-xl leading-tight">
                  {nextMatch.title ||
                    (nextMatch.opponent
                      ? `vs ${nextMatch.opponent}`
                      : "Upcoming Fixture")}
                </p>
                <div className="mt-1 flex flex-col gap-3 text-sm text-gray-700">
                  {(nextMatch.date || nextMatch.time) && (
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={16} />
                      {nextMatch.date
                        ? new Date(nextMatch.date).toLocaleDateString()
                        : ""}
                      {nextMatch.time ? ` • ${nextMatch.time}` : ""}
                    </span>
                  )}
                  {nextMatch.location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={16} /> {nextMatch.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
