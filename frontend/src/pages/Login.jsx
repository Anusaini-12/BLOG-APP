import { useState } from 'react';
import logo from '../assets/pixi-logo.png';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import { loginUser } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
  
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(loading) return;
    setLoading(true);

    if(!formData.email.trim()){
      toast.error("Please enter your email.", { id: "email-login-error" });
      setLoading(false);
      return;
    }

    if(!formData.password.trim()){
      toast.error("Password is required.", { id: "pass-login-error" });
      setLoading(false);
      return;
    }

    const passCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_]).{8,}$/;
    if (!passCheck.test(formData.password)) {
      toast.error(
          "Password must contain a-z, A-Z, 0-9, '_' and be 8+ characters long.",
           { id: "pass-format-error" }
      );
        setLoading(false);
        return;
    }

    try{
      const res = await loginUser(formData);
      login(res.user, res.token);

      toast.success(res.message || "Login successful!", { id: "login-success" });
      setTimeout(() => {
        navigate("/");
      }, 2000);
     
    } catch (err){
      toast.error(err.response?.data?.message || "Something went wrong.", { id: "login-fail" });

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-pink-950 via-sky-800 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full bg-black/20 backdrop-blur-sm max-w-5xl shadow-xl/30 rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2 px-14 py-20 relative">
         <img src={logo} alt="logo" className='w-30 absolute top-0 left-0'/>
        
        {/* LEFT SIDE */}
        <div className="order-2 md:order-1 md:py-10 text-center flex flex-col items-center justify-center text-white">
          <h2 className="text-xl md:text-2xl text-white font-bold mb-6">Log in to <span className='text-pink-700'>Pixi</span></h2>

          <form onSubmit={handleSubmit} className='flex flex-col gap-1 md:gap-2'>
            
          <div className="relative w-full mb-4">
            <i className="fa-regular fa-envelope absolute text-sm md:text-md left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              type="email"
              name="email"
              className="w-full py-2 pl-10 pr-20 text-sm md:text-base border border-gray-400 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-400"
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
              className="w-full py-2 pl-10 pr-20 text-sm md:text-base border border-gray-400 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-400"
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

          <Link
           to="/forgot-password"
           className='text-xs md:text-sm text-gray-300 text-left ml-4 hover:text-pink-500 cursor-pointer'>
            Forgot Password?
          </Link>

          <Loader loading={loading}>
              Login
          </Loader>
          </form>
          
          <p className="md:hidden text-md text-center text-gray-400 mt-10">
            Don't have an account yet?  
          </p>

          <Link
            to="/register"
            className="md:hidden font-semibold hover:shadow-lg text-pink-500 hover:text-pink-700 hover:underline transition"
          >
            Sign up
          </Link>
        </div>
        
        {/* RIGHT SIDE */}
        <div className="order-1 md:order-2 py-10 mt-4 text-white text-center font-extrabold flex flex-col items-center justify-center">
          <h2 className="text-2xl md:text-4xl mb-4">Welcome Back!</h2>
          <p className="text-sm md:text-md text-gray-300 font-light ">
             We're happy to see you again.<br></br> Let's get you back in!
          </p>
          
          <p className="hidden md:flex text-md text-center text-gray-400 mt-20">
            Don't have an account yet?  
          </p>

          <Link
            to="/register"
            className="hidden md:flex mt-4 px-8 py-2 border border-gray-300 text-gray-300 rounded-full font-semibold shadow hover:shadow-lg hover:text-sky-600 hover:bg-white transition"
          >
            Sign up
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login
