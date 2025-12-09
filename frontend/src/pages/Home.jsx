import Navbar from "../components/Navbar";
import hero from "../assets/hero.webp";
import "../index.css"
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

const Home = () => {

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${hero})` }}
    >
      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-pink-900/70 via-sky-800/70 to-slate-900/70 blur-3xl pointer-events-none"></div>

      <Navbar  className="relative z-20" />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col justify-center items-start h-[80vh] px-6 md:px-20">
        <p className="home-content text-md md:text-xl text-white mb-6 md:mb-4 font-light">✨ WELCOME TO  <span className="text-pink-500 font-bold">Pixi!</span></p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white max-w-3xl leading-tight mb-2 md:mb-6">
          Write.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-sky-400">Share.{" "}</span> 
          Inspire.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-sky-400">Repeat.{" "}</span>
        </h1>

        <p className="text-md md:text-lg text-gray-300 font-light mt-4 max-w-2xl">
          A writing platform built for creators who want to express more, learn more, and grow more.
        </p>

          <motion.a
            href="/blogs"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative inline-flex items-center justify-center mt-12 px-4 py-4 md:px-5 md:py-3 bg-white text-slate-900 text-sm md:text-lg font-bold rounded-md overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Reading{" "}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /> 
            </span>

            <div className="absolute inset-0 bg-gradient-to-r from-pink-200 to-sky-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.a>
      </div>
    </div>
  );
};

export default Home;
