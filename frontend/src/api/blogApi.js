import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

//get all posts 
export const getBlogs= async() => {
   const res = await axios.get(`${API_URL}/api/blogs`);
   return res.data;
};

//get a single post
export const getBlog = async(id) => {
   const res = await axios.get(`${API_URL}/api/blogs/${id}`);
   return res.data;
}

//create a post
export const createBlog = async (blogData, token) => {
    const res = await axios.post(`${API_URL}/api/blogs`, blogData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
}

//update a post
export const updateBlog = async (id, updateData, token) => {
   const res = await axios.put(`${API_URL}/api/blogs/${id}`, updateData, {
        headers : {
            Authorization: `Bearer ${token}`
        },
   });
   return res.data;
};

// Upload image
export const uploadImage = async (imageFile, token) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const res = await axios.post(`${API_URL}/api/upload`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

//delete a post 
export const deleteBlog = async (id, token) => {
   const res = await axios.delete(`${API_URL}/api/blogs/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
   });
   return res.data;
};

//like or unlike a post
export const toggleLike = async (id, token) => {
    const res = await axios.put(`${API_URL}/api/blogs/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
    );
    return res.data;
}

//get all comments
export const getComments = async (id) => {
    const res = await axios.get(`${API_URL}/api/blogs/${id}/comments`);
    return res.data;
}

//add a comment
export const addComment = async (id, commentData, token) => {
    const res = await axios.post(`${API_URL}/api/blogs/${id}/comments`, 
        commentData,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return res.data;
}

// update a comment
export const updateComment = async (id, commentId, updatedData, token) => {
  const res = await axios.put(
    `${API_URL}/api/blogs/${id}/comments/${commentId}`,
    updatedData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

// delete a comment
export const deleteComment = async (id, commentId, token) => {
  const res = await axios.delete(
    `${API_URL}/api/blogs/${id}/comments/${commentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};