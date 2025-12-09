import { useState } from "react";
import Loader from "../components/Loader";
import { forgotPassword } from "../api/authApi";
import { useToast } from "../context/ToastContext";

const ForgotPassword = () => {
  
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    if (!email) {
      setLoading(false);
      toast.error("Email is required!", { id: "forgot-email" });
      return;
    }
    

    try {
      const data = await forgotPassword(email);
      setMessage(data.message);
      setError(false);
      toast.success(data.message, { id: "forgot-success" });

    } catch (err) {
      setMessage(err.response?.data?.message);
      setError(true);
      toast.error(err.response?.data?.message || "Something went wrong.", { id: "forgot-error" });

    } finally {
      setLoading(false);
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-pink-950 via-sky-800 to-slate-900 flex items-center justify-center p-6">
      <div className="bg-black/20 backdrop-blur-sm shadow-lg rounded-3xl p-8 w-full max-w-md flex flex-col justify-center px-10">
        <h1 className="text-xl md:text-2xl font-bold text-white mt-4 mb-8 text-center">
          Forgot Password?
        </h1>

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium text-sm md:text-base text-gray-300 ml-2">
            Email Address <span className="text-red-600 text-md">*</span>
          </label>
       
        <div className="relative w-full mb-4">
        <i className="fa-regular fa-envelope absolute text-md left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>

        <input
         type="email"
         className="w-full py-2 pl-10 pr-10 text-sm text-gray-100 md:text-base border border-gray-400 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-400"
         value={email}
         onChange={(e) => setEmail(e.target.value)}
         placeholder="Enter your email"
        />
        </div>

        {message && (
          <p
            className={`text-center mt-3 text-sm md:text-md ${
              error ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}

        <Loader loading={loading}>
          Send Reset Link
        </Loader>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword
