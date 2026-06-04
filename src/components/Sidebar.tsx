import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ReceiptText,
  Wallet,
  LogOut,
  Sun,
  Moon,
  X,
  Globe,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { financeService } from "../services/financeService";
import { LanguageModal } from "./LanguageModal";
import { LogoutModal } from "./LogoutModal";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  toggleTheme: () => void;
  isDesktopCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  darkMode,
  toggleTheme,
  isDesktopCollapsed,
  onToggleCollapse,
}) => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("PT-BR");
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
    {
      name: "Transações",
      path: "/transactions",
      icon: <ReceiptText size={20} />,
    },
    { name: "Contas", path: "/accounts", icon: <Wallet size={20} /> },
  ];

  const handleLogout = () => {
    financeService.logout();
    navigate("/login");
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity lg:hidden ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 ${isDesktopCollapsed ? "w-20" : "w-64"} bg-white dark:bg-gray-900 shadow-xl transform transition-all duration-300 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"} flex flex-col`}
      >
        <div
          className={`flex items-center ${isDesktopCollapsed ? "justify-center" : "justify-between"} p-6 border-b border-gray-100 dark:border-gray-800`}
        >
          {!isDesktopCollapsed && (
            <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 truncate">
              FinControl
            </h2>
          )}
          <div className="flex gap-2">
            <button
              onClick={onToggleCollapse}
              className="hidden lg:block text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isDesktopCollapsed ? (
                <ChevronRight size={20} />
              ) : (
                <ChevronLeft size={20} />
              )}
            </button>
            <button
              onClick={onClose}
              className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              title={isDesktopCollapsed ? item.name : undefined}
              className={({ isActive }) =>
                `flex items-center ${isDesktopCollapsed ? "justify-center px-0" : "gap-3 px-4"} py-3 rounded-lg transition-colors font-medium ${
                  isActive
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                }`
              }
              onClick={() => onClose()}
            >
              {item.icon}
              {!isDesktopCollapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        <div
          className={`p-4 border-t border-gray-100 dark:border-gray-800 space-y-4 ${isDesktopCollapsed ? "flex flex-col items-center" : ""}`}
        >
          <button
            onClick={() => setIsLangModalOpen(true)}
            title={isDesktopCollapsed ? `Idioma: ${language}` : undefined}
            className={`flex items-center ${isDesktopCollapsed ? "justify-center p-2" : "justify-between w-full px-4 py-3"} text-gray-600 hover:bg-gray-50 rounded-lg transition-colors font-medium dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200`}
          >
            <div className="flex items-center gap-3">
              <Globe size={20} />
              {!isDesktopCollapsed && <span>Idioma</span>}
            </div>
            {!isDesktopCollapsed && (
              <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-md">
                {language}
              </span>
            )}
          </button>

          <button
            onClick={toggleTheme}
            title={
              isDesktopCollapsed
                ? darkMode
                  ? "Modo Claro"
                  : "Modo Escuro"
                : undefined
            }
            className={`flex items-center ${isDesktopCollapsed ? "justify-center p-2" : "gap-3 w-full px-4 py-3"} text-gray-600 hover:bg-gray-50 rounded-lg transition-colors font-medium dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            {!isDesktopCollapsed && (darkMode ? "Modo Claro" : "Modo Escuro")}
          </button>

          <button
            onClick={() => setIsLogoutModalOpen(true)}
            title={isDesktopCollapsed ? "Sair" : undefined}
            className={`flex items-center ${isDesktopCollapsed ? "justify-center p-2" : "gap-3 w-full px-4 py-3"} text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium dark:text-red-400 dark:hover:bg-red-900/20`}
          >
            <LogOut size={20} />
            {!isDesktopCollapsed && <span>Sair</span>}
          </button>
        </div>
      </aside>

      <LanguageModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
        currentLanguage={language}
        onSelectLanguage={setLanguage}
      />

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};
