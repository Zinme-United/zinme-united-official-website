import {
  Users,
  Target,
  Trophy,
  Rocket,
  HeartHandshake,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router";

const stats = [
  { label: "Founded", value: "2024" },
  { label: "Players", value: "25+" },
  { label: "Matches Played", value: "60+" },
  { label: "Community Events", value: "10+" },
];

const milestones = [
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

const values = [
  {
    icon: <Users className="h-6 w-6" />,
    title: "Community First",
    desc: "We’re a family. Everyone is welcome, on and off the pitch.",
  },
  {
    icon: <Target className="h-6 w-6" />,
    title: "Discipline",
    desc: "We train with purpose and play with respect and heart.",
  },
  {
    icon: <Trophy className="h-6 w-6" />,
    title: "Compete & Improve",
    desc: "Results matter—but growth matters more. Every session counts.",
  },
];

const goals = [
  "Establish a consistent training ground and basic facilities.",
  "Launch a youth program to nurture the next generation.",
  "Join more competitive leagues & cups.",
  "Build sustainable partnerships with local sponsors.",
];

export default function ClubPage() {
  return (
    <div className="font-inter">
      {/* Hero */}
      <section className="mt-4">
        <div className="relative mx-auto max-w-screen-xl overflow-hidden rounded-2xl">
          <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] min-h-[260px]">
            <img
              src="/zinme.jpg" // replace with your banner
              alt="Zinme United team"
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/70" />
            <div className="absolute inset-0 flex items-end">
              <div className="w-full pb-5 sm:pb-7 md:pb-10">
                <div className="mx-4 sm:mx-8 md:mx-12">
                  <div className="inline-block sm:bg-transparent bg-black/35 backdrop-blur-[2px] rounded-lg px-2 py-1 sm:px-0 sm:py-0">
                    <h1
                      className="
                          text-white font-extrabold leading-tight break-words
                          text-[clamp(1.5rem,7vw,2.25rem)]
                          sm:text-[clamp(1.75rem,5vw,3rem)]
                          md:text-[clamp(2rem,4vw,3.5rem)]
                        "
                    >
                      About Zinme United
                    </h1>
                    <p className="mt-2 text-gray-200 max-w-3xl text-sm sm:text-base">
                      An amateur football team built on passion, teamwork, and
                      community—chasing big dreams together.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Corner badge */}
            <div className="absolute right-3 top-3 sm:right-4 sm:top-4">
              <span className="inline-flex items-center rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-[#003b75] shadow">
                One Team • One Dream
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Intro + Stats */}
      <section className="">
        <div className="mx-auto max-w-screen-xl py-10 sm:py-12">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#003b75]">
                Who We Are
              </h2>
              <p className="mt-4 text-gray-700 leading-relaxed">
                Zinme United is a community-driven amateur football club. We
                started as friends who love the game and grew into a family of
                players, supporters, and volunteers. We compete locally,
                organize community activities, and create space for players to
                develop—on and off the pitch.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/activities"
                  className="flex items-center rounded-full bg-[#003b75] px-4 py-2 shadow transition"
                >
                  <span className="text-white">See Our Activities</span>{" "}
                  <ChevronRight className="ml-1 h-4 w-4" color="white" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center rounded-full bg-white px-4 py-2 text-[#003b75] border border-[#003b75]/30 hover:bg-gray-50 transition"
                >
                  Get in Touch
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm"
                >
                  <div className="text-2xl font-extrabold text-[#003b75]">
                    {s.value}
                  </div>
                  <div className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white rounded-xl">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 md:px-8 py-10 sm:py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#003b75]">
            What We Stand For
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#003b75]/10 text-[#003b75]">
                  {v.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {v.title}
                </h3>
                <p className="mt-2 text-gray-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-gray-50 mt-12 rounded-xl">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 md:px-8 py-10 sm:py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#003b75]">
            Our Journey
          </h2>
          <ol className="mt-6 relative border-s border-gray-200">
            {milestones.map((m, i) => (
              <li key={i} className="mb-10 ms-4">
                <span className="absolute -left-[9px] flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#003b75] ring-2 ring-[#003b75]/25" />
                <h3 className="text-sm font-semibold text-[#003b75]">
                  {m.year} • {m.title}
                </h3>
                <p className="mt-1 text-gray-700">{m.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Future Goals */}
      <section className="bg-white mt-12 rounded-xl">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 md:px-8 py-10 sm:py-12">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#003b75]">
                Looking Ahead
              </h2>
              <p className="mt-3 text-gray-700">
                We don’t have a home stadium or full facilities yet—but we’re
                building towards it every week. Our vision is clear:
              </p>
              <ul className="mt-5 space-y-3">
                {goals.map((g) => (
                  <li key={g} className="flex items-start">
                    <CheckCircle2 className="mt-0.5 mr-2 h-5 w-5 text-green-600" />
                    <span className="text-gray-700">{g}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 inline-flex items-center rounded-full bg-[#003b75] px-4 py-2 text-white shadow hover:bg-blue-900 transition">
                <HeartHandshake className="mr-2 h-4 w-4" />
                Support or Sponsor Us
              </div>
            </div>

            {/* Illustration card */}
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#003b75]/10 text-[#003b75]">
                  <Rocket className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Building for Tomorrow
                </h3>
              </div>
              <p className="mt-3 text-gray-700">
                We’re exploring training slots, shared pitches, and partnerships
                to secure a consistent training ground. If you’d like to help,
                we’d love to hear from you.
              </p>
              <img
                src="/zin-me.jpg" // optional illustration/photo
                alt="Future plans"
                className="mt-4 w-full rounded-xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="mt-12 pb-12">
        <div className="mx-auto max-w-screen-xl rounded-2xl bg-[#003b75] px-6 py-8 sm:px-10 sm:py-10 text-white">
          <div className="grid items-center gap-6 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <h3 className="text-2xl font-bold">Join Us on the Journey</h3>
              <p className="mt-2 text-white/90">
                Players, supporters, partners—everyone has a place at Zinme
                United. Let’s grow the game together.
              </p>
            </div>
            <div className="flex sm:justify-end">
              <a
                href="/contact"
                className="inline-flex items-center rounded-full bg-white px-5 py-3 font-semibold text-[#003b75] hover:bg-blue-50 transition"
              >
                Contact Us <ChevronRight className="ml-1 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
