import React, { useMemo, useState, useRef, useEffect } from "react";
import useNews from "../../hooks/useNews";
import Loader from "../../components/Loader";
import { format } from "date-fns";
import { Link } from "react-router";
import {
  Search,
  X,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import type { News } from "../../types";
import PageHero from "../../components/PageHero";
import AnimatedSection from "../../components/AnimatedSection";

type SortKey = "latest" | "oldest";

const ITEMS_PER_PAGE = 9;

const ArticlesPage: React.FC = () => {
  const { newsArticles, newsLoading, newsError } = useNews();

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("latest");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const searchRef = useRef<HTMLInputElement | null>(null);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [query, activeTags, sort]);

  // quick keyboard: "/" focuses search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const articles = useMemo<News[]>(() => newsArticles || [], [newsArticles]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => (a.tags || []).forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [articles]);

  const filteredSorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = articles
      .filter((a) => {
        const matchQ =
          !q ||
          a.title.toLowerCase().includes(q) ||
          a.content?.toLowerCase().includes(q);
        const matchTags =
          activeTags.length === 0 ||
          (a.tags && activeTags.every((t) => a.tags!.includes(t)));
        return matchQ && matchTags;
      })
      .sort((a, b) => {
        const da = new Date(a.publishedAt).getTime();
        const db = new Date(b.publishedAt).getTime();
        return sort === "latest" ? db - da : da - db;
      });

    return list;
  }, [articles, query, activeTags, sort]);

  const featured = filteredSorted[0];
  const rest = filteredSorted.slice(1);

  // Pagination
  const totalPages = Math.ceil(rest.length / ITEMS_PER_PAGE);
  const paginatedArticles = rest.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const toggleTag = (t: string) =>
    setActiveTags((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );

  const clearAll = () => {
    setQuery("");
    setActiveTags([]);
    setSort("latest");
  };

  if (newsLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface">
        <Loader size={100} />
      </div>
    );
  }

  if (newsError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-6 max-w-lg text-center">
          <p className="font-semibold text-lg">Failed to load news</p>
          <p className="text-sm mt-1">{newsError.message}</p>
        </div>
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-10 text-center">
          <p className="text-xl font-bold text-gray-700">
            No news articles yet
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Check back later for updates!
          </p>
        </div>
      </div>
    );
  }

  const hasActiveFilters = query || activeTags.length > 0;

  return (
    <main className="min-h-screen bg-surface">
      <PageHero
        title="News"
        breadcrumbs={[{ label: "Home", path: "/" }, { label: "News" }]}
      />

      {/* Filter bar */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-10 pr-9 py-2.5 text-sm border border-gray-200 rounded-full bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition"
              >
                <X className="h-3.5 w-3.5 cursor-pointer text-gray-400" />
              </button>
            )}
          </div>

          {/* Sort */}
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="text-sm border border-gray-200 rounded-full px-4 py-2.5 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
          >
            <option value="latest">Latest first</option>
            <option value="oldest">Oldest first</option>
          </select>

          {/* Tag filter pills - inline */}
          {allTags.length > 0 && (
            <div className="hidden md:flex items-center gap-1.5 overflow-x-auto">
              {allTags.map((t) => {
                const active = activeTags.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => toggleTag(t)}
                    className={`px-3 py-1.5 cursor-pointer rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200
                      ${
                        active
                          ? "bg-primary text-white shadow-sm"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                      }`}
                    aria-pressed={active}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          )}

          {/* Active filter chips + Clear */}
          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 cursor-pointer text-gray-500 hover:bg-gray-50 hover:text-primary transition ml-auto"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Featured hero card */}
      {featured && (
        <AnimatedSection>
          <section className="bg-white py-16">
            <div className="max-w-6xl mx-auto px-4">
              <Link to={`/articles/${featured._id}`} className="group block">
                <article className="rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-white border border-gray-100">
                  <div className="relative overflow-hidden">
                    <img
                      src={featured.imageUrl || "/zinme.jpg"}
                      alt={featured.title}
                      className="w-full h-72 md:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {featured.isFeatured && (
                      <span className="absolute top-4 left-4 bg-accent text-primary text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                        Featured
                      </span>
                    )}
                    {/* Gradient overlay at the bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                      <div className="flex items-center gap-3 text-sm text-white/80 mb-3">
                        <span className="inline-flex items-center">
                          <Calendar className="h-4 w-4 mr-1.5" />
                          {format(
                            new Date(featured.publishedAt),
                            "MMM dd, yyyy"
                          )}
                        </span>
                        {(featured.tags || []).slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-0.5 text-xs"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <h2 className="text-2xl md:text-4xl font-extrabold text-white max-w-3xl drop-shadow-sm">
                        {featured.title}
                      </h2>
                      <p className="mt-3 max-w-2xl text-white/90 text-sm md:text-base leading-relaxed line-clamp-2">
                        {featured.content?.slice(0, 200)}
                        {featured.content && featured.content.length > 200
                          ? "..."
                          : ""}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-2 text-white font-semibold group-hover:gap-3 transition-all">
                        Read article{" "}
                        <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Article grid */}
      <AnimatedSection>
        <section className="bg-surface-alt py-16">
          <div className="max-w-6xl mx-auto px-4">
            {/* Section header */}
            <div className="mb-10">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-1">
                Stay Updated
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-primary">
                More Articles
              </h2>
            </div>

            {paginatedArticles.length === 0 ? (
              <div className="text-center bg-white rounded-2xl border border-gray-100 shadow-sm p-10">
                <p className="text-gray-500">
                  No more articles match your filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedArticles.map((a) => (
                  <ArticleCard key={a._id} a={a} />
                ))}
              </div>
            )}

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-12">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-10 h-10 rounded-full border border-gray-200 text-primary disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary hover:text-white hover:border-primary transition cursor-pointer flex items-center justify-center"
                >
                  <ChevronLeft size={18} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-full text-sm font-semibold transition cursor-pointer ${
                        p === page
                          ? "bg-primary text-white shadow-sm"
                          : "text-primary hover:bg-primary/10 border border-gray-200"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-10 h-10 rounded-full border border-gray-200 text-primary disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary hover:text-white hover:border-primary transition cursor-pointer flex items-center justify-center"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </section>
      </AnimatedSection>
    </main>
  );
};

