import React from "react";
import useNews from "../../hooks/useNews";
import { LatestNewsAndUpdates } from "../../components";

const NewsPage: React.FC = () => {
  const { newsArticles, newsLoading, newsError } = useNews();

  if (newsLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-[#003b75] border-gray-300"></div>
      </div>
    );
  }

  if (newsError) {
    return (
      <section className="my-12 text-center">
        <p className="text-red-600 text-lg">
          Failed to load news: {newsError.message}
        </p>
      </section>
    );
  }

  if (!newsArticles || newsArticles.length === 0) {
    return (
      <div className="bg-gray-700 text-white p-8 rounded-xl shadow-lg text-center my-12">
        <p className="text-xl font-bold">No news articles found.</p>
        <p className="text-sm mt-2">Check back later for updates!</p>
      </div>
    );
  }

  return (
    <section className="my-12 max-w-7xl mx-auto px-4">
      <LatestNewsAndUpdates news={newsArticles} error={newsError} />
    </section>
  );
};

export default NewsPage;
