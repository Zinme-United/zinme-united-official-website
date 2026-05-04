export const mainSponsor = {
  name: "Meeting Point",
  logo: "/meeting_poing.jpg",
  url: "#",
};

export const coSponsors = [
  { name: "Trust 8", logo: "/trust_8.jpg", url: "#" },
  { name: "Time On You", logo: "/time_on_you.jpg", url: "#" },
  { name: "Marco Paing", logo: "/marco_paing.jpg", url: "#" },
];

const PartnersBanner = () => {
  return (
    <section className="my-12 border-t border-gray-100 pt-12">
      <div className="text-center mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-1">
          Proudly Supported By
        </p>
        <h2 className="text-3xl md:text-4xl font-extrabold text-primary">
          Our Sponsors
        </h2>
      </div>

      {/* Main Sponsor */}
      <div className="mb-8">
        <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">
          Main Sponsor
        </p>
        <a
          href={mainSponsor.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 flex items-center justify-center max-w-md mx-auto hover:shadow-lg transition-shadow duration-300"
        >
          <img
            src={mainSponsor.logo}
            alt={mainSponsor.name}
            className="max-h-28 md:max-h-36 object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
          />
        </a>
      </div>

      {/* Co-Sponsors */}
      <div>
        <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">
          Co-Sponsors
        </p>
        <div className="grid grid-cols-3 gap-4 md:gap-6 max-w-2xl mx-auto">
          {coSponsors.map((sponsor) => (
            <a
              key={sponsor.name}
              href={sponsor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 md:p-6 flex items-center justify-center hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={sponsor.logo}
                alt={sponsor.name}
                className="max-h-16 md:max-h-20 object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersBanner;
