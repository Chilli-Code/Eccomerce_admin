import { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";

export default function Layout({ children, dark, onToggleDark, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="h-dvh bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <Sidebar open={sidebarOpen} onLogout={onLogout} />
      <div
        style={{ marginLeft: sidebarOpen ? "var(--sidebar-width)" : "0px" }}
        className="flex flex-col h-dvh transition-all duration-300"
      >
        <Topbar dark={dark} onToggleDark={onToggleDark} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}