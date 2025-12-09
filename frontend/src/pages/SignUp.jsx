import { useState } from 'react';
import logo from '../assets/pixi-logo.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader.jsx';
import { registerUser } from '../api/authApi.js';
import { useToast } from '../context/ToastContext.jsx';

const SignUp = () => {
  
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const toast = useToast();
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData, 
      [e.target.name]: e.target.value
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(loading) return;
    setLoading(true);

    if(!formData.name.trim()){
      toast.error("Please enter your name.", { id: "name-error" });
      setLoading(false);
      return;
    }

    if(!formData.email.trim()){
      toast.error("Please enter your email.", { id: "email-error" });
      setLoading(false);
      return;
    }

    if(!formData.password.trim()){
      toast.error("Password is required.", { id: "pass-error" });
      setLoading(false);
      return;
    }

    const passCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_]).{8,}$/;
    if (!passCheck.test(formData.password)) {
      toast.error(
        "Password must contain a-z, A-Z, 0-9, '_' and be 8+ characters long.",
        { id: "pass-format-error" },
      );
        setLoading(false);
        return;
    }

    try{
      const data = await registerUser(formData);
      toast.success(data.message || "Registration successful!", { id: "register-success" });
      setTimeout(() => navigate("/verify-otp", { state: { email: formData.email } }), 800);
      
    } catch (err){
      toast.error(err.response?.data?.message || "Something went wrong.", { id: "register-fail" });

    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-tr from-pink-950 via-sky-800 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full bg-black/20 backdrop-blur-sm max-w-5xl shadow-xl/30 rounded-3xl overflow-hidden grid md:grid-cols-2 md:grid-cols-2 px-10 py-20 relative">
         <img src={logo} alt="logo" className='w-30 absolute top-0 left-2'/>

        {/* LEFT SIDE */}
        <div className="py-10 text-white text-center font-extrabold flex flex-col items-center justify-center">
          <h2 className="text-3xl md:text-4xl mb-4">Welcome to <span className='text-pink-700 '>Pixi!</span></h2>
          <p className="text-md text-gray-300 font-light md:mb-10">
              Create an account and start sharing your stories today.
          </p>
          
          <p className="hidden md:flex text-md text-center text-gray-400 md:mt-20">
            Already have an account?  
          </p>

          <Link
            to="/login"
            className="hidden md:flex md:mt-6 px-8 py-2 border border-gray-300 text-gray-300 rounded-full font-semibold shadow hover:shadow-lg hover:text-sky-600 hover:bg-white transition"
          >
            Login
          </Link>
        </div>

        {/* RIGHT SIDE */}
        <div className="py-4 md:py-10 text-center flex flex-col items-center justify-center text-white">
          <h2 className="text-xl md:text-2xl text-white font-bold mb-6">Create Account</h2>

          <form onSubmit={handleSubmit} className='flex flex-col gap-1'>
            
          <div className="relative w-full mb-4">
            <i className="fa-regular fa-user absolute text-sm md:text-md left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              type="name"
              name="name"
              className="w-full text-sm md:text-base py-2 pl-10 pr-20 border border-gray-400 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-400"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full name"
            />
          </div>

          <div className="relative w-full mb-4">
            <i className="fa-regular fa-envelope absolute text-sm md:text-md left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              type="email"
              name="email"
              className="w-full text-sm md:text-base py-2 pl-10 pr-20 border border-gray-400 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-400"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
            />
          </div>

          <div className="relative w-full mb-2">
            <i className="fa-solid fa-lock absolute text-sm md:text-md left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="w-full text-sm md:text-base py-2 pl-10 pr-20 border border-gray-400 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-400"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
            />

            <i
              className={`fa-regular ${showPassword ? "fa-eye-slash" : "fa-eye"} 
              absolute right-4 top-1 -translate-y-1/2 text-sm md:text-lg text-gray-500 cursor-pointer hover:text-pink-500 mt-4`}
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          </div>

          {formData.password && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_]).{8,}$/.test(formData.password) && (
            <p className="text-red-500 text-xs md:text-sm text-left ml-4 mb-2">
              Password is incorrect.
            </p>
          )}

          <Loader loading={loading}>
              Sign up
          </Loader>
          </form>
        </div>

      </div>
    </div>
  );
};

export default SignUp
