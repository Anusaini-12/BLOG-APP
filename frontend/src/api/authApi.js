import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/user`;

export const registerUser = async (formData) => {
    const res = await axios.post(`${API_URL}/register`, formData);
    return res.data;
};

export const loginUser = async (formData) => {
   const res = await axios.post(`${API_URL}/login`, formData);
   return res.data;
};

export const verifyOtp = async({ email, code }) => {
    const res = await axios.post(`${API_URL}/verify-otp`, { email, code });
    return res.data;
}

export const resendOtp = async (email) => {
  const res = await axios.post(`${API_URL}/resend-otp`, { email });
  return res.data;
};

export const forgotPassword = async(email) => {
    const res = await axios.post(`${API_URL}/forgot-password`, { email });
    return res.data;
}

export const resetPassword = async(token, password) => {
    const res = await axios.put(`${API_URL}/reset-password/${token}`,{ password });
    return res.data;
};
