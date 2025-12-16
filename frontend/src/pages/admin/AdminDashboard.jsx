import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { adminDashboard } from "../../api/adminApi";
import { Users, FileText, Eye, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const StatCard = ({ title, value, icon: Icon, gradient, onClick }) => (
  <div
    onClick={onClick}
    className={`
      cursor-pointer focus:outline-none focus:ring-2 
      focus:ring-white/30 relative overflow-hidden 
      rounded-2xl p-6 bg-gradient-to-br ${gradient}
      shadow-lg transition-all duration-300
      hover:-translate-y-1 hover:scale-[1.02]
    `}
  >
    <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />

    <div className="absolute right-4 top-4 opacity-20">
      <Icon size={72} />
    </div>

    <div className="relative z-10">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-white/10 border border-white/10">
          <Icon size={22} className="text-white" />
        </div>
        <h2 className="text-xs uppercase tracking-widest text-white/70">
          {title}
        </h2>
      </div>

      <p className="mt-5 text-4xl font-semibold text-white">
        {value}
      </p>
    </div>
  </div>
);

const AdminDashboard = () => {
  
  const navigate = useNavigate();
  const { token } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBlogs: 0,
    totalViews: 0,
  });

  useEffect(() => {
    adminDashboard(token).then(setStats);
  }, []);

  return (
    <>
      <div className="w-40 mt-auto mb-14">
        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-pink-600 to-indigo-600"
        >
          <ArrowLeft size={18} />
            Back to Site
        </Link>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold mb-8 tracking-tight">
        Dashboard Overview
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Users" value={stats.totalUsers} icon={Users}
          gradient="from-indigo-600 via-indigo-700 to-indigo-900" 
          onClick={() => navigate("/admin/users")}
        />

        <StatCard title="Total Blogs" value={stats.totalBlogs} icon={FileText}
          gradient="from-emerald-600 via-emerald-700 to-emerald-900" 
          onClick={() => navigate("/admin/blogs")}
        />

      </div>
    </>
  );
};

export default AdminDashboard;
