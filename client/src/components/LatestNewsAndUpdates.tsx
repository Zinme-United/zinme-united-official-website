import { ChevronRight } from "lucide-react";
import { format } from "date-fns";
import type { News } from "../types";
import type { AxiosError } from "axios";
import type React from "react";
import { Link } from "react-router";

interface Props {
  news: News[] | undefined;
  error: AxiosError | null;
}

const LatestNewsAndUpdates: React.FC<Props> = ({ news, error }) => {
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

  const featured = news[0];
  const smaller = news.slice(1, 3);

  return (
    <section className="my-12">
      {/* Section header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-1">
            Stay Updated
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary">
            Latest News
          </h2>
        </div>
        <Link
          to="/articles"
          className="hidden sm:flex items-center text-sm font-semibold text-primary hover:text-primary-light transition-colors"
        >
          View All News <ChevronRight size={16} className="ml-1" />
        </Link>
      </div>

      {/* Large featured card */}
      <Link to={`/articles/${featured._id}`} className="group block mb-6">
        <article className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
          <div className="relative overflow-hidden">
            <img
              src={featured.imageUrl || "/zinme.jpg"}
              alt={featured.title}
              className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {featured.isFeatured && (
              <span className="absolute top-3 left-3 bg-accent text-primary text-xs font-bold uppercase px-3 py-1 rounded-full">
                Featured
              </span>
            )}
          </div>
          <div className="p-6">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
              {format(new Date(featured.publishedAt), "MMM dd, yyyy")}
            </p>
            <h3 className="text-xl font-bold text-text mb-2 group-hover:text-primary transition-colors">
              {featured.title}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              {featured.content.slice(0, 150)}...
            </p>
            <span className="inline-flex items-center text-sm font-semibold text-primary mt-4 group-hover:gap-2 transition-all">
              Read More{" "}
              <ChevronRight
                size={14}
                className="ml-0.5 group-hover:translate-x-1 transition-transform"
              />
            </span>
          </div>
        </article>
      </Link>

      {/* Two smaller cards */}
      {smaller.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {smaller.map((item) => (
            <Link
              to={`/articles/${item._id}`}
              key={item._id}
              className="group block"
            >
              <article className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col md:flex-row">
                {/* Thumbnail */}
                <div className="relative overflow-hidden md:w-1/3 flex-shrink-0">
                  <img
                    src={item.imageUrl || "/zinme.jpg"}
                    alt={item.title}
                    className="w-full h-32 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {item.isFeatured && (
                    <span className="absolute top-2 left-2 bg-accent text-primary text-xs font-bold uppercase px-2 py-0.5 rounded-full">
                      Featured
                    </span>
                  )}
                </div>
                {/* Content */}
                <div className="p-4 md:w-2/3 flex flex-col justify-center">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                    {format(new Date(item.publishedAt), "MMM dd, yyyy")}
                  </p>
                  <h3 className="text-base font-bold text-text line-clamp-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mt-1">
                    {item.content.slice(0, 80)}...
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}

      {/* Mobile "View All" link */}
      <div className="sm:hidden text-center mt-6">
        <Link
          to="/articles"
          className="inline-flex items-center text-sm font-semibold text-primary"
        >
          View All News <ChevronRight size={16} className="ml-1" />
        </Link>
      </div>
    </section>
  );
};

export default LatestNewsAndUpdates;
