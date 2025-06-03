import { Image } from "lucide-react";
import type { Gallery } from "../types";

interface GalleriesCardProps {
  galleries: Gallery[];
  onGalleryClick: (gallery: Gallery) => void;
}

const GalleriesCard = ({ galleries, onGalleryClick }: GalleriesCardProps) => {
  return (
    <section className="my-12 bg-white rounded-xl shadow-lg p-6 md:p-8">
      <h2 className="text-3xl font-bold text-[#003b75] mb-6 text-center">
        Galleries
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleries.length > 0 ? (
          galleries.map((gallery) => (
            <div
              key={gallery._id}
              className="bg-gray-50 rounded-lg shadow-md h-full overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col"
              onClick={() => onGalleryClick(gallery)}
            >
              <div className="flex-1">
                <img
                  src={
                    gallery.thumbnailUrl ||
                    (gallery.images.length > 0
                      ? gallery.images[0].url
                      : "/zinme.jpg")
                  }
                  alt={gallery.title}
                  className="w-full h-full object-cover rounded-t-lg"
                />
              </div>
              <div className="p-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  {gallery.title}
                </h3>
                <button
                  className="text-[#003b75] cursor-pointer hover:text-[#003b75]"
                  aria-label={`View gallery ${gallery.title}`}
                >
                  <Image size={20} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-600 text-lg">
            No galleries available yet.
          </p>
        )}
      </div>
    </section>
  );
};

export default GalleriesCard;
