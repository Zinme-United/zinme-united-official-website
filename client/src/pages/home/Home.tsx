import HeroSection from "../../components/HeroSection";
import MatchesSection from "../../components/MatchesSection";
import LatestNewsAndUpdates from "../../components/LatestNewsAndUpdates";
import SquadSpotlight from "../../components/SquadSpotlight";
import PartnersBanner from "../../components/PartnersBanner";
import AnimatedSection from "../../components/AnimatedSection";
import useNews from "../../hooks/useNews";
import usePlayers from "../../hooks/usePlayers";

const Home = () => {
  const { newsArticles, newsError } = useNews({ enabled: true });
  const { players } = usePlayers();

  const latestNews = newsArticles?.slice(0, 3);

  return (
    <div className="min-h-screen bg-surface-alt">
      {/* Hero - full width, no AnimatedSection (first visible section) */}
      <HeroSection />

      {/* Matches Section - next fixture + recent results */}
      <AnimatedSection className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <MatchesSection />
        </div>
      </AnimatedSection>

      {/* Latest News */}
      <AnimatedSection className="py-16" delay={0.1}>
        <div className="max-w-6xl mx-auto px-4">
          <LatestNewsAndUpdates news={latestNews} error={newsError} />
        </div>
      </AnimatedSection>

      {/* Squad Spotlight */}
      <AnimatedSection className="bg-white py-16" delay={0.1}>
        <div className="max-w-6xl mx-auto px-4">
          <SquadSpotlight players={players || []} />
        </div>
      </AnimatedSection>

      {/* Partners/Sponsors */}
      <AnimatedSection className="py-16" delay={0.1}>
        <div className="max-w-6xl mx-auto px-4">
          <PartnersBanner />
        </div>
      </AnimatedSection>
    </div>
  );
};

export default Home;
