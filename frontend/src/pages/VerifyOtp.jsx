import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resendOtp, verifyOtp } from "../api/authApi.js";
import Loader from "../components/Loader";
import { BadgeCheck } from 'lucide-react';
import { useToast } from "../context/ToastContext.jsx";

const VerifyOtp = () => {
   
  const toast = useToast();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  const inputsRef = useRef([]);
  const navigate = useNavigate();

  const handleChange = (value, index) => {

    if (!/^\d*$/.test(value)) return;
    setOtp((prev) => {
      const newOtp = [...prev];
      newOtp[index] = value;
      return newOtp;
    });

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  useEffect(() => {
    if (!success) {
    inputsRef.current[0]?.focus();
  }
  }, [success]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      return toast.error("Enter all 6 digits", { id: "otp-error" });
    }
    console.log("OTP PAGE EMAIL:", email);

    setLoading(true);
    try {
      const data = await verifyOtp({email, code: otpValue});
      setMessage(data.message);
      setSuccess(true);

      toast.success(data.message, { id: "login-success" });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP", { id: "invalid-otp" });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await resendOtp(email);
      toast.success("OTP resent successfully!", { id: "resend-success" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not resend OTP", { id: "verify-fail" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-pink-950 via-sky-800 to-slate-900 p-2">

      <div className="w-full max-w-md bg-black/20 backdrop-blur-sm rounded-3xl shadow-xl py-16 px-10 text-white">

        {/* SUCCESS UI */}
        {success ? (
          <div className="flex flex-col items-center text-center">

            <BadgeCheck className="w-20 h-20 text-green-500 mb-6 animate-badge-success" />

            <h1 className="text-2xl md:text-3xl font-bold mb-1">Successful!</h1>

            <p className="text-gray-300 text-sm md:text-base mb-10">
              {message}
            </p>

            <p className="text-gray-400 text-xs">
              Redirecting to login...
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">Verify OTP</h2>

            <p className="text-gray-300 text-sm sm:text-base text-center mb-6">
              Enter the 6-digit OTP sent to <span className="font-semibold">{email}</span>
            </p>

            {/* OTP 6 BOX INPUT UI */}
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3">
              <div className="flex gap-3 md:gap-5">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputsRef.current[idx] = el)}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    className="w-8 h-10 sm:w-12 sm:h-12 rounded-lg bg-white/20 
                    border border-gray-400 text-center text-lg md:text-2xl font-bold 
                    text-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                ))}
              </div>

              <Loader loading={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </Loader>

            </form>

            {/* RESEND OPTION */}
            <div className="mt-6 text-center">
              <p className="text-gray-300 text-sm sm:text-base">Didn't receive the code?</p>
              <button
                onClick={handleResend}
                disabled={loading}
                className="text-pink-500 font-bold hover:underline cursor-pointer hover:text-pink-400 text-sm sm:text-base"
              >
                Resend OTP
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default VerifyOtp;
