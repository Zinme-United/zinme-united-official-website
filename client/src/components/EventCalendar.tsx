import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Calendar, ChevronLeft, ChevronRight, XCircle, X } from "lucide-react";

import type { Activity } from "../types";
import Loader from "./Loader";

interface EventCalendarProps {
  activities: Activity[];
  currentMonth: Date;
  onNextMonth: () => void;
  onPrevMonth: () => void;
  isLoading: boolean;
  error: Error | null;
}

const EventCalendar: React.FC<EventCalendarProps> = ({
  activities,
  currentMonth,
  onNextMonth,
  onPrevMonth,
  isLoading,
  error,
}) => {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );

  const getMonthName = (date: Date) =>
    date.toLocaleString("default", { month: "long", year: "numeric" });

  if (isLoading) {
    return (
      <section className="my-12 bg-white rounded-xl shadow-lg p-6 md:p-8 flex flex-col items-center justify-center min-h-[300px]">
        <Loader size={100} />
      </section>
    );
  }

  if (error) {
    return (
      <section className="my-12 bg-red-100 border border-red-400 text-red-700 p-6 rounded-lg shadow-md flex items-center justify-center min-h-[300px]">
        <XCircle className="h-6 w-6 mr-2" />
        <p className="text-xl font-semibold">
          Error loading events: {error.message}
        </p>
      </section>
    );
  }

  return (
    <section className="my-12 bg-white rounded-xl shadow-lg p-6 md:p-8">
      <h2 className="text-3xl font-bold text-[#003b75] mb-6 text-center">
        Event Calendar
      </h2>

      {/* Month Navigation */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onPrevMonth}
          className="p-2 rounded-full text-[#003b75] hover:bg-blue-200 transition"
        >
          <ChevronLeft size={24} />
        </button>
        <h3 className="text-2xl font-semibold text-[#003b75]">
          {getMonthName(currentMonth)}
        </h3>
        <button
          onClick={onNextMonth}
          className="p-2 rounded-full text-[#003b75] hover:bg-blue-200 transition"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Activities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div
              key={activity._id}
              className="bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-sm cursor-pointer hover:shadow-md transition"
              onClick={() => setSelectedActivity(activity)}
            >
              <div className="flex items-center space-x-3 mb-2">
                <Calendar size={20} className="text-[#003b75]" />
                <span className="font-semibold text-[#003b75]">
                  {new Date(activity.date).toLocaleDateString()} at{" "}
                  {activity.time || "N/A"}
                </span>
              </div>
              <h4 className="text-xl font-bold text-[#003b75] mb-1">
                {activity.title}
              </h4>
              <p className="text-[#003b75] text-sm mb-2">
                Location: {activity.location}
                {activity.opponent && ` vs. ${activity.opponent}`}
              </p>
              {activity.result && (
                <p className="text-[#003b75] text-sm mb-2">
                  Result: {activity.result}
                </p>
              )}
              <span
                className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full
                ${
                  activity.type === "match"
                    ? "bg-red-200 text-red-800"
                    : activity.type === "training"
                    ? "bg-green-200 text-green-800"
                    : "bg-blue-200 text-blue-800"
                }`}
              >
                {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
              </span>
              {activity.isNextMatch && (
                <span className="ml-2 inline-block bg-yellow-200 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Next Match
                </span>
              )}
              {activity.isFeaturedEvent && (
                <span className="ml-2 inline-block bg-purple-200 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Featured Event
                </span>
              )}
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-600 text-lg">
            No activities scheduled for this month.
          </p>
        )}
      </div>

      {/* Modal for Activity Details */}
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
                <div className="relative h-56 md:h-72 bg-[#003b75]">
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
                    <p className="text-lg font-bold text-[#003b75]">
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
