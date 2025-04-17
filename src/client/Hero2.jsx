import { FaPhone } from "react-icons/fa";
import { CiCircleChevDown } from "react-icons/ci";
import { CallButton } from "./buttons";
import { BarangayServices } from "./constant/index";

// Import images
import fire from "../assets/fireHydrant.svg";
import police from "../assets/policeshield.svg";
import medic from "../assets/medicshield.svg";

const Hero2 = () => {
  // Create an image mapping object for easier access
  const imageMap = {
    fireHydrant: fire,
    policeshield: police,
    medicshield: medic,
  };

  return (
    <section id="hero2" className="hero2 py-20 w-full">
      <div className="screen-max-width mx-auto px-4 sm:px-6 lg:px-8 relative h-full">
        <h2 className="text-6xl font-karla font-bold text-center m-16 text-white">
          Barangay Services
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {BarangayServices.map((service) => (
            <div
              key={service.id}
              className="flex flex-col items-center text-center"
            >
              <img
                src={imageMap[service.img]}
                alt={service.name}
                className="w-28 h-28 md:w-36 md:h-36 lg:w-48 lg:h-48 mb-6 transition-all duration-300"
              />
              <h3 className="text-2xl font-karla font-bold mb-6 text-white text-shadow-lg/30">
                {service.name}
              </h3>
              <CallButton
                label={service.buttonLabel}
                icon={<FaPhone />}
                onClick={() => window.open(`tel:${service.phoneNumber}`)}
              />
            </div>
          ))}
        </div>

        {/* Scroll Down Arrow */}
        <div className="absolute lg:top-[75vh] left-1/2 transform -translate-x-1/2 animate-bounce">
          <a href="#hero3" className="text-white text-4xl">
            <CiCircleChevDown />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero2;
