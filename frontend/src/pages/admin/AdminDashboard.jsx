import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { adminDashboard } from "../../api/adminApi";
import { Users, FileText, Eye, Menu } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, gradient }) => (
  <div
    className={`
      relative overflow-hidden rounded-2xl p-6
      bg-gradient-to-br ${gradient}
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
      <h1 className="text-3xl font-bold mb-8 tracking-tight">
        Dashboard Overview
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Users" value={stats.totalUsers} icon={Users}
          gradient="from-indigo-600 via-indigo-700 to-indigo-900" />

        <StatCard title="Total Blogs" value={stats.totalBlogs} icon={FileText}
          gradient="from-emerald-600 via-emerald-700 to-emerald-900" />

        <StatCard title="Total Views" value={stats.totalViews} icon={Eye}
          gradient="from-amber-500 via-orange-600 to-red-700" />
      </div>
    </>
  );
};

export default AdminDashboard;
