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
      <div className="relative h-[300px] md:h-[400px] overflow-hidden rounded-xl">
        <img
          src={coverImg}
          alt={gallery.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/80" />
        <div className="absolute bottom-8 left-6 md:left-12 text-white">
          <h1 className="text-3xl md:text-5xl font-extrabold">
            {gallery.title}
          </h1>
          {gallery.eventDate && (
            <p className="flex items-center mt-2 text-sm md:text-lg text-gray-200">
              <Calendar size={18} className="mr-2" />
              {new Date(gallery.eventDate).toLocaleDateString()}
            </p>
          )}
          {gallery.description && (
            <p className="mt-3 text-gray-200 max-w-2xl">
              {gallery.description}
            </p>
          )}
        </div>

        {/* Back button */}
        <div className="absolute top-4 left-4 flex space-x-2">
          <button
            onClick={() => navigate(-1)}
            className="bg-white/20 hover:bg-white/40 p-2 rounded-full text-white cursor-pointer"
          >
            <ArrowLeft size={22} />
          </button>
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
