import { ChevronRight } from "lucide-react";

const LatestNewsAndUpdates = () => {
  return (
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
              src={`/zinme.jpg`}
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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua...
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
  );
};

export default LatestNewsAndUpdates;
