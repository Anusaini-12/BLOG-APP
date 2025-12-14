import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-slate-900 text-white">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div
        className="relative h-full flex flex-col"
      >
        {/* MENU BAR (NOT NAVBAR) */}
        <div className="p-6 bg-slate-900/80 backdrop-blur border-b border-white/10">
            <button
              onClick={() => setSidebarOpen(prev => !prev)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20"
            >
              <Menu />
            </button>
        </div>

        {/* PAGE CONTENT */}
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default AdminLayout;
