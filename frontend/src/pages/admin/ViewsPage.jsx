import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getBlogViewers } from "../../api/adminApi";
import { Eye, ArrowLeft } from "lucide-react";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const timeAgo = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  for (const i of intervals) {
    const count = Math.floor(seconds / i.seconds);
    if (count > 0) {
      return `${count} ${i.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
};

const ViewerCard = ({ user }) => {
  const viewedAt = user.viewedAt ? new Date(user.viewedAt) : null;

  return (
    <div
      className="
        relative rounded-xl
        bg-white/5 backdrop-blur
        border border-white/10
        p-4 shadow
        hover:bg-white/10 transition
      "
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="h-11 w-11 rounded-lg bg-indigo-500/20 text-indigo-300
                        flex items-center justify-center text-lg font-semibold uppercase">
          {user.name?.charAt(0) || "U"}
        </div>

        {/* Info */}
        <div className="flex-1">
          <h3 className="text-white font-medium leading-tight">
            {user.name}
          </h3>

          {viewedAt && (
            <div className="mt-1 text-xs text-white/60 flex items-center gap-2">
              <Eye size={13} />
              <span>{formatDate(viewedAt)}</span>
              <span className="text-white/30">•</span>
              <span>{timeAgo(viewedAt)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------------- MAIN PAGE ---------------- */
const ViewsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [viewers, setViewers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchViewers = async () => {
      try {
        const data = await getBlogViewers(id, token);

        // Remove duplicates (safety)
        const uniqueViewers = Array.from(
          new Map(data.viewers.map(v => [v._id, v])).values()
        );

        setViewers(uniqueViewers);
      } catch (err) {
        console.error("Failed to load viewers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchViewers();
  }, [id, token]);

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-2xl bg-white/5 animate-pulse"
          />
        ))}
      </div>
    );
  }

  /* ---------------- EMPTY ---------------- */
  if (!viewers.length) {
    return (
      <div className="text-center py-20">
        <Eye size={40} className="mx-auto text-white/30 mb-4" />
        <h2 className="text-lg font-semibold text-white">
          No Views Yet
        </h2>
        <p className="text-white/50 text-sm">
          This blog hasn’t been viewed by any user.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Blog Viewers
            <span className="ml-2 text-sm text-white/50">
              ({viewers.length})
            </span>
          </h1>
          <p className="text-sm text-white/50 mt-1">
            Users who viewed this blog
          </p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="
            flex items-center gap-2
            px-4 py-2 rounded-lg
            bg-white/10 hover:bg-white/20
            transition
          "
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      {/* Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {viewers.map(user => (
          <ViewerCard
            key={`${user._id}-${user.viewedAt}`}
            user={user}
          />
        ))}
      </div>
    </div>
  );
};

export default ViewsPage;
