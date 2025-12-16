import { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../../api/adminApi";
import { useAuth } from "../../context/AuthContext";
import { Trash2, ShieldCheck, Circle, ArrowLeft } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import "../../index.css";
import { useNavigate } from "react-router-dom";
import { ConfirmDelete } from "../../components/ConfirmDelete";

const UsersPage = () => {

  const toast = useToast();
  const navigate = useNavigate();
  const { token, user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);


  useEffect(() => {
    getAllUsers(token)
      .then(setUsers)
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setLoading(false));
  }, []);

const handleDelete = async () => {
  try {
    await deleteUser(deleteId, token);
    setUsers(prev => prev.filter(u => u._id !== deleteId));
    toast.success("User deleted");
  } catch {
    toast.error("Delete failed");
  } finally {
    setDeleteId(null);
  }
};


  const ONLINE_WINDOW = 2 * 60 * 1000;

  const isOnline = (lastActive) => {
    if (!lastActive) return false;
    return Date.now() - new Date(lastActive).getTime() < ONLINE_WINDOW;
  };

  if (loading){
    return(
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <>
        <button
          onClick={() => navigate("/admin")}
          className="
            flex items-center gap-2
            px-4 py-2 mb-4 rounded-lg
            bg-white/10 hover:bg-white/20
            transition
          "
        >
          <ArrowLeft size={16} />
          Back
        </button>
        
      <h1 className="text-xl md:text-3xl font-bold p-4 tracking-tight">
        Users Management
      </h1>

      {/* TABLE WRAPPER */}
      <div
        className="
          relative overflow-x-auto rounded-2xl
          bg-gradient-to-br from-slate-800 via-slate-900 to-black
          shadow-xl no-scrollbar-table
        "
      >
        {/* glass layer */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />

        <div className="relative z-10 overflow-x-auto">
          <table className="w-full text-sm">
            {/* HEADER */}
            <thead className="bg-white/5 text-white/60">
              <tr>
                <th className="px-6 py-4 text-left font-medium">User</th>
                <th className="px-6 py-4 text-left font-medium">Role</th>
                <th className="px-6 py-4 text-left font-medium">Status</th>
                <th className="px-6 py-4 text-left font-medium">Last Active</th>
                <th className="px-6 py-4 text-right font-medium">Action</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody className="divide-y divide-white/5">
              {users.map((u) => {
                const online = isOnline(u.lastActive);

                return (
                  <tr
                    key={u._id}
                    className="
                      transition hover:bg-white/5
                    "
                  >
                    {/* USER */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">{u.name}</p>
                        <p className="text-xs text-white/50">{u.email}</p>
                      </div>
                    </td>

                    {/* ROLE */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs">
                        <ShieldCheck size={12} />
                        {u.role}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
                          online
                            ? "bg-green-500/10 text-green-400"
                            : "bg-gray-500/10 text-gray-400"
                        }`}
                      >
                        <Circle size={8} fill="currentColor" />
                        {online ? "Online" : "Offline"}
                      </span>
                    </td>

                    {/* LAST ACTIVE */}
                    <td className="px-6 py-4 text-white/50">
                      {u.lastActive
                        ? new Date(u.lastActive).toLocaleString()
                        : "—"}
                    </td>

                    {/* ACTION */}
                    <td className="px-6 py-4 text-right">
                      <button
                        disabled={
                          u.role === "admin" || u._id === currentUser?._id
                        }
                        onClick={() => setDeleteId(u._id)}
                        className="
                          p-2 rounded-lg
                          text-red-400 bg-red-500/10
                          hover:bg-red-500/20
                          transition
                          disabled:opacity-30 disabled:cursor-not-allowed
                        "
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmDelete
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete User?"
        message="This user will be permanently removed."
      />
    </>
  );
};

export default UsersPage;
