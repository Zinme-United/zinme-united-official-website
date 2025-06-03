import {
  FeaturedContentAndHighlights,
  HeroSection,
  LatestNewsAndUpdates,
  NextMatch,
} from "../../components";
import useActivities from "../../hooks/useActivities";

const Home = () => {
  const { nextMatch, nextMatchLoading, nextMatchError } = useActivities({
    params: { isNextMatch: true },
    enabled: true,
  });

  return (
    <div className="min-h-screen bg-gray-100 font-inter">
      {/* Hero Section */}
      <HeroSection />

      <div className="container mx-auto p-6 md:p-10">
        <LatestNewsAndUpdates />

        <NextMatch
          nextMatch={nextMatch}
          isLoading={nextMatchLoading}
          error={nextMatchError}
        />

        <FeaturedContentAndHighlights />
      </div>
    </div>
  );
};

export default Home;
