import { HeroSection, NextMatch } from "../../components";
import useActivities from "../../hooks/useActivities";
import useNews from "../../hooks/useNews";
import usePlayers from "../../hooks/usePlayers";
import useGalleries from "../../hooks/useGalleries";

import PartnersBanner from "../../components/PartnersBanner";
import LatestNewsAndUpdates from "../../components/LatestNewsAndUpdates";
import SquadSpotlight from "../../components/SquadSpotlight";
import GalleryPreview from "../../components/GalleryPreview";
import Loader from "../../components/Loader";

const Home = () => {
  const { nextMatch, nextMatchLoading, nextMatchError } = useActivities({
    params: { isNextMatch: true },
    enabled: true,
  });

  const { newsArticles, newsError } = useNews({
    enabled: true,
  });

  const { players } = usePlayers();
  const { galleries } = useGalleries();

  if (nextMatchLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <Loader size={100} />
      </div>
    );
  }

  const latestNews = newsArticles?.slice(0, 3);
  const spotlightPlayers = players?.slice(0, 5);
  const recentGalleries = galleries?.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Hero - full width, no container */}
      <HeroSection nextMatch={nextMatch || null} />

      {/* Next Match */}
      <div className="max-w-6xl mx-auto px-4">
        <NextMatch nextMatch={nextMatch} error={nextMatchError} />
      </div>

      {/* Latest News - alternating bg */}
      <div className="bg-white py-4">
        <div className="max-w-6xl mx-auto px-4">
          <LatestNewsAndUpdates news={latestNews} error={newsError} />
        </div>
      </div>

      {/* Squad Spotlight */}
      {spotlightPlayers && spotlightPlayers.length > 0 && (
        <div className="py-4">
          <div className="max-w-6xl mx-auto px-4">
            <SquadSpotlight players={spotlightPlayers} />
          </div>
        </div>
      )}

      {/* Gallery */}
      {recentGalleries && recentGalleries.length > 0 && (
        <div className="bg-white py-4">
          <div className="max-w-6xl mx-auto px-4">
            <GalleryPreview galleries={recentGalleries} />
          </div>
        </div>
      )}

      {/* Partners */}
      <div className="py-4">
        <div className="max-w-6xl mx-auto px-4">
          <PartnersBanner />
        </div>
      </div>
    </div>
  );
};

export default Home;
