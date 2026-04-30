import { Link } from "react-router";
import { ChevronRight, Images } from "lucide-react";
import type { Gallery } from "../types";

interface GalleryPreviewProps {
  galleries: Gallery[];
}

const GalleryPreview = ({ galleries }: GalleryPreviewProps) => {
  return (
    <section className="my-12">
      {/* Section header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFD700] mb-1">
            Behind the Scenes
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#003b75]">
            Photo Gallery
          </h2>
        </div>
        <Link
          to="/activities"
          className="hidden sm:flex items-center text-sm font-semibold text-[#003b75] hover:text-[#0056b3] transition-colors"
        >
          View All <ChevronRight size={16} className="ml-1" />
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {galleries.map((gallery) => {
          const thumbnail =
            gallery.thumbnailUrl || gallery.images?.[0]?.url || "/zinme.jpg";

          return (
            <Link
              to={`/gallery/${gallery._id}`}
              key={gallery._id}
              className="group"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer">
                <img
                  loading="lazy"
                  src={thumbnail}
                  alt={gallery.title}
                  className="w-full h-48 md:h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

                {/* Photo count badge */}
                <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Images size={12} />
                  {gallery.images?.length || 0}
                </div>

                {/* Title */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-sm md:text-base line-clamp-2 leading-tight">
                    {gallery.title}
                  </h3>
                  {gallery.category && (
                    <span className="inline-block mt-1.5 text-[10px] uppercase tracking-wider text-white/70 font-medium">
                      {gallery.category}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Mobile link */}
      <div className="sm:hidden text-center mt-6">
        <Link
          to="/activities"
          className="inline-flex items-center text-sm font-semibold text-[#003b75]"
        >
          View All <ChevronRight size={16} className="ml-1" />
        </Link>
      </div>
    </section>
  );
};

export default GalleryPreview;
