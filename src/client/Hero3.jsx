import React from "react";
import { CiCircleChevDown } from "react-icons/ci";
import { DepartmentUnitHeads } from "./constant/index";

const Hero3 = () => {
  // Split the departments into two equal parts
  const midpoint = Math.ceil(DepartmentUnitHeads.length / 2);
  const firstHalf = DepartmentUnitHeads.slice(0, midpoint);
  const secondHalf = DepartmentUnitHeads.slice(midpoint);

  return (
    <section id="hero3" className="hero3 py-20 relative">
      <div className="screen-max-width mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-karla font-bold text-center mb-12 text-white">
          Department Unit Heads
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* First Box - Glassmorphism style */}
          <div className="backdrop-blur-md bg-white/20 rounded-lg border border-white/30 shadow-lg overflow-hidden">
            <div className="p-6 bg-blue-600/70 backdrop-blur-sm border-b border-white/30">
              <h3 className="text-xl font-karla font-bold text-white">
                Administrative Departments
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/10 backdrop-blur-sm">
                  <tr>
                    <th className="p-4 font-medium text-black">Department</th>
                    <th className="p-4 font-medium text-black">Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/20">
                  {firstHalf.map((dept) => (
                    <tr
                      key={dept.id}
                      className="hover:bg-white/10 transition-colors"
                    >
                      <td className="p-4 font-karla text-black">{dept.name}</td>
                      <td className="p-4 font-inter text-blue-900">
                        {dept.contact}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Second Box - Glassmorphism style */}
          <div className="backdrop-blur-md bg-white/20 rounded-lg border border-white/30 shadow-lg overflow-hidden">
            <div className="p-6 bg-blue-600/70 backdrop-blur-sm border-b border-white/30">
              <h3 className="text-xl font-karla font-bold text-white">
                Service Departments
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/10 backdrop-blur-sm">
                  <tr>
                    <th className="p-4 font-medium text-black">Department</th>
                    <th className="p-4 font-medium text-black">Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/20">
                  {secondHalf.map((dept) => (
                    <tr
                      key={dept.id}
                      className="hover:bg-white/10 transition-colors"
                    >
                      <td className="p-4 font-karla text-black">{dept.name}</td>
                      <td className="p-4 font-inter text-blue-900">
                        {dept.contact}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Scroll Down Arrow */}
        <div className="absolute lg:top-[75vh] bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <a href="#hero4" className="text-white text-4xl">
            <CiCircleChevDown />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero3;
