const HeroSection = () => {
  return (
    <section
      className="relative h-96 md:h-[600px] bg-cover bg-center flex items-center justify-center text-white shadow-xl rounded-b-xl overflow-hidden"
      style={{
        backgroundImage: "url('/public/zinme.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-60"></div>
      <div className="relative z-10 text-center p-4">
        <img
          src="/public/zinme.jpg"
          alt="Team Logo"
          className="mx-auto mb-6 w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-white shadow-lg"
        />
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
          Unleash the Passion
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto drop-shadow">
          Join us in the journey of triumphs, dedication, and unforgettable
          moments.
        </p>
        <button className="bg-[#003b75] hover:bg-[#003b75] text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg">
          Latest News
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
