"use client";

import { ArrowRight } from "lucide-react"; // Using Arrow icon for button
import Link from "next/link"; // Importing Link from Next.js
import { BiRfid } from "react-icons/bi"; // Using RFID icon

const HomePage = () => {
  const login = localStorage.getItem("user-info");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 via-blue-500 to-blue-800  overflow-hidden p-6">
      <div className="max-w-6xl w-full flex flex-col-reverse md:flex-row items-center justify-between px-6 py-12 bg-transparent shadow-lg rounded-xl border-2 border-white bg-opacity-20 backdrop-blur-md">
        {/* Left side content */}
        <div className="text-white space-y-4 max-w-lg text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight">
            Welcome to{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-900 uppercase">
              RFidWare
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg">
            Radio Frequency Identification System for Warehouse Management
          </p>

          {/* Button inside Left Side Content */}
          <div className="mt-6 flex justify-center md:justify-start">
            <Link
              href="/dashboard"
              className="flex items-center px-6 py-3 bg-white text-blue-700 rounded-lg shadow-md hover:shadow-2xl hover:scale-105 transition-all duration-300 transform group"
            >
              <span className="font-semibold tracking-wide">
                {login ? "Go to Dashboard" : "Get Started"}
              </span>
              <ArrowRight className="ml-3 h-6 w-6 transition-transform transform group-hover:translate-x-2" />
            </Link>
          </div>
        </div>

        {/* Right side RFID Icon */}
        <div className="w-full flex justify-center max-w-sm mt-8 md:mt-0">
          <BiRfid className="h-48 sm:h-60 w-48 sm:w-60 text-white rounded-lg p-4 bg-gradient-to-r from-blue-700 to-blue-900 shadow-2xl transform transition duration-500 hover:scale-105" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
