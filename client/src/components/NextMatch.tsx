import Button from "./Button";

const NextMatch = () => {
  return (
    <section className="my-12 bg-[#003b75] text-white p-8 rounded-xl shadow-lg text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">Next Match</h2>
      <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
        <div className="flex items-center space-x-4">
          <img
            src="/zinme.jpg"
            alt="Our Team Logo"
            className="w-20 h-20 rounded-full border-4 border-white shadow-md"
          />
          <span className="text-3xl font-bold">VS</span>
          <img
            src="/public/manu.jpeg"
            alt="Opponent Logo"
            className="w-20 h-20 rounded-full border-4 border-white shadow-md"
          />
        </div>
        <div className="text-2xl md:text-3xl font-semibold">
          <p>Zinme United Vs. Rival FC</p>
          <p>May 28, 2025 | 7:00 PM GMT+7</p>
          <p>Old Trafford</p>
        </div>
        <div className="text-5xl md:text-6xl font-extrabold bg-white text-[#003b75] px-6 py-3 rounded-xl shadow-inner">
          03:12:45:30
          <p className="text-sm font-normal mt-1 text-[#003b75]">
            Days:Hrs:Mins:Secs
          </p>
        </div>
      </div>
      <Button className="mt-8 font-bold py-3 px-8 rounded-full text-lg bg-white text-[#003b75] shadow-lg">
        Buy Tickets
      </Button>
    </section>
  );
};

export default NextMatch;
