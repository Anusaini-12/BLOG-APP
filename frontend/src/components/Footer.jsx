import { Github, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-black/20 backdrop-blur-xl border-t border-white/10 pt-16 pb-8 mt-20">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 text-white/70">

        {/* Column 1 */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">Pixi Blog</h3>
          <p className="text-sm leading-relaxed">
            A space for creativity, code, and community. Built with passion to
            connect minds from around the world.
          </p>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
          <ul className="text-sm space-y-2">
            <li>
              <Link to="/" className="hover:text-pink-400 transition">Home</Link>
            </li>
            <li>
              <Link to="/create" className="hover:text-pink-400 transition">Write a story</Link>
            </li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">Connect</h3>
          <div className="flex gap-4">
            <a href="#" className="hover:text-pink-400 transition">
              <Twitter size={20} />
            </a>
            <a href="#" className="hover:text-pink-400 transition">
              <Github size={20} />
            </a>
            <a href="#" className="hover:text-pink-400 transition">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-12 pt-8 border-t border-white/5 text-center text-sm text-white/40">
        <p>© {year} Pixi — Built with ❤️ & Creativity</p>
      </div>
    </footer>
  );
}

