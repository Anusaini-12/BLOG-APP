import { X, ArrowLeft } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <>
      {/* overlay (mobile) */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64
        bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950
        text-white p-6 border-r border-white/10
        transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-lg font-bold">Admin Panel</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded hover:bg-white/10"
          >
            <X />
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          <NavLink to="/admin" end className="px-3 py-2 rounded hover:bg-white/10">
            Dashboard
          </NavLink>

          <NavLink to="/admin/users" className="px-3 py-2 rounded hover:bg-white/10">
            Users
          </NavLink>

          <NavLink to="/admin/blogs" className="px-3 py-2 rounded hover:bg-white/10">
            Blogs
          </NavLink>
        </nav>

        <div className="mt-auto pt-6">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-pink-600 to-indigo-600"
          >
            <ArrowLeft size={18} />
            Back to Site
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
