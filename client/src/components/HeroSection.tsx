import { Link } from "react-router";

const HeroSection = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/zinme-group-photo.jpg')" }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-primary-dark" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-6">
        {/* Club crest */}
        <img
          src="/ZMUTD Official.png"
          alt="Zinme United FC Crest"
          className="w-[60px] md:w-[80px] lg:w-[100px] h-auto mb-6 drop-shadow-lg"
        />

        {/* Club name */}
        <p className="text-sm md:text-base uppercase tracking-[0.3em] text-accent font-semibold mb-4">
          Zinme United FC
        </p>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight drop-shadow-lg mb-5 max-w-4xl">
          Welcome to the Home of Zinme United
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl mb-10 text-gray-200 max-w-xl mx-auto leading-relaxed">
          Join us for triumphs, dedication, and unforgettable moments on and off
          the pitch.
        </p>

        {/* CTA button */}
        <Link
          to="/players"
          className="inline-block bg-accent text-primary font-bold py-3 px-8 rounded-full text-base hover:bg-white hover:text-primary transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          View Squad
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
