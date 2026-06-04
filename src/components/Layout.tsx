import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Menu } from "lucide-react";

export const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(
    () => localStorage.getItem("sidebarCollapsed") === "true",
  );
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark",
  );

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", isDesktopCollapsed.toString());
  }, [isDesktopCollapsed]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212] transition-colors duration-200 font-sans text-gray-900 dark:text-gray-100">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        darkMode={darkMode}
        toggleTheme={() => setDarkMode(!darkMode)}
        isDesktopCollapsed={isDesktopCollapsed}
        onToggleCollapse={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
      />

      <div
        className={`${isDesktopCollapsed ? "lg:pl-20" : "lg:pl-64"} flex flex-col min-h-screen transition-all duration-300`}
      >
        <header className="sticky top-0 z-30 flex items-center gap-4 bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-md px-6 py-4 lg:hidden border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-bold">FinControl</h1>
        </header>

        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
