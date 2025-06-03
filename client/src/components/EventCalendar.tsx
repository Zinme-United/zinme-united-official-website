import React from "react";
import { Calendar, ChevronLeft, ChevronRight, XCircle } from "lucide-react";
import ClipLoader from "react-spinners/ClipLoader";
import type { Activity } from "../types";

interface EventCalendarProps {
  activities: Activity[];
  currentMonth: Date;
  onNextMonth: () => void;
  onPrevMonth: () => void;
  isLoading: boolean;
  error: Error | null;
  onActivityClick: (activity: Activity) => void;
}

const EventCalendar: React.FC<EventCalendarProps> = ({
  activities,
  currentMonth,
  onNextMonth,
  onPrevMonth,
  isLoading,
  error,
  onActivityClick,
}) => {
  const getMonthName = (date: Date) =>
    date.toLocaleString("default", { month: "long", year: "numeric" });

  if (isLoading) {
    return (
      <section className="my-12 bg-white rounded-xl shadow-lg p-6 md:p-8 flex flex-col items-center justify-center min-h-[300px]">
        <ClipLoader
          color="#003b75"
          loading={isLoading}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
        <p className="text-xl font-semibold text-gray-700 mt-4">
          Loading calendar events...
        </p>
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
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onPrevMonth}
          className="p-2 rounded-full cursor-pointer text-[#003b75] hover:bg-blue-200 transition-colors duration-200"
          aria-label="Previous Month"
        >
          <ChevronLeft size={24} />
        </button>
        <h3 className="text-2xl font-semibold text-[#003b75]">
          {getMonthName(currentMonth)}
        </h3>
        <button
          onClick={onNextMonth}
          className="p-2 rounded-full cursor-pointer text-[#003b75] hover:bg-blue-200 transition-colors duration-200"
          aria-label="Next Month"
        >
          <ChevronRight size={24} />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div
              key={activity._id}
              className="bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow duration-200"
              onClick={() => onActivityClick(activity)}
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
    </section>
  );
};

export default EventCalendar;
