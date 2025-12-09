import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { resetPassword } from "../api/authApi.js";
import Loader from "../components/Loader.jsx";
import { useToast } from "../context/ToastContext.jsx";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async(e) => {
    e.preventDefault();

    if(loading) return;
    setLoading(true);

    if (!password.trim()) {
      toast.error("Password is required!", { id: "reset-pass-empty" });
      setLoading(false);
      return;
    }

    const passCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_]).{8,}$/;
    if (!passCheck.test(password)) {
      toast.error(
        "Password must contain: a-z, A-Z, 0-9, underscore (_), and be 8+ characters.",
         { toastId: "reset-pass-invalid" }
      );
      setLoading(false);
      return;
    }

      if (password !== confirmPassword) {
       toast.error("Passwords do not match!", { id: "reset-pass-mismatch" });
       setLoading(false);
      return;
    }

    try {
      const data = await resetPassword(token, password);
      toast.success("Password reset successfully!", { id: "reset-pass-success" });
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired link.", { id: "reset-pass-error"});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-pink-950 via-sky-800 to-slate-900 text-white flex items-center justify-center p-6">
      <div className="bg-black/20 backdrop-blur-sm shadow-lg rounded-3xl p-8 w-full max-w-md flex flex-col justify-center px-10">
        <h1 className="text-xl md:text-2xl font-bold text-white mt-4 mb-8 text-center">
          Reset Password
        </h1>

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-sm md:text-base font-medium text-gray-300">
            New Password <span className="text-red-600 text-md">*</span>
          </label>

          <div className="relative w-full mb-2">
          <i className="fa-solid fa-lock absolute text-sm md:text-md left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            type={showPassword ? "text" : "password"}
            className="w-full py-2 pl-10 pr-20 text-sm md:text-base border border-gray-400 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          
          />

          <i
           className={`fa-regular ${showPassword ? "fa-eye-slash" : "fa-eye"} 
           absolute right-4 top-1/2 -translate-y-1/2 text-lg text-gray-500 cursor-pointer hover:text-pink-500`}
           onClick={() => setShowPassword(!showPassword)}
          ></i>
          </div>

          {password && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_]).{8,}$/.test(password) && (
            <p className="text-red-500 text-xs md:text-sm ml-2">
              Password must contain a-z, A-Z, 0-9, underscore (_) and be 8+ characters.
            </p>
          )}

          <label className="block mb-2 font-medium text-sm md:text-base text-gray-300 mt-6">
            Confirm Password <span className="text-red-600 text-md">*</span>
          </label>

          <div className="relative w-full mb-4">
          <i className="fa-solid fa-lock absolute text-sm md:text-md left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            type={showConfirmPassword ? "text" : "password"}
            className="w-full py-2 pl-10 pr-20 text-sm md:text-base border border-gray-400 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-400"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter password"
            
          />
          
          <i
           className={`fa-regular ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"} 
           absolute right-3 top-1/2 -translate-y-1/2 text-lg text-gray-500 cursor-pointer hover:text-pink-500`}
           onClick={() =>  setShowConfirmPassword(!showConfirmPassword)}
          ></i>
          </div>

          <Loader loading={loading}>
              {loading ? "Resetting..." : "Reset Password"}
          </Loader>
        </form>

      </div>
    </div>
  );
};

export default ResetPassword;
