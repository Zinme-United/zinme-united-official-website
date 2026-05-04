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
import PageHero from "../../components/PageHero";
import AnimatedSection from "../../components/AnimatedSection";

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
    desc: "We're a family. Everyone is welcome, on and off the pitch.",
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
    <div>
      <PageHero
        title="About"
        breadcrumbs={[{ label: "Home", path: "/" }, { label: "About" }]}
      />

      {/* Intro + Stats */}
      <AnimatedSection>
        <div className="max-w-[var(--container-content)] mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="px-0 sm:px-6 md:col-span-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-primary text-white">
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
                <h2 className="text-2xl font-bold text-primary sm:text-3xl">
                  Who We Are
                </h2>
              </div>
              {club?.description && (
                <p className="mt-4 leading-relaxed text-text-muted">
                  {club.description}
                </p>
              )}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  to="/activities"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                >
                  <span className="text-white">See Our Activities</span>
                  <ChevronRight
                    className="ml-1 h-4 w-4 text-white"
                    aria-hidden="true"
                  />
                </Link>
                <Link
                  to="https://www.facebook.com/zmutdfc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-primary/30 bg-surface px-4 py-2 text-sm font-medium text-primary transition hover:bg-surface-alt focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
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
                    className="group rounded-xl border border-primary/10 bg-surface p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="mx-auto mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      {statIcon(s.label)}
                    </div>
                    <div className="text-xl font-extrabold text-primary sm:text-2xl">
                      {s.value}
                    </div>
                    <div className="mt-1 text-[10px] font-medium uppercase tracking-wide text-text-muted sm:text-xs">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Values */}
      <AnimatedSection>
        <section className="rounded-xl bg-surface">
          <div className="mx-auto max-w-[var(--container-content)] py-8 sm:px-6 sm:py-10 md:px-8 md:py-12">
            <h2 className="text-2xl font-bold text-primary sm:text-3xl">
              What We Stand For
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {VALUES.map((v) => (
                <div
                  key={v.title}
                  className="rounded-2xl border border-primary/10 bg-surface p-5 shadow-sm transition hover:shadow-md sm:p-6"
                >
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {v.icon}
                  </div>
                  <h3 className="text-base font-semibold text-text sm:text-lg">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-sm text-text-muted sm:text-[15px]">
                    {v.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Timeline */}
      <AnimatedSection>
        <section className="mt-10 rounded-xl bg-surface-alt sm:mt-12">
          <div className="mx-auto max-w-[var(--container-content)] px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12">
            <h2 className="text-2xl font-bold text-primary sm:text-3xl">
              Our Journey
            </h2>
            <ol className="relative mt-6 border-s border-primary/10">
              {milestones.map((m, i: number) => (
                <li key={`${m.title}-${i}`} className="ms-4 mb-8 sm:mb-10">
                  <span className="absolute -left-[9px] flex h-5 w-5 items-center justify-center rounded-full border-2 border-surface bg-primary ring-2 ring-primary/25" />
                  <h3 className="text-sm font-semibold text-primary sm:text-base">
                    {m.year} • {m.title}
                  </h3>
                  <p className="mt-1 text-sm text-text-muted sm:text-base">
                    {m.desc}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </AnimatedSection>

      {/* Future Goals */}
      <AnimatedSection>
        <section className="mt-10 rounded-xl bg-surface sm:mt-12">
          <div className="mx-auto max-w-[var(--container-content)] py-8 sm:px-6 sm:py-10 md:px-8 md:py-12">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h2 className="text-2xl font-bold text-primary sm:text-3xl">
                  Looking Ahead
                </h2>
                <p className="mt-3 text-sm text-text-muted sm:text-base">
                  We don't have a home stadium or full facilities yet—but we're
                  building towards it every week. Our vision is clear:
                </p>
                <ul className="mt-5 space-y-3">
                  {goals.map((g: string) => (
                    <li key={g} className="flex items-start">
                      <CheckCircle2
                        className="mr-2 h-5 w-5 text-green-600"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-text-muted sm:text-base">
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
                    className="mt-6 inline-flex items-center rounded-full bg-primary px-4 py-2 text-white shadow transition hover:bg-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                  >
                    <HeartHandshake
                      className="mr-2 h-4 w-4 text-white"
                      aria-hidden="true"
                    />
                    <span className="text-white">{club.ctaText}</span>
                  </Link>
                )}
              </div>

              {/* Illustration card */}
              <div className="rounded-2xl border border-primary/10 bg-surface-alt p-4 shadow-sm sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Rocket className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-semibold text-text">
                      Building for Tomorrow
                    </h3>
                  </div>
                </div>
                <p className="mt-3 text-sm text-text-muted sm:text-base">
                  We're exploring training slots, shared pitches, and partnerships
                  to secure a consistent training ground. If you'd like to help,
                  we'd love to hear from you.
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
      </AnimatedSection>

      {/* CTA band */}
      <AnimatedSection>
        <section className="mt-10 pb-10 sm:mt-12 sm:pb-12">
          <div className="mx-auto max-w-[var(--container-content)] rounded-2xl bg-primary px-4 py-6 text-white sm:px-8 sm:py-10">
            <div className="grid items-center gap-6 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <h3 className="text-xl font-bold sm:text-2xl">
                  Join Us on the Journey
                </h3>
                <p className="mt-2 text-sm text-white/90 sm:text-base">
                  Players, supporters, partners—everyone has a place at Zinme
                  United. Let's grow the game together.
                </p>
              </div>
              <div className="flex sm:justify-end">
                <Link
                  to="https://www.facebook.com/zmutdfc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:px-5 sm:py-3"
                >
                  Contact Us{" "}
                  <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Contact Zinme United</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
}
