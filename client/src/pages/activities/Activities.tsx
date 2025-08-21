import { Award, Trophy, XCircle } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityDetailsModal,
  EventCalendar,
  GalleriesCard,
} from "../../components";
import useGalleries from "../../hooks/useGalleries";
import type { Activity } from "../../types";
import useActivities from "../../hooks/useActivities";
import Loader from "../../components/Loader";

const Activities = () => {
  const { galleries, galleriesLoading, galleriesError } = useGalleries();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedActivityForDetails, setSelectedActivityForDetails] =
    useState<Activity | null>(null);

  const { activities, activitiesLoading, activitiesError } = useActivities({
    params: {
      month: currentMonth.getMonth() + 1,
      year: currentMonth.getFullYear(),
    },
  });

  const nextMonth = useCallback(() => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + 1);
      return newMonth;
    });
  }, []);

  const prevMonth = useCallback(() => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() - 1);
      return newMonth;
    });
  }, []);

  const filteredActivitiesForDisplay = useMemo(() => {
    if (!activities) return [];
    return activities.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateA - dateB;
    });
  }, [activities]);

  const handleCloseActivityDetailsModal = useCallback(() => {
    setSelectedActivityForDetails(null);
  }, []);

  if (galleriesLoading || activitiesLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader size={100} />
      </div>
    );
  }

  if (galleriesError || activitiesError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white border border-red-400 text-red-700 p-6 rounded-lg shadow-md">
        <XCircle className="h-6 w-6 mr-2" />
        <p className="text-xl font-semibold">
          Error loading data:{" "}
          {galleriesError?.message || activitiesError?.message}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-inter p-6 md:p-10">
      <h1 className="text-5xl font-extrabold text-[#003b75] mb-10 text-center">
        Club Activities
      </h1>

      {/* Interactive Event Calendar */}
      <EventCalendar
        activities={filteredActivitiesForDisplay}
        currentMonth={currentMonth}
        onNextMonth={nextMonth}
        onPrevMonth={prevMonth}
        isLoading={activitiesLoading}
        error={activitiesError}
      />

      {/* Photo & Video Galleries */}
      <GalleriesCard galleries={galleries || []} />

      {/* Community & Outreach Section */}
      <section className="my-12 bg-blue-700 text-white rounded-xl shadow-lg p-6 md:p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Making a Difference in Our Community
        </h2>
        <p className="text-lg mb-6 max-w-3xl mx-auto">
          Our commitment extends beyond the pitch. Discover how our club
          actively engages in various community initiatives, from youth
          development programs to charity partnerships, making a positive impact
          where it matters most.
        </p>
        <button className="bg-white text-blue-700 hover:bg-blue-100 font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md">
          Learn More About Our Initiatives
        </button>
      </section>

      {/* Fan Engagement Activities */}
      <section className="my-12 bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Engage with Your Club!
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200 shadow-sm flex flex-col items-center text-center">
            <Award size={48} className="text-purple-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Fan Polls & Quizzes
            </h3>
            <p className="text-gray-700 mb-4">
              Cast your vote on match predictions, player of the month, and test
              your club knowledge!
            </p>
            <button className="bg-purple-600 text-white hover:bg-purple-700 py-2 px-6 rounded-full font-semibold transition-colors duration-300">
              Participate Now
            </button>
          </div>
          <div className="bg-green-50 p-6 rounded-lg border border-green-200 shadow-sm flex flex-col items-center text-center">
            <Trophy size={48} className="text-green-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Contests & Giveaways
            </h3>
            <p className="text-gray-700 mb-4">
              Enter for a chance to win signed jerseys, match tickets, and
              exclusive club experiences!
            </p>
            <button className="bg-green-600 text-white hover:bg-green-700 py-2 px-6 rounded-full font-semibold transition-colors duration-300">
              View Contests
            </button>
          </div>
        </div>
      </section>
      {selectedActivityForDetails && (
        <ActivityDetailsModal
          isOpen={!!selectedActivityForDetails}
          onClose={handleCloseActivityDetailsModal}
          activity={selectedActivityForDetails}
        />
      )}
    </div>
  );
};

export default Activities;
