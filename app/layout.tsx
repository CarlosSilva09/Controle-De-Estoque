"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { RequestsProvider } from "@/contexts/requests-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const navItems = [
  { 
    label: "Dashboard", 
    href: "/dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6a2 2 0 01-2 2H10a2 2 0 01-2-2V5z" />
      </svg>
    )
  },
  { 
    label: "Produtos", 
    href: "/produtos",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    )
  },
  { 
    label: "Movimentações", 
    href: "/movimentacoes",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    )
  },
  { 
    label: "Solicitações", 
    href: "/solicitacoes",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    )
  },
  { 
    label: "Alertas", 
    href: "/alertas",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.343 12.344l1.414 1.414L9 10.414V18a2 2 0 002 2h5M21 7l-5-5-5 5h3v5a2 2 0 002 2h5V7z" />
      </svg>
    )
  },
  { 
    label: "Relatórios", 
    href: "/relatorios",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 text-gray-900 dark:text-gray-100">
        <RequestsProvider>
        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <div className="flex min-h-screen">
          {/* Sidebar Moderno Aurora */}
          <aside 
            className={`${
              sidebarExpanded ? 'w-72' : 'w-20'
            } transition-all duration-300 ease-out bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-r border-white/20 dark:border-slate-700/50 flex flex-col shadow-2xl shadow-blue-500/10 relative
            fixed inset-y-0 left-0 z-50 lg:relative lg:translate-x-0 ${
              isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}
            onMouseEnter={() => !isMobileMenuOpen && setSidebarExpanded(true)}
            onMouseLeave={() => !isMobileMenuOpen && setSidebarExpanded(false)}
          >
            {/* Aurora Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-400/10 dark:via-purple-400/10 dark:to-pink-400/10"></div>
            
            {/* Header do Sidebar */}
            <div className="h-20 flex items-center justify-center border-b border-white/10 dark:border-slate-700/50 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
              {/* Aurora Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
              
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                  </svg>
                </div>
                {sidebarExpanded && (
                  <div className="flex flex-col">
                    <span className="font-bold text-white text-lg tracking-wide">
                      Stock Control
                    </span>
                    <span className="text-white/70 text-xs font-medium">
                      Sistema de Estoque
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Navigation Aurora */}
            <nav className="flex-1 py-8 px-3 relative">
              <div className="space-y-3">
                {navItems.map((item) => {
                  const isActive = pathname && pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-4 rounded-2xl px-4 py-4 font-medium transition-all duration-300 group relative overflow-hidden ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 text-blue-600 dark:text-blue-400 shadow-lg shadow-blue-500/20 backdrop-blur-sm border border-blue-200/50 dark:border-blue-400/20"
                          : "text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white hover:shadow-lg hover:shadow-blue-500/10 backdrop-blur-sm"
                      }`}
                    >
                      {/* Aurora Background Effect for Active */}
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>
                      )}
                      
                      <div className={`flex-shrink-0 transition-all duration-300 relative z-10 ${
                        isActive 
                          ? 'text-blue-600 dark:text-blue-400 scale-110' 
                          : 'group-hover:text-blue-500 group-hover:scale-110'
                      }`}>
                        {item.icon}
                      </div>
                      
                      {sidebarExpanded && (
                        <span className="text-sm font-semibold truncate transition-all duration-300 relative z-10">
                          {item.label}
                        </span>
                      )}
                      
                      {!sidebarExpanded && (
                        <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900/90 dark:bg-gray-700/90 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-20 backdrop-blur-sm border border-white/10">
                          {item.label}
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900/90 dark:bg-gray-700/90 rotate-45"></div>
                        </div>
                      )}
                      
                      {/* Active Indicator */}
                      {isActive && sidebarExpanded && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse relative z-10"></div>
                      )}
                    </Link>
                  );
                })}
              </div>
              
              {/* Quick Actions */}
              {sidebarExpanded && (
                <div className="mt-8 p-4 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200/30 dark:border-blue-700/30 backdrop-blur-sm">
                  <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Ações Rápidas
                  </h3>
                  <div className="space-y-2">
                    <Link 
                      href="/produtos" 
                      className="w-full text-left text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 block p-2 rounded-lg hover:bg-white/30 dark:hover:bg-slate-800/30"
                    >
                      + Novo Produto
                    </Link>
                    <Link 
                      href="/relatorios"
                      className="w-full text-left text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 block p-2 rounded-lg hover:bg-white/30 dark:hover:bg-slate-800/30"
                    >
                      📊 Relatório Rápido
                    </Link>
                    <Link 
                      href="/solicitacoes"
                      className="w-full text-left text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 block p-2 rounded-lg hover:bg-white/30 dark:hover:bg-slate-800/30"
                    >
                      📋 Solicitações
                    </Link>
                  </div>
                </div>
              )}
            </nav>
            
            {/* Footer do Sidebar Aurora */}
            <div className="p-4 border-t border-white/10 dark:border-slate-700/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 backdrop-blur-sm">
              {sidebarExpanded ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-white/20 dark:border-slate-700/50 backdrop-blur-sm">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      A
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">Admin</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">admin@stockcontrol.com</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 text-center">
                    &copy; {new Date().getFullYear()} Stock Control Pro
                  </div>
                </div>
              ) : (
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto flex items-center justify-center text-white text-sm font-bold shadow-lg">
                  A
                </div>
              )}
            </div>
          </aside>
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-h-screen relative lg:ml-0">
            {/* Aurora Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 dark:from-blue-900/10 dark:via-purple-900/5 dark:to-pink-900/10"></div>
            
            {/* Header */}
            <header className="h-16 sm:h-20 border-b border-white/20 dark:border-slate-700/50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl relative z-10">
              <div className="h-full px-4 sm:px-6 flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* Mobile Menu Button */}
                  <button
                    className="lg:hidden p-2 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 hover:bg-white/70 dark:hover:bg-slate-800/70 transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  >
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>

                  <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {pathname === '/dashboard' ? 'Dashboard' :
                     pathname === '/produtos' ? 'Produtos' :
                     pathname === '/alertas' ? 'Alertas' :
                     pathname === '/relatorios' ? 'Relatórios' :
                     pathname === '/movimentacoes' ? 'Movimentações' :
                     pathname === '/solicitacoes' ? 'Solicitações' : 'Dashboard'}
                  </h1>
                  <div className="hidden sm:block h-6 w-px bg-gradient-to-b from-blue-200 to-purple-200 dark:from-blue-700 dark:to-purple-700"></div>
                  <span className="hidden sm:block text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {new Date().toLocaleDateString('pt-BR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-4">
                  {/* Dark Mode Toggle */}
                  <button 
                    aria-label="Alternar modo escuro"
                    className="p-2 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 hover:bg-white/70 dark:hover:bg-slate-800/70 transition-all duration-200 backdrop-blur-sm"
                    onClick={() => {
                      if (typeof document !== "undefined") {
                        document.documentElement.classList.toggle("dark");
                      }
                    }}
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  </button>
                  
                  {/* User Profile */}
                  <div className="flex items-center gap-2 sm:gap-3 p-2 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 backdrop-blur-sm">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-lg">
                      A
                    </div>
                    <div className="hidden md:block">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Admin</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Administrador</p>
                    </div>
                  </div>
                </div>
              </div>
            </header>
            
            {/* Main Content */}
            <main className="flex-1 p-4 sm:p-6 relative z-10">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </div>
        <Toaster richColors position="top-right" />
        </RequestsProvider>
      </body>
    </html>
  );
}
