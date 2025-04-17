import logo1 from "../assets/bacoor-logo.svg";
import logo2 from "../assets/bacoor-logo2.svg";
import logo3 from "../assets/BSERS-logo.svg";
import { CiCircleChevUp } from "react-icons/ci";

const Hero4 = () => {
  return (
    <section
      id="hero4"
      className="hero4 py-20 text-white relative bg-gradient-to-b from-gray-800 to-black"
    >
      <div className="screen-max-width mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-karla font-bold text-center mb-12">
          Barangay Dulong Bayan
        </h2>

        <div className="flex flex-col md:flex-row">
          {/* First column - Logos */}
          <div className="md:w-1/3 flex flex-col items-center justify-center space-y-8 mb-10 md:mb-0">
            <img
              src={logo1}
              alt="Bacoor Logo"
              className="max-w-[200px] h-auto"
            />
            <img
              src={logo2}
              alt="Bacoor Logo 2"
              className="max-w-[200px] h-auto"
            />
            <img
              src={logo3}
              alt="BSERS Logo"
              className="max-w-[200px] h-auto"
            />
          </div>

          {/* Divider */}
          <div className="md:w-[1px] w-full md:h-auto h-[1px] bg-white/80 md:mx-8 my-8 md:my-0"></div>

          {/* Second column - Mission & Vision */}
          <div className="md:w-1/2 flex flex-col justify-center space-y-10">
            <div>
              <h3 className="text-2xl text-zinc-950 font-karla font-bold mb-4">Mission:</h3>
              <p className="text-lg text-zinc-950 font-inter leading-relaxed">
                To institute good governance, promote culture, trade and
                investment in the City, through modern technology towards a safe
                and sound environment.
              </p>
            </div>

            <div>
              <h3 className="text-2xl text-zinc-950 font-karla font-bold mb-4">Vision:</h3>
              <p className="text-lg text-zinc-950 font-inter leading-relaxed">
                To institute good governance, promote culture, trade and
                investment in the City, through modern technology towards a safe
                and sound environment.
              </p>
            </div>
          </div>
        </div>

        {/* Scroll Up Arrow - Goes back to top */}
        <div className="absolute lg:top-[75vh] bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <a href="#hero1" className="text-white text-4xl">
            <CiCircleChevUp />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero4;
