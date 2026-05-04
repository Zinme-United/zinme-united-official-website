import { Calendar, MapPin } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Link } from "react-router";
import type { Activity } from "../types";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

type HeroSectionProps = {
  nextMatch?: Activity | null;
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
    ctaHref: "/articles",
  },
  {
    image: "/zinme-group-photo.jpg",
    headline: "Matchday Experience",
    sub: "Feel the roar. Live the moment. Be part of the story.",
    ctaText: "Meet the Squad",
    ctaHref: "/players",
  },
  {
    image: "/zinme-training.jpg",
    headline: "Relentless Training",
    sub: "Commitment that defines champions.",
    ctaText: "Our Club",
    ctaHref: "/our-club",
  },
];

const HeroSection = ({
  nextMatch,
  slides = defaultSlides,
}: HeroSectionProps) => {
  return (
    <section className="relative">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        pagination={{ clickable: true }}
        navigation
        className="h-[500px] md:h-[700px]"
      >
        {slides.map((s, i) => (
          <SwiperSlide key={i}>
            <div
              className="relative h-[500px] md:h-[700px] bg-cover bg-center"
              style={{ backgroundImage: `url('${s.image}')` }}
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-black/40 to-transparent" />

              {/* Content */}
              <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-6">
                <div className="max-w-3xl">
                  <p className="text-sm md:text-base uppercase tracking-[0.3em] text-accent font-semibold mb-4">
                    Zinme United FC
                  </p>
                  <h1 className="text-5xl md:text-7xl font-extrabold leading-tight drop-shadow-lg mb-5">
                    {s.headline}
                  </h1>
                  <p className="text-lg md:text-xl mb-10 text-gray-200 max-w-xl mx-auto leading-relaxed">
                    {s.sub}
                  </p>
                  <Link
                    to={s.ctaHref}
                    className="inline-block bg-accent text-primary font-bold py-3 px-8 rounded-full text-base hover:bg-white hover:text-primary transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    {s.ctaText}
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Next Match floating banner */}
      {nextMatch && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2 z-20 w-[90%] max-w-3xl">
          <div className="bg-white rounded-2xl shadow-2xl px-6 py-5 flex flex-col md:flex-row items-center gap-5 border border-gray-100">
            {/* Logos + VS */}
            <div className="flex items-center gap-4">
              <img
                src={nextMatch.homeTeamLogoUrl || "/ZMUTD Official.png"}
                alt="Home Team"
                className="w-14 h-14 object-contain rounded-full bg-gray-50 p-1 shadow-sm"
              />
              <span className="text-lg font-extrabold text-primary tracking-wider">
                VS
              </span>
              <img
                src={nextMatch.opponentTeamLogoUrl || "/zinme.jpg"}
                alt={nextMatch.opponent || "Opponent"}
                className="w-14 h-14 object-contain rounded-full bg-gray-50 p-1 shadow-sm"
              />
            </div>

            {/* Match Info */}
            <div className="flex-1 text-center md:text-left">
              <p className="text-primary font-extrabold text-lg leading-tight">
                {nextMatch.title ||
                  (nextMatch.opponent
                    ? `vs ${nextMatch.opponent}`
                    : "Upcoming Fixture")}
              </p>
              <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-gray-500">
                {(nextMatch.date || nextMatch.time) && (
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={14} className="text-primary" />
                    {nextMatch.date
                      ? new Date(nextMatch.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })
                      : ""}
                    {nextMatch.time ? ` \u2022 ${nextMatch.time}` : ""}
                  </span>
                )}
                {nextMatch.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={14} className="text-primary" />
                    {nextMatch.location}
                  </span>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="hidden md:block">
              <span className="inline-block bg-primary text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full">
                Matchday
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
