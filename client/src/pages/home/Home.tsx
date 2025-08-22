import { HeroSection, NextMatch } from "../../components";
import useActivities from "../../hooks/useActivities";

import PartnersBanner from "../../components/PartnersBanner";
import Loader from "../../components/Loader";

const Home = () => {
  const { nextMatch, nextMatchLoading, nextMatchError } = useActivities({
    params: { isNextMatch: true },
    enabled: true,
  });

  if (nextMatchLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader size={100} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-inter">
      <div className="container mx-auto">
        <HeroSection nextMatch={nextMatch || null} />

        <NextMatch nextMatch={nextMatch} error={nextMatchError} />

        <PartnersBanner />
      </div>
    </div>
  );
};

export default Home;
