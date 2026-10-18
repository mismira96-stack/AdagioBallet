'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { ShieldCheck, User as UserIcon, Sparkles } from 'lucide-react';

export default function Header() {
  const { currentUser, switchUserRole, userTickets, paymentRequests, refundRequests } = useApp();

  const totalRemainingPasses = userTickets
    .filter((t) => t.userId === currentUser.id && t.status === 'active')
    .reduce((sum, t) => sum + t.remainingCount, 0);

  const pendingPaymentsCount = paymentRequests.filter((p) => p.status === 'pending').length;
  const pendingRefundsCount = refundRequests.filter((r) => r.status === 'requested').length;
  const totalAdminAlerts = pendingPaymentsCount + pendingRefundsCount;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-purple-100/70 shadow-2xs">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-violet-500 to-purple-400 text-white flex items-center justify-center font-serif font-black text-sm shadow-xs tracking-tighter">
            AB
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-800 text-base tracking-tight font-sans">
                Adagio Ballet
              </span>
              <span className="text-[10px] bg-violet-50 text-violet-700 font-semibold px-1.5 py-0.5 rounded-md border border-violet-200/80">
                사내동호회
              </span>
            </div>
            <p className="text-[11px] text-slate-400">수강권 · 1회 쿠폰 간편신청</p>
          </div>
        </div>

        {/* User Status & Fast Role Switcher */}
        <div className="flex items-center gap-2">
          {currentUser.role === 'member' ? (
            <div className="flex items-center gap-1 text-right">
              <div>
                <p className="text-xs font-bold text-slate-800">{currentUser.name}</p>
                <p className="text-[11px] text-violet-600 font-bold font-mono">
                  잔여 {totalRemainingPasses}회
                </p>
              </div>
              <button
                onClick={() => switchUserRole('admin')}
                title="운영진 모드로 전환"
                className="ml-1 p-1.5 rounded-lg bg-slate-100 hover:bg-violet-50 text-slate-600 hover:text-violet-700 transition-colors text-[11px] font-semibold flex items-center gap-1 border border-slate-200"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">운영진전환</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-right">
              <div>
                <p className="text-xs font-bold text-slate-800 flex items-center justify-end gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-violet-600" />
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-slate-500 font-medium">
                  {totalAdminAlerts > 0 ? (
                    <span className="text-amber-600 font-bold">처리대기 {totalAdminAlerts}건</span>
                  ) : (
                    '운영진 모드'
                  )}
                </p>
              </div>
              <button
                onClick={() => switchUserRole('member')}
                title="회원 모드로 전환"
                className="ml-1 p-1.5 rounded-lg bg-violet-50 hover:bg-violet-100 text-violet-700 transition-colors text-[11px] font-semibold flex items-center gap-1 border border-violet-200"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">회원전환</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
