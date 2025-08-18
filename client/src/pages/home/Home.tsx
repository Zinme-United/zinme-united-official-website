import ClipLoader from "react-spinners/ClipLoader";
import { HeroSection, LatestNewsAndUpdates, NextMatch } from "../../components";
import useActivities from "../../hooks/useActivities";
import useNews from "../../hooks/useNews";

const Home = () => {
  const { nextMatch, nextMatchLoading, nextMatchError } = useActivities({
    params: { isNextMatch: true },
    enabled: true,
  });
  const { newsArticles, newsLoading, newsError } = useNews();

  if (nextMatchLoading || newsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader
          color="#003b75"
          loading={nextMatchLoading || newsLoading}
          size={40}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-inter">
      {/* Hero Section */}
      <HeroSection nextMatch={nextMatch || null} />

      <div className="container mx-auto p-6 md:p-10">
        <NextMatch nextMatch={nextMatch} error={nextMatchError} />

        <LatestNewsAndUpdates news={newsArticles} error={newsError} />

        {/* <FeaturedContentAndHighlights /> */}
      </div>
    </div>
  );
};

export default Home;
