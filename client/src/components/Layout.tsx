import { ReactNode } from "react";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 text-white">
      <Sidebar />
      <main className="lg:ml-64 min-h-screen">
        {children}
        
        {/* Footer */}
        <footer className="mt-12 border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-400">
                © 2025 Roleta Pro I.A. - Todos os direitos reservados.
              </div>
              <div className="flex gap-6 text-sm">
                <a href="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Artigos
                </a>
                <a href="/termos-de-uso" className="text-gray-400 hover:text-white transition-colors">
                  Termos de Uso
                </a>
                <a href="/politica-de-privacidade" className="text-gray-400 hover:text-white transition-colors">
                  Política de Privacidade
                </a>
                <a href="https://t.me/roletaproia" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  Suporte
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default Layout;
