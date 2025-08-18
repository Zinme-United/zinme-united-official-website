import ClipLoader from "react-spinners/ClipLoader";
import { HeroSection, NextMatch } from "../../components";
import useActivities from "../../hooks/useActivities";

import PartnersBanner from "../../components/PartnersBanner";

const Home = () => {
  const { nextMatch, nextMatchLoading, nextMatchError } = useActivities({
    params: { isNextMatch: true },
    enabled: true,
  });

  if (nextMatchLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#003b75" loading={nextMatchLoading} size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-inter">
      <div className="container mx-auto p-6 md:p-10">
        <HeroSection nextMatch={nextMatch || null} />

        <NextMatch nextMatch={nextMatch} error={nextMatchError} />

        <PartnersBanner />
      </div>
    </div>
  );
};

export default Home;
