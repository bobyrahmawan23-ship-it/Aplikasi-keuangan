import React from 'react';
import {
  LayoutDashboard,
  ArrowDownLeft,
  ArrowUpRight,
  Users,
  CreditCard,
  FileSpreadsheet,
  MessageSquare,
  BookOpenCheck,
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'pemasukan'
  | 'pengeluaran'
  | 'santri'
  | 'kartu-kendali'
  | 'laporan'
  | 'whatsapp'
  | 'panduan';

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  pendingWaCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab, pendingWaCount = 0 }) => {
  const tabs = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pemasukan' as ActiveTab, label: 'Pemasukan Kas', icon: ArrowDownLeft },
    { id: 'pengeluaran' as ActiveTab, label: 'Pengeluaran Kas', icon: ArrowUpRight },
    { id: 'santri' as ActiveTab, label: 'Data Santri', icon: Users },
    { id: 'kartu-kendali' as ActiveTab, label: 'Kartu Kendali', icon: CreditCard },
    { id: 'laporan' as ActiveTab, label: 'Rekap Laporan', icon: FileSpreadsheet },
    {
      id: 'whatsapp' as ActiveTab,
      label: 'WhatsApp Center',
      icon: MessageSquare,
      badge: pendingWaCount > 0 ? pendingWaCount : undefined,
    },
    { id: 'panduan' as ActiveTab, label: 'Panduan & Rumus', icon: BookOpenCheck },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-[69px] z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 shrink-0 ${
                  isActive
                    ? 'bg-indigo-700 text-white shadow-xs border-b-2 border-indigo-900'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="bg-amber-400 text-slate-950 font-bold px-1.5 py-0.5 rounded-full text-[9px]">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
