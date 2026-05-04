import React, { useMemo, useState, useRef, useEffect } from "react";
import useNews from "../../hooks/useNews";
import Loader from "../../components/Loader";
import { format } from "date-fns";
import { Link } from "react-router";
import {
  Search,
  X,
  Tag,
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
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-6 max-w-lg text-center">
          <p className="font-semibold text-lg">Failed to load news</p>
          <p className="text-sm mt-1">{newsError.message}</p>
        </div>
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-primary-dark text-white rounded-xl p-8 text-center">
          <p className="text-xl font-bold">No news articles found</p>
          <p className="text-sm mt-1 opacity-90">
            Check back later for updates!
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-surface">
      <PageHero
        title="News"
        breadcrumbs={[{ label: "Home", path: "/" }, { label: "News" }]}
      />

      {/* Sticky controls */}
      <div className="sticky top-0 z-20 bg-surface/80 backdrop-blur border-b border-primary/10">
        <div className="max-w-[var(--container-content)] mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px] max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles (press / to focus)"
              className="w-full pl-9 pr-9 py-2 text-sm border text-primary border-primary/20 rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-surface-alt"
              >
                <X className="h-4 w-4 cursor-pointer text-text-muted" />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm text-text-muted">
              Sort
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="text-sm border border-primary/20 rounded-lg px-3 py-2 bg-surface text-primary"
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>

          {/* Active filters + Clear */}
          {(query || activeTags.length > 0) && (
            <div className="flex flex-wrap items-center gap-2 ml-auto">
              {query && (
                <span className="inline-flex items-center gap-1.5 text-xs bg-surface-alt border border-primary/10 text-text rounded-full px-3 py-1">
                  <Search className="h-3.5 w-3.5" /> "{query}"
                  <button
                    onClick={() => setQuery("")}
                    className="ml-1 rounded-full p-0.5 hover:bg-primary/5"
                    aria-label="Remove search"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {activeTags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 text-xs bg-surface-alt border border-primary/10 text-text rounded-full px-3 py-1"
                >
                  #{t}
                  <button
                    onClick={() => toggleTag(t)}
                    className="ml-1 rounded-full p-0.5 hover:bg-primary/5"
                    aria-label={`Remove ${t}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <button
                onClick={clearAll}
                className="text-xs px-3 py-1 rounded-lg border bg-surface-alt cursor-pointer text-primary hover:bg-primary/5"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Tag chips row */}
        <div className="bg-surface/80">
          <div className="max-w-[var(--container-content)] mx-auto px-4 pb-3 overflow-x-auto">
            <div className="flex items-center gap-2 py-2">
              <span className="inline-flex items-center text-xs text-primary mr-1">
                <Tag className="h-4 w-4 mr-1 text-primary" /> Tags:
              </span>
              {allTags.length === 0 ? (
                <span className="text-xs text-text-muted">No tags</span>
              ) : (
                allTags.map((t) => {
                  const active = activeTags.includes(t);
                  return (
                    <button
                      key={t}
                      onClick={() => toggleTag(t)}
                      className={`px-3 py-1.5 cursor-pointer rounded-full text-xs border whitespace-nowrap transition
                        ${
                          active
                            ? "bg-primary text-white border-primary"
                            : "bg-surface text-text border-primary/20 hover:bg-surface-alt"
                        }`}
                      aria-pressed={active}
                    >
                      #{t}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Featured hero */}
      {featured && (
        <section className="relative">
          <div className="max-w-[var(--container-content)] mx-auto pt-8">
            <article className="relative overflow-hidden rounded-2xl bg-primary-dark text-white">
              <div className="absolute inset-0">
                <img
                  src={featured.imageUrl || "/zinme.jpg"}
                  alt={featured.title}
                  className="w-full h-full object-cover opacity-25"
                />
              </div>
              <div className="relative p-6 md:p-10">
                {featured.isFeatured && (
                  <span className="inline-flex items-center text-xs font-semibold bg-white/20 rounded-full px-3 py-1 mb-3">
                    Featured
                  </span>
                )}
                <h2 className="text-2xl md:text-4xl font-extrabold max-w-3xl drop-shadow-sm">
                  {featured.title}
                </h2>
                <p className="mt-3 max-w-3xl text-white/90">
                  {featured.content?.slice(0, 200)}
                  {featured.content && featured.content.length > 200 ? "..." : ""}
                </p>
                <div className="mt-4 flex items-center gap-4 text-sm text-white/70">
                  <span className="inline-flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {format(new Date(featured.publishedAt), "MMM dd, yyyy")}
                  </span>
                  {(featured.tags || []).slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center bg-white/15 rounded-full px-2 py-0.5 text-xs"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
                <div className="mt-6">
                  <Link
                    to={`/articles/${featured._id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-primary font-semibold hover:bg-primary/5"
                  >
                    Read article <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </section>
      )}

      {/* Grid */}
      <AnimatedSection>
        <section className="max-w-[var(--container-content)] mx-auto py-8">
          {paginatedArticles.length === 0 ? (
            <div className="text-center bg-surface border border-primary/10 rounded-xl p-10">
              <p className="text-text">
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
            <div className="flex justify-center items-center gap-2 py-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-2 rounded-lg border border-primary/20 text-primary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/5 transition cursor-pointer"
              >
                <ChevronLeft size={18} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-lg text-sm font-semibold transition cursor-pointer ${
                    p === page
                      ? "bg-primary text-white"
                      : "text-primary hover:bg-primary/5 border border-primary/20"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-2 rounded-lg border border-primary/20 text-primary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/5 transition cursor-pointer"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </section>
      </AnimatedSection>
    </main>
  );
};

export default ArticlesPage;

/* ---- Small, focused card component ---- */
const ArticleCard: React.FC<{ a: News }> = ({ a }) => {
  return (
    <article className="group bg-surface border border-primary/10 rounded-[var(--radius-card)] overflow-hidden shadow-card hover:shadow-card-hover transition">
      <Link to={`/articles/${a._id}`} className="block">
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
          {a.tags && a.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {a.tags.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="text-[11px] bg-primary/5 text-primary px-2 py-1 rounded-full border border-primary/10"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
          {a.content && (
            <p className="mt-3 text-sm text-text-muted line-clamp-3">
              {a.content.slice(0, 160)}
              {a.content.length > 160 ? "..." : ""}
            </p>
          )}
          <span className="mt-4 inline-flex items-center gap-1 text-primary font-semibold">
            Read <ChevronRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </article>
  );
};
