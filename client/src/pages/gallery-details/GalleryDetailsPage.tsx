import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Calendar, X } from "lucide-react";
import { useState } from "react";
import useGetGalleryById from "../../hooks/useGetGalleryById";
import ClipLoader from "react-spinners/ClipLoader";

const GalleryDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: gallery, isLoading, isError, error } = useGetGalleryById(id);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <ClipLoader color="#003b75" size={50} />
      </div>
    );
  }

  // Error state
  if (isError || !gallery) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <p className="text-xl font-semibold text-red-600">
          {error?.message || "Gallery not found."}
        </p>
      </div>
    );
  }

  const coverImg =
    gallery?.thumbnailUrl || gallery?.images[0]?.url || "/zinme.jpg";

  return (
    <div className="font-inter">
      {/* Hero Section */}
      <div className="relative mx-auto max-w-screen-xl rounded-xl overflow-hidden">
        <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] min-h-[280px]">
          <img
            src={coverImg}
            alt={gallery.title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />

          {/* Content container with responsive padding */}
          <div className="absolute inset-0 flex items-end">
            <div className="w-full px-4 sm:px-6 md:px-10 pb-5 sm:pb-7 md:pb-10">
              {/* Mobile-friendly readable block behind text */}
              <div className="inline-block sm:bg-transparent bg-black/35 backdrop-blur-[2px] rounded-lg sm:rounded-none px-2 py-1 sm:px-0 sm:py-0">
                <h1
                  className="text-white font-extrabold leading-tight
                         text-2xl xs:text-3xl sm:text-4xl md:text-5xl"
                >
                  {gallery.title}
                </h1>

                {gallery.eventDate && (
                  <p
                    className="mt-1 sm:mt-2 flex items-center text-gray-200
                          text-xs xs:text-sm md:text-lg"
                  >
                    <Calendar size={18} className="mr-2" />
                    {new Date(gallery.eventDate).toLocaleDateString()}
                  </p>
                )}

                {gallery.description && (
                  <p
                    className="mt-2 sm:mt-3 text-gray-200 max-w-3xl
                          text-xs xs:text-sm sm:text-base line-clamp-3 sm:line-clamp-none"
                  >
                    {gallery.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Back button with safe area and bigger tap target */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
            <button
              onClick={() => navigate(-1)}
              className="cursor-pointer inline-flex items-center justify-center
                   w-10 h-10 sm:w-11 sm:h-11 rounded-full
                   bg-white/25 hover:bg-white/40 text-white transition"
              style={{ paddingTop: "env(safe-area-inset-top)" }}
              aria-label="Go back"
            >
              <ArrowLeft size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-screen-xl mx-auto py-12">
        {gallery.images && gallery.images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.images.map((img, index) => (
              <div
                key={img.url + index}
                className="relative group overflow-hidden rounded-xl shadow-md cursor-zoom-in"
                onClick={() => setSelectedImage(img.url)}
              >
                <img
                  src={img.url}
                  alt={img.caption || `Image ${index + 1}`}
                  className="w-full h-auto object-contain transition duration-500 group-hover:scale-105"
                />
                {img.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-sm px-3 py-2 opacity-0 group-hover:opacity-100 transition">
                    {img.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-lg text-gray-500">
            No images available in this gallery.
          </p>
        )}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 cursor-pointer right-6 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <X size={24} />
          </button>
          <img
            src={selectedImage}
            alt="Full view"
            className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default GalleryDetailPage;
