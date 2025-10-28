import { Link, useLocation } from "wouter";
import { APP_LOGO, APP_TITLE } from "@/const";
import { 
  LayoutDashboard, 
  Zap, 
  Wallet, 
  Bot, 
  MessageSquare, 
  User, 
  Settings,
  LogOut,
  Shield,
  Menu,
  X
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "./ui/button";
import { useState } from "react";

export default function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Zap, label: "Estratégias", href: "/strategies" },
    { icon: Bot, label: "Robô de Apostas", href: "/betting-robot/select-mode" },
    { icon: Wallet, label: "Gerenciar Banca", href: "/bankroll-management" },
    { icon: MessageSquare, label: "Chat", href: "/chat" },
    { icon: User, label: "Perfil", href: "/profile" },
  ];

  // Adicionar links de Admin se o usuário for admin
  if (user?.role === "admin" || user?.role === "sub-admin") {
    menuItems.push({ icon: Shield, label: "Moderação Chat", href: "/chat-moderation" });
  }
  
  if (user?.role === "admin") {
    menuItems.push({ icon: Shield, label: "Painel Admin", href: "/admin" });
  }

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Botão Hambúrguer (Mobile) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-red-600 text-white p-2 rounded-lg shadow-lg hover:bg-red-700 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Overlay (Mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-slate-900/95 backdrop-blur border-r border-red-900/30 flex flex-col z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo e Título */}
        <div className="p-6 border-b border-red-900/30">
          <Link href="/dashboard">
            <a className="flex items-center space-x-3 hover:opacity-80 transition-opacity" onClick={closeSidebar}>
              {APP_LOGO && <img src={APP_LOGO} alt={APP_TITLE} className="h-10 w-10 rounded-lg" />}
              <div>
                <h1 className="text-lg font-bold text-white">{APP_TITLE}</h1>
                <p className="text-xs text-gray-400">Sistema de Apostas</p>
              </div>
            </a>
          </Link>
        </div>

        {/* Menu de Navegação */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link key={item.href} href={item.href}>
                <a
                  onClick={closeSidebar}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-red-600 text-white shadow-lg"
                      : "text-gray-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </a>
              </Link>
            );
          })}
        </nav>

        {/* Informações do Usuário e Logout */}
        <div className="p-4 border-t border-red-900/30">
          <div className="flex items-center space-x-3 mb-3 px-2">
            <div className="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-400">
                {user?.role === "admin" ? "👑 Admin" : user?.role === "sub-admin" ? "🔐 Sub-Admin" : "👤 Usuário"}
              </p>
            </div>
          </div>
          <Button
            onClick={() => {
              logout();
              closeSidebar();
            }}
            variant="outline"
            className="w-full border-red-700/30 text-gray-300 hover:bg-red-900/20 hover:text-white"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </aside>
    </>
  );
}

