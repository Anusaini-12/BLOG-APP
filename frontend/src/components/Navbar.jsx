import logo from '../assets/pixi-logo.png';
import { useAuth } from "../context/AuthContext";
import { Link } from 'react-router-dom';
import "../index.css";
import profile from "../assets/user.png"
import { useState } from 'react';

const Navbar = () => {
 
  const {user, logout} = useAuth();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
    {/* <nav className="text-white w-full bg-gradient-to-l from-pink-900/70 via-sky-800/70 to-slate-900/70 backdrop-blur-sm shadow-xl/30 rounded-full flex justify-between items-center p-4 md:p-5"> */}
    <nav className="relative z-[9999] text-white w-full bg-black/20 backdrop-blur-sm flex justify-between items-center p-4 md:p-5">
      
      <div className="logo ml-4 md:ml-12">
         <img src={logo} alt="logo" className='w-16 md:w-20 absolute left-0 top-0 ml-4 md:ml-12'/>
          <h1 className="hidden md:block text-4xl text-pink-600 font-extrabold ml-10">Pixi</h1>
      </div >
     
      <div className="hidden md:flex items-center gap-6 mr-10 text-sm md:text-md">
        <Link 
         to="/"
         className="px-3 py-2 rounded-lg hover:bg-white/20 transition"
        >
          Home
        </Link>

        <Link 
         to="/about"
         className="px-3 py-2 rounded-lg hover:bg-white/20 transition"
         >
          About
        </Link>

        <Link 
         to="/blogs"
         className="px-3 py-2 rounded-lg hover:bg-white/20 transition"
        >
          Blogs
        </Link>

        <Link
          to={user ? "/create" : "/register"}
          className="px-3 py-2 rounded-lg hover:bg-white/20 transition"
        >
          Write
        </Link>
              
        {/*NOT LOGGED IN */}
        {!user && (
          <>
            <Link
             to="/login"
             className="px-3 py-2 rounded-lg hover:bg-white/20 transition"
             >
              Log in
            </Link>

            <Link
              to="/register"
              className="bg-white text-black font-bold px-4 py-2 rounded-full ml-5"
            >
              Get Started
            </Link>
          </>
        )}

        {/* 🔹 LOGGED IN */}
        {/* PROFILE DROPDOWN */}
          {user && (
            <div className="relative">
              <img
                src={user.profile || profile}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover cursor-pointer ring-2 ring-transparent hover:ring-pink-500 transition"
                onClick={() => setProfileOpen(!profileOpen)}
              />

              <div
                className={`absolute top-17 right-0 w-48 bg-pink-700/20 border border-white/10 rounded-xl shadow-2xl py-2 transition-all duration-200 transform origin-top-right ${
                  profileOpen
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                <div className="px-4 py-2 border-b border-white/10 mb-2">
                  <p className="text-sm font-bold text-white">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setProfileOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition"
                >
                  <i className="fa-solid fa-user mr-2"></i> Profile
                </Link>

                {user && user.email === "serene112003@gmail.com" && (
                <Link 
                  to="/admin"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition"
                >
                 <i className="fa-solid fa-crown mr-2"></i> Admin
                </Link>
                )}

                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition"
                >
                  <i className="fa-solid fa-right-from-bracket mr-2"></i> Logout
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          className="md:hidden text-lg mr-6"
          onClick={() => setMobileMenu(true)}
        >
         <i className="fa-solid fa-bars hover:scale-[1.08] cursor-pointer transition"></i>
        </button>
    </nav>

    {/* MOBILE */}
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-black/30 backdrop-blur-lg text-white px-6 py-10
      transform transition-transform duration-300 z-[99999]
      ${mobileMenu ? "translate-x-0" : "-translate-x-full"}`}
    >
      <h1 className="sidebar-logo text-4xl text-pink-600 font-extrabold mb-3">Pixi</h1>
      <div className="h-[2px] w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 mb-12" />

      <div className="flex flex-col gap-4 text-md">
        <Link 
         to="/" 
         onClick={() => setMobileMenu(false)}
         className="px-3 py-2 rounded-lg hover:bg-white/20 transition"
        >
         <i className="fa-solid fa-house mr-5"></i>
         Home
        </Link>

        <Link 
         to="/about" 
         onClick={() => setMobileMenu(false)}
         className="px-3 py-2 rounded-lg hover:bg-white/20 transition"
        >
         <i className="fa-solid fa-clipboard-list mr-5"></i>
         About
        </Link>
        
        <Link 
         to="/blogs" 
         onClick={() => setMobileMenu(false)}
         className="px-3 py-2 rounded-lg hover:bg-white/20 transition"
        >
         <i className="fa-solid fa-blog mr-5"></i>
         Blogs
        </Link>

        <Link 
          to={user ? "/create" : "/register"} 
          onClick={() => setMobileMenu(false)}
          className="px-3 py-2 rounded-lg hover:bg-white/20 transition"
         >
          <i className="fa-regular fa-pen-to-square mr-5"></i>
          Write
        </Link>


        {!user ? (
        <>
         <Link
          to="/login"
          onClick={() => setMobileMenu(false)}
          className="px-3 py-2 rounded-lg hover:bg-white/20 transition"
         >
          <i className="fa-solid fa-unlock mr-4"></i> Login
         </Link>
        </>
        ) : (
        <>
         <Link 
          to="/profile" 
          onClick={() => setMobileMenu(false)}
          className="px-3 py-2 rounded-lg hover:bg-white/20 transition"
         >
           <i className="fa-solid fa-user mr-4"></i> Profile
         </Link>
        
         {user && user.email === "serene112003@gmail.com" && (
         <Link 
           to="/admin"
           className="px-3 py-2 rounded-lg hover:bg-white/20 transition"
         >
          <i className="fa-solid fa-user-shield"></i> Admin
         </Link>
          )}

        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mt-2" />
           <button
             onClick={logout}
             className="flex items-center gap-1 text-md font-bold px-3 py-2 rounded-lg
             hover:bg-red-500/10 text-red-500 transition"
           > 
             <i className="fa-solid fa-right-from-bracket mr-2"></i>
              Logout
           </button>
         </>
         )}
        </div>

        
        {/* CLOSE BUTTON */}
        <button
          className="absolute top-10 right-4 text-2xl"
          onClick={() => setMobileMenu(false)}
        >
          <i className="fa-solid fa-xmark hover:scale-[1.1] cursor-pointer transition"></i>
        </button>
    </div>

    {mobileMenu && (
      <div
        className="fixed inset-0 z-40"
        onClick={() => setMobileMenu(false)}
      ></div>
    )}
    </>
  );
};

export default Navbar;

