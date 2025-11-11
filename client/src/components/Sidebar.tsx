import { Link, useLocation } from "wouter";
import { APP_LOGO, APP_TITLE } from "@/const";
import { 
  LayoutDashboard, 
  Zap, 
  Wallet, 
  Hand,
  MessageSquare, 
  User, 
  LogOut,
  Shield,
  Menu,
  X,
  Gift,
  Star,
  Radio,
  HelpCircle,
  Crown,
  BookOpen,
  BarChart3,
} from "lucide-react";

import { Button } from "./ui/button";
import { useState } from "react";

export default function Sidebar() {
  const [location] = useLocation();
  const user = null; // Usuário removido
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Radio, label: "Sinais Inteligentes", href: "/live-signals", badge: "AO VIVO", badgeColor: "bg-green-500" },
    { icon: Wallet, label: "Gerenciamento de Banca", href: "/bankroll" },
    { icon: BarChart3, label: "Estatísticas Avançadas", href: "/statistics" },


    { icon: BookOpen, label: "Educação Financeira", href: "/education" },

  ];

  // Adicionar links de Admin se o usuário for admin
  if (false) {
    menuItems.push({ icon: Shield, label: "Moderação Chat", href: "/chat-moderation" });
  }
  
  if (false) {
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
                <p className="text-xs text-gray-400">Sinais Inteligentes</p>
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
                  className={`flex items-center justify-between space-x-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-red-600 text-white shadow-lg"
                      : "text-gray-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`${item.badgeColor} text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse`}>
                      {item.badge}
                    </span>
                  )}
                </a>
              </Link>
            );
          })}
        </nav>

        {/* Botões de Ação */}
        <div className="p-4 space-y-2">
  


          {/* Botão Suporte Telegram */}
          <a 
            href="https://t.me/seu_usuario_telegram" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full bg-blue-600 text-white text-center font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-all"
          >
            <HelpCircle className="inline h-4 w-4 mr-2" />
            Suporte Telegram
          </a>
        </div>

        {/* Informações do Usuário e Logout */}
        <div className="p-4 border-t border-red-900/30">

        </div>
      </aside>
    </>
  );
}

