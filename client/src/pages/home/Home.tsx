import { ChevronRight } from "lucide-react";
import HeroSection from "../../components/HeroSection";
import LatestNewsAndUpdates from "../../components/LatestNewsAndUpdates";
import NextMatch from "../../components/NextMatch";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 font-inter">
      {/* Hero Section */}
      <HeroSection />

      <div className="container mx-auto p-6 md:p-10">
        {/* Latest News & Updates */}
        <LatestNewsAndUpdates />

        {/* Next Match Countdown */}
        <NextMatch />

        {/* Featured Content / Highlights */}
        <section className="my-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
            Featured Highlights
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="relative w-full h-64 bg-gray-300 flex items-center justify-center">
                {/* Placeholder for embedded video */}
                <span className="text-gray-500 text-xl">
                  Video Player Placeholder
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Goal of the Season Contender!
                </h3>
                <p className="text-gray-700 mb-4">
                  Witness the incredible strike that left fans on the edge of
                  their seats. Don't miss this moment of pure brilliance!
                </p>
                <a
                  href="#"
                  className="text-[#003b75] hover:text-[#003b75] font-semibold flex items-center"
                >
                  Watch Now <ChevronRight size={16} className="ml-1" />
                </a>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <img
                src="https://placehold.co/600x400/F97316/FFFFFF?text=Player+Interview"
                alt="Player Interview"
                className="w-full h-64 object-cover rounded-t-xl"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Exclusive Interview with Captain [Player Name]
                </h3>
                <p className="text-gray-700 mb-4">
                  Our captain shares insights on team spirit, upcoming
                  challenges, and his personal journey.
                </p>
                <a
                  href="#"
                  className="text-[#003b75] hover:text-[#003b75] font-semibold flex items-center"
                >
                  Read Interview <ChevronRight size={16} className="ml-1" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
