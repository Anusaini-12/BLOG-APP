import { useEffect, useState } from "react";
import { getAllBlogs, deleteBlog } from "../../api/adminApi";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const BlogsPage = () => {
  const { token } = useAuth();
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
    try {
      const res = await getAllBlogs(token);
      setBlogs(res.data);
    } catch (err) {
      toast.error("Failed to load blogs");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this blog?")) return;

    await deleteBlog(id, token);
    toast.success("Blog deleted");
    setBlogs((prev) => prev.filter((b) => b._id !== id));
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">All Blogs</h1>

      <table className="w-full border">
        <thead>
          <tr className="border bg-gray-200">
            <th className="p-2">Title</th>
            <th>Author</th>
            <th>Category</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {blogs.map((b) => (
            <tr key={b._id} className="border">
              <td className="p-2">{b.title}</td>
              <td>{b.author?.name}</td>
              <td>{b.category}</td>
              <td>{new Date(b.createdAt).toLocaleDateString()}</td>

              <td>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(b._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
};

export default BlogsPage;
