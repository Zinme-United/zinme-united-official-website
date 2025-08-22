import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const pageSize = 6; // how many news per page

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
      <div className="bg-gray-700 text-white p-8 rounded-xl shadow-lg text-center mb-3">
        <p className="text-xl font-bold">No news articles found.</p>
        <p className="text-sm mt-2">Check back later for updates!</p>
      </div>
    );
  }

  // Pagination logic
  const totalPages = Math.ceil(news.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedNews = news.slice(startIndex, startIndex + pageSize);

  return (
    <section className="my-12">
      <h2 className="text-4xl font-bold text-[#003b75] mb-8 text-center">
        Latest News
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paginatedNews.map((news) => (
          <div
            key={news._id}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
          >
            <img
              src={news.imageUrl || "/zinme.jpg"}
              alt={news.title}
              className="w-full h-48 object-cover rounded-t-xl"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-[#003b75] mb-2">
                {news.title}
              </h3>
              <p className="text-[#003b75] text-sm mb-2">
                <span className="font-medium">
                  {format(new Date(news.publishedAt), "MMM dd, yyyy")}
                </span>
              </p>
              {news.tags && news.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {news.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs bg-blue-100 text-[#003b75] px-2 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-[#003b75] mb-4 line-clamp-3">
                {news.content.slice(0, 150)}...
              </p>
              <Link
                to={`/articles/${news._id}`}
                className="text-[#003b75] font-semibold flex items-center"
              >
                Read More <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="cursor-pointer"
          >
            <ChevronLeft size={20} color={page === 1 ? "gray" : "#003b75"} />
          </button>

          <span className="px-4 py-2 font-semibold text-[#003b75]">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="cursor-pointer"
          >
            <ChevronRight
              size={20}
              color={page === totalPages ? "gray" : "#003b75"}
            />
          </button>
        </div>
      )}
    </section>
  );
};

export default LatestNewsAndUpdates;
