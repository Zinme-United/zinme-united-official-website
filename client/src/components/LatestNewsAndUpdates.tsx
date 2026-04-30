import { ChevronRight, ChevronLeft } from "lucide-react";
import { format } from "date-fns";
import type { News } from "../types";
import type { AxiosError } from "axios";
import type React from "react";
import { Link } from "react-router";
import { useState } from "react";

interface Props {
  news: News[] | undefined;
  error: AxiosError | null;
}

const LatestNewsAndUpdates: React.FC<Props> = ({ news, error }) => {
  const [page, setPage] = useState(1);
  const pageSize = 6;

  if (error) {
    return (
      <section className="my-12 text-center">
        <p className="text-red-600 text-lg">
          Failed to load latest news: {error.message}
        </p>
      </section>
    );
  }

  if (!news || news.length === 0) {
    return (
      <section className="my-12 text-center">
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-10">
          <p className="text-xl font-bold text-gray-700">
            No news articles yet
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Check back later for updates!
          </p>
        </div>
      </section>
    );
  }

  const totalPages = Math.ceil(news.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedNews = news.slice(startIndex, startIndex + pageSize);

  return (
    <section className="my-12">
      {/* Section header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFD700] mb-1">
            Stay Updated
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#003b75]">
            Latest News
          </h2>
        </div>
        <Link
          to="/articles"
          className="hidden sm:flex items-center text-sm font-semibold text-[#003b75] hover:text-[#0056b3] transition-colors"
        >
          View All News <ChevronRight size={16} className="ml-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedNews.map((item) => (
          <Link
            to={`/articles/${item._id}`}
            key={item._id}
            className="group block"
          >
            <article className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={item.imageUrl || "/zinme.jpg"}
                  alt={item.title}
                  className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {item.isFeatured && (
                  <span className="absolute top-3 left-3 bg-[#FFD700] text-[#003b75] text-xs font-bold uppercase px-3 py-1 rounded-full">
                    Featured
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Date */}
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                  {format(new Date(item.publishedAt), "MMM dd, yyyy")}
                </p>

                {/* Title */}
                <h3 className="text-lg font-bold text-[#1a1a2e] mb-2 line-clamp-2 group-hover:text-[#003b75] transition-colors">
                  {item.title}
                </h3>

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {item.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="text-[10px] bg-[#003b75]/10 text-[#003b75] px-2 py-0.5 rounded-full font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Excerpt */}
                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                  {item.content.slice(0, 120)}...
                </p>

                {/* Read More */}
                <span className="inline-flex items-center text-sm font-semibold text-[#003b75] mt-4 group-hover:gap-2 transition-all">
                  Read More{" "}
                  <ChevronRight
                    size={14}
                    className="ml-0.5 group-hover:translate-x-1 transition-transform"
                  />
                </span>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 disabled:opacity-30 hover:bg-[#003b75] hover:text-white hover:border-[#003b75] transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="px-4 py-1 text-sm font-semibold text-gray-600">
            {page} / {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 disabled:opacity-30 hover:bg-[#003b75] hover:text-white hover:border-[#003b75] transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Mobile "View All" link */}
      <div className="sm:hidden text-center mt-6">
        <Link
          to="/articles"
          className="inline-flex items-center text-sm font-semibold text-[#003b75]"
        >
          View All News <ChevronRight size={16} className="ml-1" />
        </Link>
      </div>
    </section>
  );
};

export default LatestNewsAndUpdates;
