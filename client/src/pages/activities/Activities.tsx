import {
  Award,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Image,
  Trophy,
} from "lucide-react";
import { useState } from "react";

const Activities = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const events = [
    {
      id: 1,
      date: "2025-06-05",
      time: "10:00 AM",
      title: "Open Training Session",
      location: "Training Ground A",
      category: "Training",
    },
    {
      id: 2,
      date: "2025-06-12",
      time: "03:00 PM",
      title: "Fan Meet & Greet",
      location: "Club House",
      category: "Fan Meet-up",
    },
    {
      id: 3,
      date: "2025-06-18",
      time: "09:00 AM",
      title: "Youth Academy Tryouts",
      location: "Youth Pitch 1",
      category: "Youth Academy",
    },
    {
      id: 4,
      date: "2025-06-25",
      time: "02:00 PM",
      title: "Charity Match vs. Local Legends",
      location: "Main Stadium",
      category: "Community Event",
    },
    {
      id: 5,
      date: "2025-07-02",
      time: "11:00 AM",
      title: "Autograph Session",
      location: "Club Store",
      category: "Fan Meet-up",
    },
  ];

  const getMonthName = (date: Date) =>
    date.toLocaleString("default", { month: "long", year: "numeric" });

  const nextMonth = () => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + 1);
      return newMonth;
    });
  };

  const prevMonth = () => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() - 1);
      return newMonth;
    });
  };

  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getMonth() === currentMonth.getMonth() &&
      eventDate.getFullYear() === currentMonth.getFullYear()
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 font-inter p-6 md:p-10">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-10 text-center">
        Club Activities
      </h1>

      {/* Interactive Event Calendar */}
      <section className="my-12 bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Event Calendar
        </h2>
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={prevMonth}
            className="p-2 rounded-full text-[#003b75] hover:bg-blue-200 transition-colors duration-200"
          >
            <ChevronLeft size={24} />
          </button>
          <h3 className="text-2xl font-semibold text-gray-700">
            {getMonthName(currentMonth)}
          </h3>
          <button
            onClick={nextMonth}
            className="p-2 rounded-full text-[#003b75] hover:bg-blue-200 transition-colors duration-200"
          >
            <ChevronRight size={24} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-sm"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Calendar size={20} className="text-[#003b75]" />
                  <span className="font-semibold text-[#003b75]">
                    {event.date} at {event.time}
                  </span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-1">
                  {event.title}
                </h4>
                <p className="text-gray-700 text-sm mb-2">
                  Location: {event.location}
                </p>
                <span className="inline-block bg-blue-200 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {event.category}
                </span>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-600 text-lg">
              No events scheduled for this month.
            </p>
          )}
        </div>
      </section>

      {/* Photo & Video Galleries */}
      <section className="my-12 bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Galleries
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Training Sessions",
              img: "https://placehold.co/400x300/6B7280/FFFFFF?text=Training",
            },
            {
              title: "Community Outreach",
              img: "https://placehold.co/400x300/10B981/FFFFFF?text=Community",
            },
            {
              title: "Behind the Scenes",
              img: "https://placehold.co/400x300/EF4444/FFFFFF?text=BTS",
            },
            {
              title: "Fan Events",
              img: "https://placehold.co/400x300/3B82F6/FFFFFF?text=Fans",
            },
            {
              title: "Match Day Experience",
              img: "https://placehold.co/400x300/F97316/FFFFFF?text=Match+Day",
            },
            {
              title: "Youth Academy",
              img: "https://placehold.co/400x300/6366F1/FFFFFF?text=Youth",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.title}
                </h3>
                <button className="text-[#003b75] hover:text-[#003b75]">
                  <Image size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

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
    </div>
  );
};

export default Activities;
