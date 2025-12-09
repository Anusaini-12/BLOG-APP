import { motion } from "motion/react";
import { Sparkles, Users, Feather, Zap, ArrowRight, Heart } from "lucide-react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-bl from-pink-950 via-sky-800 to-slate-900 text-white overflow-hidden relative">

      {/* Sticky Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      <div className="relative pt-32 pb-12 px-6">

        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-pink-300 text-sm font-medium mb-6 backdrop-blur-md">
            <Sparkles size={14} />
            <span>Redefining Community Blogging</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 drop-shadow-2xl">
            More Than Just <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-sky-400">
              Another Blog
            </span>
          </h1>

          <p className="text-sm md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            A personal workspace turned digital sanctuary. Where ideas flow,
            stories connect, and creativity finds its home.
          </p>
        </motion.section>

        {/* Core Values Grid */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-24"
        >
          <Card
            icon={<Feather className="text-pink-400" size={32} />}
            title="The Origin"
            description="Started as a simple documentation of my coding journey, this space evolved into a canvas for thoughts, failures, and triumphs."
          />

          <Card
            icon={<Users className="text-sky-400" size={32} />}
            title="The Community"
            description="It's not just about me. It's about us. A platform where every voice matters, from beginner developers to seasoned storytellers."
          />

          <Card
            icon={<Zap className="text-purple-400" size={32} />}
            title="The Vision"
            description="To build a positive, meaningful corner of the internet where writing feels natural and knowledge is shared freely."
          />
        </motion.section>

        {/* Manifesto Section */}
        <section className="max-w-5xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl md:text-4xl font-bold mb-6 text-white">
                  Everyone Has a <span className="text-pink-400">Story</span>
                </h2>

                <p className="text-slate-300 text-lg leading-relaxed mb-6">
                  Whether you are a developer debugging your first React app, a
                  student exploring new worlds, or a dreamer with a notebook full
                  of ideas — <strong className="text-sky-300">you belong here.</strong>
                </p>

                <p className="text-slate-400 leading-relaxed">
                  We believe in the power of shared knowledge. When you share your
                  perspective, you light the path for someone else walking in the
                  dark.
                </p>
              </div>

              {/* Visual Decoration */}
              <div className="w-full md:w-1/3 flex justify-center">
                <div className="relative w-48 h-48">
                  <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-full blur-3xl opacity-40 animate-pulse" />
                  
                  <div className="relative bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl w-full h-full flex items-center justify-center transform rotate-6 hover:rotate-0 transition-all duration-500">
                    <Heart size={64} className="text-pink-500 drop-shadow-lg" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
            Ready to share your voice?
          </h2>

          <p className="text-slate-300 mb-8 text-lg">
            Join the movement. Start writing, start connecting.
          </p>

          <motion.a
            href="/create"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative inline-flex items-center justify-center px-8 py-4 bg-white text-slate-900 text-lg font-bold rounded-full overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Writing Now{" "}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </span>

            <div className="absolute inset-0 bg-gradient-to-r from-pink-200 to-sky-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.a>
        </motion.section>
      </div>

      <Footer />
    </div>
  );
}

// Reusable Glass Card Component
function Card({ icon, title, description }) {
  return (
    <motion.div
      variants={itemVariants}
      className="group p-8 rounded-3xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-pink-500/30 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2"
    >
      <div className="mb-6 p-4 bg-black/30 rounded-2xl inline-block group-hover:scale-110 transition-transform duration-300 border border-white/5">
        {icon}
      </div>

      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-pink-300 transition-colors">
        {title}
      </h3>

      <p className="text-slate-400 leading-relaxed text-sm">
        {description}
      </p>
    </motion.div>
  );
}