export default ArticlesPage;

/* ---- Card component matching home page design ---- */
const ArticleCard: React.FC<{ a: News }> = ({ a }) => {
  return (
    <Link to={`/articles/${a._id}`} className="group block">
      <article className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
        <div className="relative overflow-hidden">
          <img
            src={a.imageUrl || "/zinme.jpg"}
            alt={a.title}
            loading="lazy"
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {a.isFeatured && (
            <span className="absolute top-3 left-3 bg-accent text-primary text-xs font-bold uppercase px-2.5 py-1 rounded-full">
              Featured
            </span>
          )}
        </div>
        <div className="p-5 flex flex-col flex-1">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
            {format(new Date(a.publishedAt), "MMM dd, yyyy")}
          </p>
          <h3 className="text-lg font-bold text-text line-clamp-2 group-hover:text-primary transition-colors">
            {a.title}
          </h3>
          {a.tags && a.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {a.tags.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="text-[11px] font-medium bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
          {a.content && (
            <p className="mt-3 text-sm text-gray-500 leading-relaxed line-clamp-3">
              {a.content.slice(0, 160)}
              {a.content.length > 160 ? "..." : ""}
            </p>
          )}
          <span className="mt-auto pt-4 inline-flex items-center text-sm font-semibold text-primary group-hover:gap-2 transition-all">
            Read More{" "}
            <ChevronRight
              size={14}
              className="ml-0.5 group-hover:translate-x-1 transition-transform"
            />
          </span>
        </div>
      </article>
    </Link>
  );
};
