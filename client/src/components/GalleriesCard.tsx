import { Image, Calendar } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import type { Gallery } from "../types";

interface GalleriesCardProps {
  galleries: Gallery[];
}

const GalleriesCard = ({ galleries }: GalleriesCardProps) => {
  const [activeTab, setActiveTab] = useState<"match" | "activity">("match");

  const matchGalleries = galleries.filter((g) => g.category === "match");
  const activityGalleries = galleries.filter((g) => g.category === "activity");

  const renderGalleryGrid = (items: Gallery[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {items.length > 0 ? (
        items.map((gallery) => (
          <Link
            key={gallery._id}
            to={`/gallery-details/${gallery._id}`}
            className="bg-gray-50 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group flex flex-col"
          >
            {/* Thumbnail */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={
                  gallery.thumbnailUrl ||
                  (gallery.images.length > 0
                    ? gallery.images[0].url
                    : "/zinme.jpg")
                }
                alt={gallery.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {gallery.eventDate && (
                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
                  <Calendar size={14} />
                  <span>
                    {new Date(gallery.eventDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col flex-1">
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#003b75] transition-colors">
                {gallery.title}
              </h3>
              {gallery.description && (
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {gallery.description}
                </p>
              )}
              <div className="mt-auto flex justify-end">
                <span className="text-[#003b75] group-hover:text-blue-800 transition-colors">
                  <Image size={20} />
                </span>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <p className="col-span-full text-center text-gray-600 text-lg">
          No galleries available yet.
        </p>
      )}
    </div>
  );

  return (
    <section className="my-12 bg-white rounded-xl shadow-lg p-6 md:p-8">
      <h2 className="text-3xl font-bold text-[#003b75] mb-6 text-center">
        Galleries
      </h2>

      {/* Tabs */}
      <div className="flex justify-center space-x-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("match")}
          className={`px-6 py-2 font-semibold cursor-pointer ${
            activeTab === "match"
              ? "border-b-4 border-[#003b75] text-[#003b75]"
              : "text-gray-500 hover:text-[#003b75]"
          }`}
        >
          Match Galleries
        </button>
        <button
          onClick={() => setActiveTab("activity")}
          className={`px-6 py-2 font-semibold cursor-pointer ${
            activeTab === "activity"
              ? "border-b-4 border-[#003b75] text-[#003b75]"
              : "text-gray-500 hover:text-[#003b75]"
          }`}
        >
          Activities Galleries
        </button>
      </div>

      {/* Active Tab Content */}
      {activeTab === "match"
        ? renderGalleryGrid(matchGalleries)
        : renderGalleryGrid(activityGalleries)}
    </section>
  );
};

export default GalleriesCard;
