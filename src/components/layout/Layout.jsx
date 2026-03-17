import { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";

export default function Layout({ children, dark, onToggleDark, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar open={sidebarOpen} onLogout={onLogout} />
      <div
        style={{ marginLeft: sidebarOpen ? "var(--sidebar-width)" : "0px" }}
        className="flex flex-col min-h-screen transition-all duration-300"
      >
        <Topbar dark={dark} onToggleDark={onToggleDark} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}