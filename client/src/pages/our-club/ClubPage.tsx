import {
  Users,
  Target,
  Trophy,
  Rocket,
  HeartHandshake,
  ChevronRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router";
import { useGetAbout } from "../../hooks/useOurClub";
import Loader from "../../components/Loader";

// Local fallbacks if API fields are empty
const FALLBACK_STATS = [
  { label: "Founded", value: "2024" },
  { label: "Players", value: "25+" },
  { label: "Matches Played", value: "60+" },
  { label: "Community Events", value: "10+" },
];

const FALLBACK_MILESTONES = [
  {
    year: "2024",
    title: "Kickoff",
    desc: "A group of friends formed Zinme United and played our first local tournament.",
  },
  {
    year: "2024–2025",
    title: "Growing Together",
    desc: "Regular training, friendly matches, and building a supportive team culture.",
  },
  {
    year: "2025",
    title: "Community Focus",
    desc: "Charity matches and youth engagement activities with local partners.",
  },
];

const VALUES = [
  {
    icon: <Users className="h-6 w-6" aria-hidden="true" />,
    title: "Community First",
    desc: "We’re a family. Everyone is welcome, on and off the pitch.",
  },
  {
    icon: <Target className="h-6 w-6" aria-hidden="true" />,
    title: "Discipline",
    desc: "We train with purpose and play with respect and heart.",
  },
  {
    icon: <Trophy className="h-6 w-6" aria-hidden="true" />,
    title: "Compete & Improve",
    desc: "Results matter—but growth matters more. Every session counts.",
  },
];

const GOALS = [
  "Establish a consistent training ground and basic facilities.",
  "Launch a youth program to nurture the next generation.",
  "Join more competitive leagues & cups.",
  "Build sustainable partnerships with local sponsors.",
];

// Small helper to map stat labels to icons (optional visuals only; data flow unchanged)
const statIcon = (label: string) => {
  if (label.toLowerCase().includes("player"))
    return <Users className="h-4 w-4" />;
  if (label.toLowerCase().includes("match"))
    return <Trophy className="h-4 w-4" />;
  if (label.toLowerCase().includes("event"))
    return <HeartHandshake className="h-4 w-4" />;
  if (label.toLowerCase().includes("founded"))
    return <Sparkles className="h-4 w-4" />;
  return <Sparkles className="h-4 w-4" />;
};

export default function ClubPage() {
  const { data: club, isLoading, error } = useGetAbout();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader size={100} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center px-4">
        <div className="w-full max-w-md rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <p className="font-semibold">Error loading club data</p>
          <p className="mt-1 text-sm text-red-600/90">
            Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const stats = club?.stats?.length ? club.stats : FALLBACK_STATS;
  const milestones = club?.milestones?.length
    ? club.milestones
    : FALLBACK_MILESTONES;
  const goals = GOALS; // keep your flow

  return (
    <div className="font-inter">
      {/* Hero */}
      <section className="mt-4">
        <div className="relative mx-auto max-w-screen-xl overflow-hidden rounded-2xl">
          <div className="relative aspect-[4/3] min-h-[260px] sm:aspect-[16/9] lg:aspect-[21/9]">
            {/* Progressive image with lazy fallback */}
            <img
              src={club?.heroImageUrl || "/zinme.jpg"}
              alt={club?.title ? `${club.title} team` : "Zinme United team"}
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
              fetchPriority="high"
            />
            {/* Enhanced gradient for better text contrast */}
            <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_80%,rgba(0,0,0,0.55),rgba(0,0,0,0.75))]" />
            <div className="absolute inset-0 flex items-end p-3 sm:p-6 md:p-10">
              <div className="w-full">
                <div className="inline-block rounded-xl bg-black/30 px-3 py-2 backdrop-blur-[2px] ring-1 ring-white/10 sm:bg-transparent sm:px-0 sm:py-0 sm:ring-0">
                  <h1
                    className="break-words text-white font-extrabold leading-tight 
                      text-[clamp(1.25rem,6vw,2.5rem)]
                      sm:text-[clamp(1.75rem,5vw,3.25rem)]
                      md:text-[clamp(2rem,4vw,3.75rem)]"
                  >
                    {club?.title || "Zinme United"}
                  </h1>
                  {club?.description && (
                    <p className="mt-2 max-w-3xl text-sm text-gray-100/95 sm:text-base">
                      {club.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Corner badge */}
            {club?.subtitle && (
              <div className="absolute right-2 top-2 sm:right-4 sm:top-4">
                <span className="inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-[#003b75] shadow sm:text-xs">
                  {club.subtitle}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Intro + Stats */}
      <div className="mx-auto max-w-screen-xl py-8 sm:py-10 md:py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="px-0 sm:px-6 md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-[#003b75] text-white">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <h2 className="text-2xl font-bold text-[#003b75] sm:text-3xl">
                Who We Are
              </h2>
            </div>
            {club?.description && (
              <p className="mt-4 leading-relaxed text-gray-700">
                {club.description}
              </p>
            )}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                to="/activities"
                className="inline-flex items-center justify-center rounded-full bg-[#003b75] px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-blue-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                <span className="text-white">See Our Activities</span>
                <ChevronRight
                  color="white"
                  className="ml-1 h-4 w-4"
                  aria-hidden="true"
                />
              </Link>
              <Link
                to="https://www.facebook.com/zmutdfc"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-[#003b75]/30 bg-white px-4 py-2 text-sm font-medium text-[#003b75] transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#003b75]/40"
              >
                Get in Touch
              </Link>
            </div>
          </div>

          <div className="px-0 sm:px-0">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="group rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="mx-auto mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#003b75]/10 text-[#003b75]">
                    {statIcon(s.label)}
                  </div>
                  <div className="text-xl font-extrabold text-[#003b75] sm:text-2xl">
                    {s.value}
                  </div>
                  <div className="mt-1 text-[10px] font-medium uppercase tracking-wide text-gray-500 sm:text-xs">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <section className="rounded-xl bg-white">
        <div className="mx-auto max-w-screen-xl py-8 sm:px-6 sm:py-10 md:px-8 md:py-12">
          <h2 className="text-2xl font-bold text-[#003b75] sm:text-3xl">
            What We Stand For
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
              >
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#003b75]/10 text-[#003b75]">
                  {v.icon}
                </div>
                <h3 className="text-base font-semibold text-gray-900 sm:text-lg">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 sm:text-[15px]">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="mt-10 rounded-xl bg-gray-50 sm:mt-12">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12">
          <h2 className="text-2xl font-bold text-[#003b75] sm:text-3xl">
            Our Journey
          </h2>
          <ol className="relative mt-6 border-s border-gray-200">
            {milestones.map((m, i: number) => (
              <li key={`${m.title}-${i}`} className="ms-4 mb-8 sm:mb-10">
                <span className="absolute -left-[9px] flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#003b75] ring-2 ring-[#003b75]/25" />
                <h3 className="text-sm font-semibold text-[#003b75] sm:text-base">
                  {m.year} • {m.title}
                </h3>
                <p className="mt-1 text-sm text-gray-700 sm:text-base">
                  {m.desc}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Future Goals */}
      <section className="mt-10 rounded-xl bg-white sm:mt-12">
        <div className="mx-auto max-w-screen-xl py-8 sm:px-6 sm:py-10 md:px-8 md:py-12">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-[#003b75] sm:text-3xl">
                Looking Ahead
              </h2>
              <p className="mt-3 text-sm text-gray-700 sm:text-base">
                We don’t have a home stadium or full facilities yet—but we’re
                building towards it every week. Our vision is clear:
              </p>
              <ul className="mt-5 space-y-3">
                {goals.map((g: string) => (
                  <li key={g} className="flex items-start">
                    <CheckCircle2
                      className="mr-2 h-5 w-5 text-green-600"
                      aria-hidden="true"
                    />
                    <span className="text-sm text-gray-700 sm:text-base">
                      {g}
                    </span>
                  </li>
                ))}
              </ul>
              {club?.ctaText && (
                <Link
                  to="https://www.facebook.com/zmutdfc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center rounded-full bg-[#003b75] px-4 py-2 text-white shadow transition hover:bg-blue-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                >
                  <HeartHandshake
                    color="white"
                    className="mr-2 h-4 w-4"
                    aria-hidden="true"
                  />
                  <span className="text-white">{club.ctaText}</span>
                </Link>
              )}
            </div>

            {/* Illustration card */}
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-sm sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#003b75]/10 text-[#003b75]">
                    <Rocket className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Building for Tomorrow
                  </h3>
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-700 sm:text-base">
                We’re exploring training slots, shared pitches, and partnerships
                to secure a consistent training ground. If you’d like to help,
                we’d love to hear from you.
              </p>
              <img
                src={club?.heroImageUrl || "/zin-me.jpg"}
                alt="Future plans"
                className="mt-4 aspect-[16/9] w-full rounded-xl object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="mt-10 pb-10 sm:mt-12 sm:pb-12">
        <div className="mx-auto max-w-screen-xl rounded-2xl bg-[#003b75] px-4 py-6 text-white sm:px-8 sm:py-10">
          <div className="grid items-center gap-6 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <h3 className="text-xl font-bold sm:text-2xl">
                Join Us on the Journey
              </h3>
              <p className="mt-2 text-sm text-white/90 sm:text-base">
                Players, supporters, partners—everyone has a place at Zinme
                United. Let’s grow the game together.
              </p>
            </div>
            <div className="flex sm:justify-end">
              <Link
                to="https://www.facebook.com/zmutdfc"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#003b75] transition hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#003b75]/40 sm:px-5 sm:py-3"
              >
                Contact Us{" "}
                <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Contact Zinme United</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
