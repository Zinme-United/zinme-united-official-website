import React, { Fragment, useMemo, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Search,
  Star,
  X,
} from "lucide-react";
import type { Activity } from "../types";

interface EventCalendarProps {
  activities: Activity[];
  currentMonth: Date;
  onNextMonth: () => void;
  onPrevMonth: () => void;
}

type TypeFilter = "all" | "match" | "training" | "other";

const EventCalendar: React.FC<EventCalendarProps> = ({
  activities,
  currentMonth,
  onNextMonth,
  onPrevMonth,
}) => {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [query, setQuery] = useState("");

  const getMonthName = (date: Date) =>
    date.toLocaleString("default", { month: "long", year: "numeric" });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return activities.filter((a) => {
      const typeOk =
        typeFilter === "all"
          ? true
          : a.type === typeFilter ||
            (typeFilter === "other" &&
              a.type !== "match" &&
              a.type !== "training");

      const featuredOk = featuredOnly ? !!a.isFeaturedEvent : true;

      const queryOk =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q) ||
        (a.opponent ? a.opponent.toLowerCase().includes(q) : false);

      return typeOk && featuredOk && queryOk;
    });
  }, [activities, typeFilter, featuredOnly, query]);

  const groupedByDay = useMemo(() => {
    const map = new Map<string, Activity[]>();
    for (const a of filtered) {
      const key = new Date(a.date).toISOString().slice(0, 10);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(a);
    }
    return Array.from(map.entries()).sort(
      (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()
    );
  }, [filtered]);

  return (
    <section className="my-6 sm:my-10 bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-3 sm:mb-4 text-center">
        Event Calendar
      </h2>

      {/* Controls: stack on mobile, row on md+ */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 justify-between mb-4 sm:mb-6">
        {/* Month Nav */}
        <div className="flex items-center justify-between md:justify-start gap-2">
          <button
            onClick={onPrevMonth}
            className="p-2 rounded-full text-primary hover:bg-blue-100 transition cursor-pointer"
            aria-label="Previous month"
          >
            <ChevronLeft size={22} />
          </button>
          <div className="text-lg sm:text-xl font-semibold text-primary text-center min-w-[180px]">
            {getMonthName(currentMonth)}
          </div>
          <button
            onClick={onNextMonth}
            className="p-2 rounded-full text-primary hover:bg-blue-100 transition cursor-pointer"
            aria-label="Next month"
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {/* Search (grows on wide screens) */}
        <div className="relative w-full md:w-auto md:min-w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events"
            className="w-full pl-9 pr-9 py-2 text-primary text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-gray-100 cursor-pointer"
              aria-label="Clear search"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* Filters: horizontal scroll on small screens */}
      <div className="relative -mx-4 sm:mx-0 px-4 sm:px-0 mb-4 sm:mb-6">
        <div className="flex gap-2 overflow-x-auto scrollbar-none py-1">
          {(["all", "match", "training", "other"] as const).map((t) => {
            const active = typeFilter === t;
            const label = t === "all" ? "All" : t[0].toUpperCase() + t.slice(1);
            return (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-full text-xs sm:text-sm border whitespace-nowrap transition cursor-pointer
                  ${
                    active
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                  }`}
                aria-pressed={active}
              >
                {label}
              </button>
            );
          })}
          <button
            onClick={() => setFeaturedOnly((v) => !v)}
            className={`px-3 py-1.5 rounded-full text-xs sm:text-sm border transition cursor-pointer inline-flex items-center gap-1 whitespace-nowrap
              ${
                featuredOnly
                  ? "bg-yellow-400/20 text-yellow-900 border-yellow-300"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
              }`}
            aria-pressed={featuredOnly}
          >
            <Star className="h-3.5 w-3.5" /> Featured
          </button>
        </div>
      </div>

      {/* Grouped by day */}
      {groupedByDay.length === 0 ? (
        <p className="text-center text-gray-600 py-8 sm:py-10">
          No activities match your filters.
        </p>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {groupedByDay.map(([day, items]) => {
            const d = new Date(day);
            return (
              <div
                key={day}
                className="bg-blue-50 rounded-xl border border-blue-100 p-3 sm:p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-white text-primary font-semibold text-xs sm:text-sm border border-blue-100">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {d.toLocaleDateString(undefined, {
                      weekday: "short",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Responsive card grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                  {items.map((a) => (
                    <button
                      key={a._id}
                      onClick={() => setSelectedActivity(a)}
                      className="text-left group bg-white border border-blue-100 rounded-lg p-3 sm:p-4 hover:shadow-md transition cursor-pointer"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="text-base sm:text-lg font-bold text-primary group-hover:underline">
                          {a.title}
                        </h4>
                        <span
                          className={`text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-full
                            ${
                              a.type === "match"
                                ? "bg-red-100 text-red-800"
                                : a.type === "training"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                        >
                          {a.type[0].toUpperCase() + a.type.slice(1)}
                        </span>
                      </div>

                      <div className="mt-2 text-xs sm:text-sm text-primary space-x-0 sm:space-x-3 space-y-1 sm:space-y-0">
                        <span className="inline-flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {a.time || "TBA"}
                        </span>
                        <span className="inline-flex items-center sm:ml-3">
                          <MapPin className="h-4 w-4 mr-1" />
                          {a.location}
                          {a.opponent ? ` • vs ${a.opponent}` : ""}
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {a.isNextMatch && (
                          <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-200 text-yellow-900">
                            Next Match
                          </span>
                        )}
                        {a.isFeaturedEvent && (
                          <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-200 text-purple-900">
                            Featured
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Transition appear show={!!selectedActivity} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setSelectedActivity(null)}
        >
          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
          </Transition.Child>

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-10 scale-95"
              enterTo="opacity-100 translate-y-0 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 scale-100"
              leaveTo="opacity-0 translate-y-10 scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-3xl bg-white rounded-2xl overflow-hidden shadow-2xl">
                {/* Hero Banner */}
                <div className="relative h-56 md:h-72 bg-primary">
                  <img
                    src="/zinme.jpg" // fallback stadium image
                    alt="Event Banner"
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/90" />

                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedActivity(null)}
                    className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 rounded-full p-2 cursor-pointer"
                  >
                    <X size={22} className="text-white" />
                  </button>

                  {/* Title + Date */}
                  <div className="absolute bottom-6 left-6 text-white">
                    <Dialog.Title className="text-3xl font-extrabold">
                      {selectedActivity?.title}
                    </Dialog.Title>
                    <p className="mt-2 text-lg text-blue-100">
                      {new Date(
                        selectedActivity?.date || ""
                      ).toLocaleDateString()}{" "}
                      • {selectedActivity?.time}
                    </p>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      📍 {selectedActivity?.location}
                    </span>
                    {selectedActivity?.opponent && (
                      <span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
                        ⚔️ vs {selectedActivity.opponent}
                      </span>
                    )}
                    {selectedActivity?.type && (
                      <span
                        className={`px-3 py-1 rounded-full text-sm capitalize ${
                          selectedActivity.type === "match"
                            ? "bg-red-200 text-red-800"
                            : selectedActivity.type === "training"
                            ? "bg-green-200 text-green-800"
                            : "bg-yellow-200 text-yellow-800"
                        }`}
                      >
                        {selectedActivity.type}
                      </span>
                    )}
                    {selectedActivity?.isNextMatch && (
                      <span className="px-3 py-1 rounded-full text-sm bg-yellow-300 text-yellow-900 font-semibold">
                        ⭐ Next Match
                      </span>
                    )}
                    {selectedActivity?.isFeaturedEvent && (
                      <span className="px-3 py-1 rounded-full text-sm bg-purple-300 text-purple-900 font-semibold">
                        🎉 Featured Event
                      </span>
                    )}
                  </div>

                  {/* Result */}
                  {selectedActivity?.result && (
                    <p className="text-lg font-bold text-primary">
                      ✅ Result: {selectedActivity.result}
                    </p>
                  )}

                  {/* Description */}
                  <p className="text-gray-700 leading-relaxed">
                    {selectedActivity?.description ||
                      "Stay tuned for more details about this event."}
                  </p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </section>
  );
};

export default EventCalendar;
