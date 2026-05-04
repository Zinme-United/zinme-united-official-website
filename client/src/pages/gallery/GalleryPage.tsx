import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import useGalleries from "../../hooks/useGalleries";
import Loader from "../../components/Loader";
import PageHero from "../../components/PageHero";
import AnimatedSection from "../../components/AnimatedSection";

const GalleryPage = () => {
  const { galleries, galleriesLoading, galleriesError } = useGalleries();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const allImages = useMemo(() => {
    if (!galleries) return [];
    return galleries.flatMap((g) =>
      g.images.map((img) => ({ url: img.url, caption: img.caption || g.title }))
    );
  }, [galleries]);

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const goNext = useCallback(() => {
    if (selectedIndex === null || allImages.length === 0) return;
    setSelectedIndex((prev) => (prev! + 1) % allImages.length);
  }, [selectedIndex, allImages.length]);

  const goPrev = useCallback(() => {
    if (selectedIndex === null || allImages.length === 0) return;
    setSelectedIndex((prev) => (prev! - 1 + allImages.length) % allImages.length);
  }, [selectedIndex, allImages.length]);

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

  if (galleriesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <Loader size={80} />
      </div>
    );
  }

  if (galleriesError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface px-4">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-6 max-w-lg text-center">
          <p className="font-semibold text-lg">
            {galleriesError?.message || "Failed to load galleries."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-surface">
      <PageHero
        title="Gallery"
        breadcrumbs={[{ label: "Home", path: "/" }, { label: "Gallery" }]}
      />

      <section className="max-w-[var(--container-content)] mx-auto px-4 sm:px-6 py-8 md:py-12">
        {allImages.length === 0 ? (
          <p className="text-center text-text-muted text-lg py-12">
            No photos available yet.
          </p>
        ) : (
          <>
            <p className="text-text-muted text-sm mb-6">
              {allImages.length} photos
            </p>
            <AnimatedSection>
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                {allImages.map((img, i) => (
                  <button
                    key={img.url + i}
                    onClick={() => openLightbox(i)}
                    className="break-inside-avoid w-full rounded-[var(--radius-card)] overflow-hidden shadow-card hover:shadow-card-hover transition-all cursor-zoom-in group"
                  >
                    <img
                      src={img.url}
                      alt={img.caption || `Photo ${i + 1}`}
                      className="w-full group-hover:scale-[1.02] transition-transform duration-300"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </AnimatedSection>
          </>
        )}
      </section>

      {/* Lightbox */}
      {selectedIndex !== null && allImages[selectedIndex] && (
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
            {selectedIndex + 1} / {allImages.length}
          </div>

          {/* Previous */}
          {allImages.length > 1 && (
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
            src={allImages[selectedIndex].url}
            alt={allImages[selectedIndex].caption || "Full view"}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next */}
          {allImages.length > 1 && (
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
          {allImages[selectedIndex].caption && (
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-lg max-w-lg text-center z-10">
              {allImages[selectedIndex].caption}
            </div>
          )}
        </div>
      )}
    </main>
  );
};

export default GalleryPage;
