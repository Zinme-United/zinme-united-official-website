import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

type HeroSectionProps = {
  slides?: Array<{
    id: number;
    name: string;
    logo: string;
    url: string;
  }>;
};

const defaultSlides = [
  {
    id: 1,
    name: "Adidas",
    logo: "/adidas.png",
    url: "https://www.adidas.com/",
  },
  {
    id: 2,
    name: "Coca Cola",
    logo: "/coca-cola.png",
    url: "https://www.coca-cola.com/",
  },
  {
    id: 3,
    name: "EA Sports",
    logo: "/easports.png",
    url: "https://www.easports.com/",
  },
  {
    id: 4,
    name: "Nike",
    logo: "/nike.png",
    url: "https://www.nike.com/",
  },
];

const HeroSection = ({ slides = defaultSlides }: HeroSectionProps) => {
  return (
    <section className="relative rounded-xl overflow-hidden">
      <h2 className="text-4xl font-bold text-[#003b75] mb-4 text-center">
        Our Partners
      </h2>
      {/* Carousel */}
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        pagination={{ clickable: true }}
        navigation
        className="h-[280px] md:h-[300px]"
      >
        {slides.map((s, i) => (
          <SwiperSlide key={i}>
            <div
              className="relative h-[460px] md:h-[640px] bg-cover bg-center"
              style={{ backgroundImage: `url('${s.logo}')` }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroSection;
