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
    return <Users className="h-5 w-5" />;
  if (label.toLowerCase().includes("match"))
    return <Trophy className="h-5 w-5" />;
  if (label.toLowerCase().includes("event"))
    return <HeartHandshake className="h-5 w-5" />;
  if (label.toLowerCase().includes("founded"))
    return <Sparkles className="h-5 w-5" />;
  return <Sparkles className="h-5 w-5" />;
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
      <section className="bg-white py-16">
        <AnimatedSection>
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid gap-10 md:grid-cols-3">
              <div className="md:col-span-2">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-1 block">
                  Our Story
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-primary">
                  Who We Are
                </h2>
                {club?.description && (
                  <p className="mt-4 text-base leading-relaxed text-text-muted">
                    {club.description}
                  </p>
                )}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link
                    to="/activities"
                    className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white shadow transition hover:bg-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
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
                    className="inline-flex items-center justify-center rounded-full border border-primary/30 bg-white px-5 py-2.5 text-sm font-medium text-primary transition hover:bg-surface-alt focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    Get in Touch
                  </Link>
                </div>
              </div>

              <div>
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((s) => (
                    <div
                      key={s.label}
                      className="group rounded-2xl bg-white p-5 text-center shadow-sm hover:shadow-xl transition-all duration-300 border border-primary/5"
                    >
                      <div className="mx-auto mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        {statIcon(s.label)}
                      </div>
                      <div className="text-2xl font-extrabold text-primary">
                        {s.value}
                      </div>
                      <div className="mt-1 text-xs font-medium uppercase tracking-wide text-text-muted">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Values */}
      <section className="bg-surface-alt py-16">
        <AnimatedSection>
          <div className="max-w-6xl mx-auto px-4">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-1 block">
              Our Principles
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary">
              What We Stand For
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {VALUES.map((v) => (
                <div
                  key={v.title}
                  className="rounded-2xl bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {v.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-text">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">
                    {v.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Timeline */}
      <section className="bg-white py-16">
        <AnimatedSection>
          <div className="max-w-6xl mx-auto px-4">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-1 block">
              Milestones
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary">
              Our Journey
            </h2>
            <ol className="relative mt-10 border-s-2 border-primary/20 ml-3">
              {milestones.map((m, i: number) => (
                <li key={`${m.title}-${i}`} className="ms-8 mb-12 last:mb-0">
                  <span className="absolute -left-[11px] flex h-6 w-6 items-center justify-center rounded-full border-[3px] border-white bg-primary ring-4 ring-primary/15" />
                  <h3 className="text-base font-bold text-primary">
                    {m.year} &middot; {m.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted sm:text-base">
                    {m.desc}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </AnimatedSection>
      </section>

      {/* Future Goals */}
      <section className="bg-surface-alt py-16">
        <AnimatedSection>
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-1 block">
                  Vision
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-primary">
                  Looking Ahead
                </h2>
                <p className="mt-4 text-base text-text-muted">
                  We don't have a home stadium or full facilities yet—but we're
                  building towards it every week. Our vision is clear:
                </p>
                <ul className="mt-6 space-y-4">
                  {goals.map((g: string) => (
                    <li key={g} className="flex items-start">
                      <CheckCircle2
                        className="mr-3 mt-0.5 h-5 w-5 shrink-0 text-green-600"
                        aria-hidden="true"
                      />
                      <span className="text-base text-text-muted">
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
                    className="mt-8 inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-white shadow transition hover:bg-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
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
              <div className="rounded-2xl bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Rocket className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-text">
                    Building for Tomorrow
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-text-muted sm:text-base">
                  We're exploring training slots, shared pitches, and partnerships
                  to secure a consistent training ground. If you'd like to help,
                  we'd love to hear from you.
                </p>
                <img
                  src={club?.heroImageUrl || "/zin-me.jpg"}
                  alt="Future plans"
                  className="mt-5 aspect-[16/9] w-full rounded-2xl object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* CTA band */}
      <section className="bg-white py-16">
        <AnimatedSection>
          <div className="max-w-6xl mx-auto px-4">
            <div className="rounded-2xl bg-primary px-6 py-10 text-white sm:px-10 sm:py-12">
              <div className="grid items-center gap-6 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <h3 className="text-2xl font-extrabold sm:text-3xl">
                    Join Us on the Journey
                  </h3>
                  <p className="mt-3 text-base text-white/90">
                    Players, supporters, partners—everyone has a place at Zinme
                    United. Let's grow the game together.
                  </p>
                </div>
                <div className="flex sm:justify-end">
                  <Link
                    to="https://www.facebook.com/zmutdfc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-primary transition hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    Contact Us{" "}
                    <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">Contact Zinme United</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
