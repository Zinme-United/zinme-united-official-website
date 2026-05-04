import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { format } from "date-fns";
import {
  ArrowLeft,
  Share2,
  Calendar,
  User,
  Tag,
  Link as LinkIcon,
} from "lucide-react";
import useSingleNews from "../../hooks/useSingleNews";
import useNews from "../../hooks/useNews";
import Loader from "../../components/Loader";
import PageHero from "../../components/PageHero";
import AnimatedSection from "../../components/AnimatedSection";

const fallbackImg = "/zinme.jpg";

const ArticlesDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { singleNews, singleNewsLoading, singleNewsError } = useSingleNews(id);
  const { newsArticles } = useNews();

  // Related articles for "More News" section
  const relatedArticles = useMemo(() => {
    if (!newsArticles || !id) return [];
    return newsArticles
      .filter((a) => a._id !== id)
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() -
          new Date(a.publishedAt).getTime()
      )
      .slice(0, 3);
  }, [newsArticles, id]);

  // Reading progress bar
  const articleRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = articleRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const pct = total > 0 ? (scrolled / total) * 100 : 0;
      setProgress(pct);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [singleNewsLoading]);

  // Reading time (avg ~200 wpm)
  const readingTime = useMemo(() => {
    if (!singleNews?.content) return null;
    const words = singleNews.content.trim().split(/\s+/).length;
    const mins = Math.max(1, Math.round(words / 200));
    return `${mins} min read`;
  }, [singleNews?.content]);

  // Share handlers
  const handleShare = async () => {
    const url = window.location.href;
    const title = singleNews?.title ?? "Article";
    const text = singleNews?.content?.slice(0, 120) ?? title;
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard");
      }
    } catch {
      // no-op
    }
  };

  if (singleNewsLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface">
        <Loader size={100} />
      </div>
    );
  }

  if (singleNewsError || !singleNews) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-6 max-w-lg text-center">
          <p className="font-semibold text-lg">News not found</p>
          <p className="text-sm mt-1">
            {singleNewsError?.message || "Please go back and try again."}
          </p>
          <button
            onClick={() => navigate("/articles")}
            className="mt-4 inline-flex items-center px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </button>
        </div>
      </div>
    );
  }

  const cover = singleNews.imageUrl || fallbackImg;

  return (
    <div className="min-h-screen bg-surface">
      <PageHero
        title={singleNews.title}
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "News", path: "/articles" },
          { label: singleNews.title },
        ]}
      />

      {/* Sticky header with back/share + reading progress */}
      <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur border-b border-primary/10">
        <div className="max-w-4xl mx-auto px-4 h-12 flex items-center justify-between">
          <button
            onClick={() => navigate("/articles")}
            className="inline-flex items-center text-primary font-semibold cursor-pointer"
            aria-label="Go back to news"
          >
            <ArrowLeft className="w-5 h-5 mr-1" /> Back
          </button>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-md border bg-primary text-white cursor-pointer"
            aria-label="Share article"
          >
            <Share2 className="w-4 h-4" /> Share
          </button>
        </div>
        <div
          className="h-1 bg-primary"
          style={{ width: `${progress}%`, transition: "width .15s linear" }}
          aria-hidden="true"
        />
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative h-[42vh] md:h-[56vh] mt-4 overflow-hidden rounded-2xl shadow-lg">
            <img
              src={cover}
              alt={singleNews.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
            <div className="absolute bottom-0 p-5 md:p-8 text-white">
              <h1 className="text-2xl md:text-4xl font-extrabold drop-shadow-sm">
                {singleNews.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/70">
                <span className="inline-flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {format(new Date(singleNews.publishedAt), "MMM dd, yyyy")}
                </span>
                {singleNews.author && (
                  <span className="inline-flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {singleNews.author}
                  </span>
                )}
                {readingTime && (
                  <span className="inline-flex items-center">
                    <LinkIcon className="w-4 h-4 mr-1 rotate-45 opacity-70" />
                    {readingTime}
                  </span>
                )}
              </div>
              {singleNews.tags?.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {singleNews.tags.slice(0, 6).map((t, i) => (
                    <span
                      key={`${t}-${i}`}
                      className="inline-flex items-center text-xs bg-white/20 border border-white/30 rounded-full px-2.5 py-1"
                    >
                      <Tag className="w-3.5 h-3.5 mr-1" /> #{t}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Article body */}
      <section ref={articleRef} className="max-w-4xl mx-auto px-4 py-8">
        <article className="prose prose-lg max-w-none prose-headings:font-extrabold prose-headings:text-primary-dark prose-p:text-text prose-a:text-primary prose-strong:text-primary-dark">
          <div className="whitespace-pre-line text-primary">
            {singleNews.content}
          </div>
        </article>

        {/* Optional: Source / footer meta */}
        {singleNews.author && (
          <div className="mt-8 text-sm text-text-muted">
            Source: <span className="font-medium">{singleNews.author}</span>
          </div>
        )}
      </section>

      {/* More News section */}
      {relatedArticles.length > 0 && (
        <AnimatedSection>
          <section className="max-w-[var(--container-content)] mx-auto px-4 sm:px-6 py-12 border-t border-primary/10">
            <h2 className="font-heading text-2xl uppercase tracking-wide text-primary mb-6">
              More News
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((a) => (
                <Link
                  key={a._id}
                  to={`/articles/${a._id}`}
                  className="group bg-surface rounded-[var(--radius-card)] shadow-card hover:shadow-card-hover overflow-hidden transition-all"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={a.imageUrl || "/zinme.jpg"}
                      alt={a.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                    <div className="absolute left-3 bottom-3 text-xs px-2 py-1 rounded bg-black/60 text-white">
                      {format(new Date(a.publishedAt), "MMM dd, yyyy")}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-text line-clamp-2">
                      {a.title}
                    </h3>
                    {a.content && (
                      <p className="mt-2 text-sm text-text-muted line-clamp-2">
                        {a.content.slice(0, 120)}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </AnimatedSection>
      )}
    </div>
  );
};

export default ArticlesDetails;
