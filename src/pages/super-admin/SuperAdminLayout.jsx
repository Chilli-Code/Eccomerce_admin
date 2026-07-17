import { useState } from "react";
import SuperAdminSidebar from "../../components/layout/SuperAdminSidebar.jsx";
import Topbar from "../../components/layout/Topbar.jsx";

export default function SuperAdminLayout({ children, dark, onToggleDark, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="h-dvh bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <SuperAdminSidebar open={sidebarOpen} onLogout={onLogout} />
      <div style={{ marginLeft: sidebarOpen ? "var(--sidebar-width)" : "0px" }} className="flex flex-col h-dvh transition-all duration-300">
        <Topbar dark={dark} onToggleDark={onToggleDark} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
