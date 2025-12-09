import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

/* ----------- GET MY PROFILE ----------- */
export const getMyProfile = async (token) => {
  const res = await axios.get(`${API_URL}/api/profile/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

/* ----------- GET USER BY ID (for public) ----------- */
export const getUserById = async (userId) => {
  const res = await axios.get(`${API_URL}/api/profile/${userId}`);
  return res.data;
};

/* ----------- UPDATE PROFILE (name, bio only) ----------- */
export const updateProfile = async (data, token) => {
  const formData = new FormData();

  if (data.name) formData.append("name", data.name);
  if (data.bio) formData.append("bio", data.bio);
  if (data.deletePic) formData.append("deletePic", data.deletePic);
  if (data.profilePic) formData.append("profilePic", data.profilePic); // <--- must match backend field

  const res = await axios.put(`${API_URL}/api/profile/update`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

/* ----------- FOLLOW USER ----------- */
export const followUser = async (userId, token) => {
  const res = await axios.put(`${API_URL}/api/profile/follow/${userId}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

/* ----------- UNFOLLOW USER ----------- */
export const unfollowUser = async (userId, token) => {
  const res = await axios.put(`${API_URL}/api/profile/unfollow/${userId}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

/* ----------- SAVE / UNSAVE BLOG ----------- */
export const toggleSaveBlog = async (blogId, token) => {
  const res = await axios.put(`${API_URL}/api/profile/save-blog/${blogId}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
