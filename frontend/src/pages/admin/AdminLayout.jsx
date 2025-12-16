import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="
            fixed top-6 left-6 z-40
            p-2 rounded-lg
            bg-white/10 backdrop-blur
            hover:bg-white/20 transition
          "
        >
          <Menu />
        </button>
      )}
      
        <div className="h-screen overflow-y-auto px-2 md:px-25 py-24 md:py-8">
          <Outlet />
        </div>
      </div>
  );
};
export default AdminLayout;
