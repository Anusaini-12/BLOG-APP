import { useEffect, useState } from "react";
import { getAllBlogs, deleteBlog } from "../../api/adminApi";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { ArrowLeft, Trash2 } from "lucide-react";
import "../../index.css";
import { useNavigate } from "react-router-dom";
import { ConfirmDelete } from "../../components/ConfirmDelete";

const BlogsPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null); 
  const [deletingId, setDeletingId] = useState(null);

  const openDeleteModal = (id) => setDeleteId(id);  

  // Fetch blogs from API
  const fetchBlogs = async () => {
    try {
      const res = await getAllBlogs(token);
      setBlogs(Array.isArray(res) ? res : res.data || []);
    } catch (err) {
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  // Delete blog
const handleDelete = async () => {
  if (!deleteId) return;

  setDeletingId(deleteId);
  try {
    await deleteBlog(deleteId, token);
    setBlogs((prev) => prev.filter((b) => b._id !== deleteId));
    toast.success("Blog deleted successfully");
  } catch (err) {
    console.error(err);
    toast.error("Delete failed");
  } finally {
    setDeletingId(null);
    setDeleteId(null);
  }
};

  useEffect(() => {
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen">
        <button
          onClick={() => navigate("/admin")}
          className="
            flex items-center gap-2
            px-4 py-2 mb-10 rounded-lg
            bg-white/10 hover:bg-white/20
            transition
          "
        >
          <ArrowLeft size={16} />
          Back
        </button>
      <h1 className="text-xl md:text-3xl font-bold mb-6 text-white tracking-tight">
        All Blogs
      </h1>

      {/* TABLE WRAPPER */}
      <div className="relative overflow-x-auto rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-black shadow-xl relative no-scrollbar-table">
        {/* glass layer */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-md rounded-2xl" />

        <div className="relative z-10 overflow-x-auto">
          {blogs.length > 0 ? (
            <table className="w-full text-sm text-white">
              {/* HEADER */}
              <thead className="bg-white/10 text-white/60">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">Title</th>
                  <th className="px-6 py-3 text-left font-medium">Author</th>
                  <th className="px-6 py-3 text-left font-medium">Category</th>
                  <th className="px-6 py-3 text-left font-medium">Date</th>
                  <th className="px-6 py-3 text-right font-medium">Action</th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody className="divide-y divide-white/5">
                {blogs.map((b) => (
                  <tr key={b._id} className="transition hover:bg-white/5">
                    <td className="px-6 py-4">{b.title}</td>
                    <td className="px-6 py-4">{b.author?.name || "Unknown"}</td>
                    <td className="px-6 py-4">{b.category || "Uncategorized"}</td>
                    <td className="px-6 py-4 text-white/50">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openDeleteModal(b._id)}
                        disabled={deletingId === b._id}
                        className="p-2 rounded-lg text-red-400 bg-red-500/10 hover:bg-red-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-white/50 p-6">
              No blogs found.
            </p>
          )}
        </div>
      </div>
    </div>
<ConfirmDelete
  open={!!deleteId}
  onClose={() => setDeleteId(null)}
  onConfirm={handleDelete}
  title="Delete Blog?"
  message="This blog will be permanently removed."
/>
  </>
  );
};

export default BlogsPage;
