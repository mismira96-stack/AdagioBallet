'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Sparkles, ShieldCheck, User as UserIcon } from 'lucide-react';

export default function Header() {
  const { currentUser, switchUserRole, userTickets, paymentRequests, refundRequests } = useApp();

  const totalRemainingPasses = userTickets
    .filter((t) => t.userId === currentUser.id && t.status === 'active')
    .reduce((sum, t) => sum + t.remainingCount, 0);

  const pendingPaymentsCount = paymentRequests.filter((p) => p.status === 'pending').length;
  const pendingRefundsCount = refundRequests.filter((r) => r.status === 'requested').length;
  const totalAdminAlerts = pendingPaymentsCount + pendingRefundsCount;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-xs">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-linear-to-tr from-rose-400 to-rose-200 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-800 text-base tracking-tight font-serif">
                Adagio Ballet
              </span>
              <span className="text-[10px] bg-rose-50 text-rose-600 font-semibold px-1.5 py-0.5 rounded-full border border-rose-200/60">
                사내동호회
              </span>
            </div>
            <p className="text-[11px] text-slate-500">아다지오 발레 수강관리</p>
          </div>
        </div>

        {/* User Status & Fast Role Switcher */}
        <div className="flex items-center gap-2">
          {currentUser.role === 'member' ? (
            <div className="flex items-center gap-1 text-right">
              <div>
                <p className="text-xs font-semibold text-slate-800">{currentUser.name}</p>
                <p className="text-[10px] text-rose-600 font-medium">잔여 {totalRemainingPasses}회</p>
              </div>
              <button
                onClick={() => switchUserRole('admin')}
                title="운영진 모드로 전환"
                className="ml-1 p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors text-[11px] font-medium flex items-center gap-1 border border-slate-200"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">운영진전환</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-right">
              <div>
                <p className="text-xs font-semibold text-rose-700 flex items-center justify-end gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-slate-500">
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
                className="ml-1 p-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 transition-colors text-[11px] font-medium flex items-center gap-1 border border-rose-300"
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
