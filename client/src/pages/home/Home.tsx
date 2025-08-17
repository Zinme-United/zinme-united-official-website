import { HeroSection, LatestNewsAndUpdates, NextMatch } from "../../components";
import useActivities from "../../hooks/useActivities";
import useNews from "../../hooks/useNews";

const Home = () => {
  const { nextMatch, nextMatchLoading, nextMatchError } = useActivities({
    params: { isNextMatch: true },
    enabled: true,
  });
  const { newsArticles, newsLoading, newsError } = useNews();

  return (
    <div className="min-h-screen bg-gray-100 font-inter">
      {/* Hero Section */}
      <HeroSection nextMatch={nextMatch || null} />

      <div className="container mx-auto p-6 md:p-10">
        <LatestNewsAndUpdates
          news={newsArticles}
          isLoading={newsLoading}
          error={newsError}
        />

        <NextMatch
          nextMatch={nextMatch}
          isLoading={nextMatchLoading}
          error={nextMatchError}
        />

        {/* <FeaturedContentAndHighlights /> */}
      </div>
    </div>
  );
};

export default Home;
