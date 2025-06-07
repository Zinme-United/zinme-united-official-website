import { Award, Trophy, X, XCircle } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityDetailsModal,
  EventCalendar,
  GalleriesCard,
} from "../../components";
import useGalleries from "../../hooks/useGalleries";
import type { Activity, Gallery } from "../../types";
import ClipLoader from "react-spinners/ClipLoader";
import useActivities from "../../hooks/useActivities";

const Activities = () => {
  const { galleries, galleriesLoading, galleriesError } = useGalleries();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
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

  const handleGalleryClick = useCallback((gallery: Gallery) => {
    setSelectedGallery(gallery);
  }, []);

  const handleCloseGalleryModal = useCallback(() => {
    setSelectedGallery(null);
  }, []);

  const handleActivityClick = useCallback((activity: Activity) => {
    setSelectedActivityForDetails(activity);
  }, []);

  const handleCloseActivityDetailsModal = useCallback(() => {
    setSelectedActivityForDetails(null);
  }, []);

  if (galleriesLoading || activitiesLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <ClipLoader
          color="#003b75"
          loading={galleriesLoading || activitiesLoading}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
        <p className="text-xl font-semibold text-gray-700 mt-4">
          Loading activities and galleries...
        </p>
      </div>
    );
  }

  if (galleriesError || activitiesError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100 border border-red-400 text-red-700 p-6 rounded-lg shadow-md">
        <XCircle className="h-6 w-6 mr-2" />
        <p className="text-xl font-semibold">
          Error loading data:{" "}
          {galleriesError?.message || activitiesError?.message}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-inter p-6 md:p-10">
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
        onActivityClick={handleActivityClick}
      />

      {/* Photo & Video Galleries */}
      <GalleriesCard
        galleries={galleries || []}
        onGalleryClick={handleGalleryClick}
      />
      {selectedGallery && (
        <div className="fixed inset-0 bg-[#003b75] bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 md:p-8 relative">
              <button
                onClick={handleCloseGalleryModal}
                className="absolute top-4 right-4 cursor-pointer bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-full p-2 transition-colors duration-200"
                aria-label="Close gallery details"
              >
                <X size={24} />
              </button>
              <h2 className="text-3xl font-bold text-[#003b75] mb-4 text-center">
                {selectedGallery.title}
              </h2>
              {selectedGallery.description && (
                <p className="text-[#003b75] text-center mb-4">
                  {selectedGallery.description}
                </p>
              )}
              {selectedGallery.eventDate && (
                <p className="text-[#003b75] text-center text-sm mb-6">
                  Event Date:{" "}
                  {new Date(selectedGallery.eventDate).toLocaleDateString()}
                </p>
              )}

              {selectedGallery.images.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedGallery.images.map((img, index) => (
                    <div key={img.url + index} className="relative">
                      <img
                        src={img.url}
                        alt={img.caption || `Gallery image ${index + 1}`}
                        className="w-full h-64 object-cover rounded-lg shadow-md"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-[#003b75] text-lg">
                  No images in this gallery.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

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
