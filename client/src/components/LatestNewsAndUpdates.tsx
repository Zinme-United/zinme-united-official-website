import { ChevronRight } from "lucide-react";
import { format } from "date-fns";
import type { News } from "../types";
import type { AxiosError } from "axios";
import type React from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { Link } from "react-router";

interface Props {
  news: News[] | undefined;
  isLoading: boolean;
  error: AxiosError | null;
}

const LatestNewsAndUpdates: React.FC<Props> = ({ news, isLoading, error }) => {
  const latestNews = (news || [])
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, 3);

  if (isLoading) {
    return (
      <div className="bg-[#003b75] text-white p-8 rounded-xl shadow-lg flex flex-col items-center justify-center min-h-[200px]">
        <ClipLoader color="#fff" loading={isLoading} size={40} />
        <p className="mt-4 text-lg">Loading news...</p>
      </div>
    );
  }

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

  return (
    <section className="my-12">
      <h2 className="text-4xl font-bold text-[#003b75] mb-8 text-center">
        Latest News
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {latestNews.map((news) => (
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
                to={`/news/${news._id}`}
                className="text-[#003b75] hover:text-[#003b75] font-semibold flex items-center"
              >
                Read More <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LatestNewsAndUpdates;
