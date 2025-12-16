import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/admin`;

// =============== GET ALL USERS ===============
export const getAllUsers = async (token) => {
  const res = await axios.get(`${API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// =============== GET ALL BLOGS ===============
export const getAllBlogs = async (token) => {
  const res = await axios.get(`${API_URL}/blogs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// =============== DELETE ONE USER ===============
export const deleteUser= async (id, token) => {
  const res = await axios.delete(`${API_URL}/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// =============== DELETE ONE BLOG ===============
export const deleteBlog = async (id, token) => {
  const res = await axios.delete(`${API_URL}/blogs/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// =============== DELETE ALL USERS ===============
export const deleteAllUsers = async (token) => {
  const res = await axios.delete(`${API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// =============== DELETE ALL BLOGS ===============
export const deleteAllBlogs = async (token) => {
  const res = await axios.delete(`${API_URL}/blogs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const adminDashboard = async(token) => {
  const res = await axios.get(`${API_URL}/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export const getBlogViewers = async (id, token) => {
  const res = await axios.get(
    `${API_URL}/${id}/viewers`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

