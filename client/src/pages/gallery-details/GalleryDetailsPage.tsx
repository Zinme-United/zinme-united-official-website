import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Calendar } from "lucide-react";
import useGalleries from "../../hooks/useGalleries";

const GalleryDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { galleries } = useGalleries();

  const gallery = galleries?.find((g) => g._id === id);

  if (!gallery) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold text-red-600">Gallery not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="ml-4 px-4 py-2 bg-[#003b75] text-white rounded-lg shadow hover:bg-blue-900"
        >
          Back
        </button>
      </div>
    );
  }

  const coverImg = gallery.images[0]?.url || "/default-cover.jpg";

  return (
    <div className="bg-gray-50 font-inter">
      {/* Hero Section */}
      <div className="relative h-[300px] md:h-[400px] overflow-hidden">
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

        {/* Back + Share buttons */}
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
      <div className="max-w-screen-xl mx-auto px-6 py-12">
        {gallery.images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.images.map((img, index) => (
              <div
                key={img.url + index}
                className="relative group overflow-hidden rounded-xl shadow-md"
              >
                <img
                  src={img.url}
                  alt={img.caption || `Image ${index + 1}`}
                  className="w-full h-64 object-cover transform group-hover:scale-105 transition duration-500"
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
    </div>
  );
};

export default GalleryDetailPage;
