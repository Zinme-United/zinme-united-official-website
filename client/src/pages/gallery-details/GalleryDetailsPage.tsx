import { useParams } from "react-router";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import useGetGalleryById from "../../hooks/useGetGalleryById";
import Loader from "../../components/Loader";
import PageHero from "../../components/PageHero";

const GalleryDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const { data: gallery, isLoading, isError, error } = useGetGalleryById(id);

  const images = gallery?.images ?? [];

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const goNext = useCallback(() => {
    if (selectedIndex === null || images.length === 0) return;
    setSelectedIndex((prev) => (prev! + 1) % images.length);
  }, [selectedIndex, images.length]);

  const goPrev = useCallback(() => {
    if (selectedIndex === null || images.length === 0) return;
    setSelectedIndex((prev) => (prev! - 1 + images.length) % images.length);
  }, [selectedIndex, images.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (selectedIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedIndex, goNext, goPrev]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <Loader size={80} />
      </div>
    );
  }

  if (isError || !gallery) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface px-4">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-6 max-w-lg text-center">
          <p className="font-semibold text-lg">
            {error?.message || "Gallery not found."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-surface">
      <PageHero
        title={gallery.title}
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Gallery", path: "/gallery" },
          { label: gallery.title },
        ]}
      />

      {/* Gallery info */}
      <section className="max-w-[var(--container-content)] mx-auto px-4 sm:px-6 pt-8 pb-4">
        <div className="flex flex-wrap items-center gap-4 text-text-muted text-sm">
          {gallery.eventDate && (
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={16} />
              {new Date(gallery.eventDate).toLocaleDateString()}
            </span>
          )}
          {gallery.category && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary capitalize">
              {gallery.category}
            </span>
          )}
          <span className="text-text-muted">
            {images.length} {images.length === 1 ? "photo" : "photos"}
          </span>
        </div>
        {gallery.description && (
          <p className="mt-3 text-text-muted max-w-3xl leading-relaxed">
            {gallery.description}
          </p>
        )}
      </section>

      {/* Image grid */}
      <section className="max-w-[var(--container-content)] mx-auto px-4 sm:px-6 py-8">
        {images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {images.map((img, index) => (
              <button
                key={img.url + index}
                onClick={() => openLightbox(index)}
                className="relative group overflow-hidden rounded-[var(--radius-card)] shadow-card hover:shadow-card-hover transition-all duration-300 cursor-zoom-in bg-surface-alt"
              >
                <img
                  src={img.url}
                  alt={img.caption || `Image ${index + 1}`}
                  loading="lazy"
                  className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                />
                {img.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white text-sm px-4 py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {img.caption}
                  </div>
                )}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-center text-lg text-text-muted py-12">
            No images available in this gallery.
          </p>
        )}
      </section>

      {/* Lightbox */}
      {selectedIndex !== null && images[selectedIndex] && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-white/15 hover:bg-white/30 text-white p-2.5 rounded-full transition cursor-pointer z-10"
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            aria-label="Close lightbox"
          >
            <X size={22} />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 text-white/60 text-sm font-medium z-10">
            {selectedIndex + 1} / {images.length}
          </div>

          {/* Previous */}
          {images.length > 1 && (
            <button
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/30 text-white p-2.5 rounded-full transition cursor-pointer z-10"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Image */}
          <img
            src={images[selectedIndex].url}
            alt={images[selectedIndex].caption || "Full view"}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next */}
          {images.length > 1 && (
            <button
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/30 text-white p-2.5 rounded-full transition cursor-pointer z-10"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          )}

          {/* Caption */}
          {images[selectedIndex].caption && (
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-lg max-w-lg text-center z-10">
              {images[selectedIndex].caption}
            </div>
          )}
        </div>
      )}
    </main>
  );
};

export default GalleryDetailPage;
