import {
  FeaturedContentAndHighlights,
  HeroSection,
  LatestNewsAndUpdates,
  NextMatch,
} from "../../components";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 font-inter">
      {/* Hero Section */}
      <HeroSection />

      <div className="container mx-auto p-6 md:p-10">
        <LatestNewsAndUpdates />

        <NextMatch />

        <FeaturedContentAndHighlights />
      </div>
    </div>
  );
};

export default Home;
