'use client';

import React from 'react';
import { Calendar, Ticket, Bell, ShieldCheck, User } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export type TabType = 'schedule' | 'tickets' | 'notices' | 'admin' | 'profile';

interface NavigationProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export default function Navigation({ currentTab, onChangeTab }: NavigationProps) {
  const { currentUser, paymentRequests, refundRequests } = useApp();

  const pendingCount =
    paymentRequests.filter((p) => p.status === 'pending').length +
    refundRequests.filter((r) => r.status === 'requested').length;

  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'schedule',
      label: '수업예약',
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      id: 'tickets',
      label: '수강권·쿠폰',
      icon: <Ticket className="w-5 h-5" />,
    },
    {
      id: 'notices',
      label: '공지사항',
      icon: <Bell className="w-5 h-5" />,
    },
    {
      id: 'admin',
      label: '운영진',
      icon: <ShieldCheck className="w-5 h-5" />,
      badge: pendingCount > 0 ? pendingCount : undefined,
    },
    {
      id: 'profile',
      label: '내정보',
      icon: <User className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-rose-100 shadow-lg">
      <div className="max-w-md mx-auto grid grid-cols-5 px-1 py-1.5">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-rose-600 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tighter">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-rose-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
