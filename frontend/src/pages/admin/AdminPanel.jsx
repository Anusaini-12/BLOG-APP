import { useState } from "react";
import { useToast } from "../../context/ToastContext";
import axios from "axios";


const AdminPanel = () => {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);

  const deleteAllUsers = async () => {
    if (!window.confirm("Are you sure you want to delete ALL users?")) return;

    const API_URL = import.meta.env.VITE_API_URL;

    try {
      setLoading(true);
      await axios.delete(`${API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      success("All users deleted!");
    } catch (err) {
      error(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const deleteAllBlogs = async () => {
    if (!window.confirm("Are you sure you want to delete ALL blogs?")) return;

    try {
      setLoading(true);
      await axios.delete(`${API_URL}/api/admin/blogs`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      success("All blogs deleted!");
    } catch (err) {
      error(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-5">Admin Dashboard</h1>

      <div className="flex gap-4">
        <button
          onClick={deleteAllUsers}
          disabled={loading}
          className={`bg-red-600 text-white px-4 py-2 rounded ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Processing..." : "Delete All Users"}
        </button>

        <button
          onClick={deleteAllBlogs}
          disabled={loading}
          className={`bg-red-600 text-white px-4 py-2 rounded ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Processing..." : "Delete All Blogs"}
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
