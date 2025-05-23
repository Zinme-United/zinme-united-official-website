import { ChevronRight } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 font-inter">
      {/* Hero Section */}
      <section
        className="relative h-96 md:h-[600px] bg-cover bg-center flex items-center justify-center text-white shadow-xl rounded-b-xl overflow-hidden"
        style={{
          backgroundImage:
            "url('https://placehold.co/1920x1080/4F46E5/FFFFFF?text=Team+in+Action')",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 text-center p-4">
          <img
            src="https://placehold.co/200x200/FFFFFF/000000?text=Team+Logo"
            alt="Team Logo"
            className="mx-auto mb-6 w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-white shadow-lg"
          />
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
            Unleash the Passion
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto drop-shadow">
            Join us in the journey of triumphs, dedication, and unforgettable
            moments.
          </p>
          <button className="bg-[#003b75] hover:bg-[#003b75] text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg">
            Latest News
          </button>
        </div>
      </section>

      <div className="container mx-auto p-6 md:p-10">
        {/* Latest News & Updates */}
        <section className="my-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
            Latest News
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                <img
                  src={`https://placehold.co/600x400/3B82F6/FFFFFF?text=News+Image+${i}`}
                  alt={`News ${i}`}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[#003b75] mb-2">
                    Team Secures Victory in Thrilling Match {i}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    <span className="font-medium">May 20, 2025</span>
                  </p>
                  <p className="text-gray-700 mb-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua...
                  </p>
                  <a
                    href="#"
                    className="text-[#003b75] hover:text-[#003b75] font-semibold flex items-center"
                  >
                    Read More <ChevronRight size={16} className="ml-1" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Next Match Countdown */}
        <section className="my-12 bg-[#003b75] text-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Next Match</h2>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex items-center space-x-4">
              <img
                src="https://placehold.co/80x80/FFFFFF/000000?text=Our+Team"
                alt="Our Team Logo"
                className="w-20 h-20 rounded-full border-4 border-white shadow-md"
              />
              <span className="text-3xl font-bold">VS</span>
              <img
                src="https://placehold.co/80x80/FFFFFF/000000?text=Opponent"
                alt="Opponent Logo"
                className="w-20 h-20 rounded-full border-4 border-white shadow-md"
              />
            </div>
            <div className="text-2xl md:text-3xl font-semibold">
              <p>vs. Rival FC</p>
              <p>May 28, 2025 | 7:00 PM GMT+7</p>
              <p>Stadium Name</p>
            </div>
            <div className="text-5xl md:text-6xl font-extrabold bg-white text-blue-700 px-6 py-3 rounded-xl shadow-inner">
              03:12:45:30
              <p className="text-sm font-normal mt-1">Days:Hrs:Mins:Secs</p>
            </div>
          </div>
          <button
            style={{ color: "white", backgroundColor: "#003b75" }}
            className="mt-8 font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-[#003b75] shadow-lg"
          >
            Buy Tickets
          </button>
        </section>

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
