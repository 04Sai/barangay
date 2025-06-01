import logo from "../assets/bacoor-logo.svg";
import { CreateAccountButton } from "./buttons";
import { CiCircleChevDown } from "react-icons/ci";

const Hero = () => {
  return (
    <section id="hero1" className="hero1 h-screen w-full">
      <div className="screen-max-width h-full w-full mx-auto relative">
        {/* Use flex-col for mobile (default) and flex-row for larger screens */}
        <div className="flex flex-col md:flex-row items-center h-full px-4 md:px-10">
          {/* Logo container - full width on mobile, 1/3 on larger screens */}
          <div className="w-full md:w-1/3 flex justify-center items-center mx-auto lg:mr-[15vh]">
            <img
              src={logo}
              alt="Bacoor Logo"
              className="max-h-[40vh] max-w-full md:max-h-[80vh] md:max-w-[50vh]"
            />
          </div>

          {/* Text container - full width on mobile, 2/5 on larger screens */}
          <div className="w-full flex justify-center items-center mt-6 md:mt-0">
            <div className="text-center justify-start sm:text-left md:text-left w-full">
              <h1 className="text-white font-karla text-3xl md:text-5xl font-bold">
                Welcome to Barangay
              </h1>
              <p className="text-gray-400 font-inter text-sm md:text-md mt-2">
                Barangay Security and Incident Reporting System
              </p>
              <p className="text-gray-400 font-inter text-sm md:text-md mt-2">
                Open Hours of Dulong Bayan BSERS: Monday to Saturday (7 AM - 5
                PM)
              </p>
              <p className="text-gray-400 font-inter text-sm md:text-md mt-2">
                brgydulongbayan1980@gmail.com / 09166221911
              </p>
              <div className="flex justify-center md:justify-start mt-5">
                <CreateAccountButton />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Down Arrow */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <a href="#hero2" className="text-white text-4xl">
            <CiCircleChevDown />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
