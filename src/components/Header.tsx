import React from 'react';
import { LayoutGrid, Newspaper, Send, Sparkles, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  activeTab: 'matrix' | 'news' | 'zapier';
  setActiveTab: (tab: 'matrix' | 'news' | 'zapier') => void;
  summarizedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  summarizedCount,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('matrix')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-900 via-indigo-700 to-sky-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">TaskQuadrant</span>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  Prof. Roh Framework
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Human &bull; AI Task Segregation & Singapore Intelligence Pipeline
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'matrix'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Quadrant Matrix</span>
              <span className="hidden md:inline-block text-[10px] bg-indigo-500/30 text-indigo-200 px-1.5 py-0.2 rounded font-mono">
                Q1
              </span>
            </button>

            <button
              onClick={() => setActiveTab('news')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'news'
                  ? 'bg-indigo-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Newspaper className="w-4 h-4" />
              <span>Singapore News & Summarizer</span>
              {summarizedCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-bold rounded-full bg-emerald-500 text-white">
                  {summarizedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('zapier')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'zapier'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Zapier Outbound Email</span>
              <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
