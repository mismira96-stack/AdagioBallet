'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { TicketType, UserTicket } from '@/types';
import TossPaymentModal from './TossPaymentModal';
import RefundModal from './RefundModal';
import {
  Ticket,
  PlusCircle,
  Clock,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export default function TicketsTab() {
  const { userTickets, ticketTypes, currentUser, paymentRequests } = useApp();

  const [selectedTicketType, setSelectedTicketType] = useState<TicketType | null>(null);
  const [refundTicket, setRefundTicket] = useState<UserTicket | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // User's tickets
  const myTickets = userTickets.filter((t) => t.userId === currentUser.id);

  // User's pending payment requests
  const myPayments = paymentRequests.filter((p) => p.userId === currentUser.id);

  return (
    <div className="space-y-5 pb-20">
      {/* Toast Notification */}
      {successToast && (
        <div className="p-3 bg-emerald-600 text-white text-xs rounded-xl shadow-lg flex items-center gap-2 animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="font-medium">{successToast}</span>
        </div>
      )}

      {/* 1. My Active Passes Section */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Ticket className="w-4 h-4 text-rose-500" />
            내 보유 수강권
          </h2>
          <span className="text-[11px] text-slate-400">
            총 {myTickets.filter((t) => t.remainingCount > 0).length}장 사용 가능
          </span>
        </div>

        {myTickets.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-6 text-center space-y-2">
            <Ticket className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500 font-medium">현재 보유하신 수강권이 없습니다.</p>
            <p className="text-[11px] text-slate-400">
              아래 상품 목록에서 정기권 또는 1회 쿠폰을 충전해주세요!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {myTickets.map((ticket) => {
              const isActive = ticket.remainingCount > 0;
              const percent = Math.round((ticket.remainingCount / ticket.totalCount) * 100);

              return (
                <div
                  key={ticket.id}
                  className={`bg-white rounded-2xl border p-4 shadow-xs relative overflow-hidden ${
                    isActive ? 'border-rose-200' : 'border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200/80 px-2 py-0.5 rounded-full">
                        {ticket.title.includes('1회') ? '1회 체험 쿠폰' : '정기 수강권'}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm mt-1.5">{ticket.title}</h3>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                        <Clock className="w-3 h-3" />
                        <span>유효기간: {ticket.expiresAt}까지</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-black font-mono text-rose-600">
                        {ticket.remainingCount}
                        <span className="text-xs font-normal text-slate-400">/{ticket.totalCount}회</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-500 rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer Action: Refund Button */}
                  {isActive && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">
                        {ticket.remainingCount}회 남음 • 예약 시 1회씩 차감
                      </span>
                      <button
                        onClick={() => setRefundTicket(ticket)}
                        className="text-slate-400 hover:text-amber-600 font-medium flex items-center gap-1 transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>환불 신청</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Purchase Passes / 1-Session Coupons */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <PlusCircle className="w-4 h-4 text-rose-500" />
            수강권 & 1회 쿠폰 충전
          </h2>
          <span className="text-[11px] text-rose-600 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            토스 간편송금 연동
          </span>
        </div>

        <div className="grid gap-3">
          {ticketTypes.map((type) => {
            const isCoupon = type.category === 'coupon';

            return (
              <div
                key={type.id}
                onClick={() => setSelectedTicketType(type)}
                className="bg-white rounded-2xl border border-slate-200 hover:border-rose-300 p-4 shadow-xs transition-all cursor-pointer hover:shadow-md active:scale-[0.99] flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isCoupon
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {isCoupon ? '원데이 쿠폰' : '월 정기권'}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-rose-600 transition-colors">
                      {type.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500">{type.description}</p>
                  <p className="text-[11px] text-slate-400">
                    유효기간: 발급일로부터 {type.validDays}일
                  </p>
                </div>

                <div className="text-right shrink-0 pl-3">
                  <div className="text-base font-extrabold text-slate-900 font-mono">
                    {type.price.toLocaleString()}원
                  </div>
                  <span className="inline-block mt-1 text-[11px] font-bold text-rose-600 bg-rose-50 group-hover:bg-rose-600 group-hover:text-white px-2.5 py-1 rounded-lg transition-colors">
                    신청하기 →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. My Deposit Request History */}
      {myPayments.length > 0 && (
        <div className="pt-2">
          <h2 className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            최근 입금 확인 요청 내역
          </h2>
          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden text-xs">
            {myPayments.map((p) => (
              <div key={p.id} className="p-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">{p.ticketTitle}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    입금자: {p.depositorName} • {p.amount.toLocaleString()}원 • {p.requestedAt}
                  </div>
                </div>
                <div>
                  {p.status === 'pending' ? (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                      <Clock className="w-3 h-3 animate-spin" />
                      입금확인중
                    </span>
                  ) : p.status === 'approved' ? (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      충전완료
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                      반려됨
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Help info box */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500 space-y-1">
        <div className="font-semibold text-slate-700 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          수강권 이용 안내
        </div>
        <p>• 1회 체험 쿠폰은 신규 회원 또는 비정기 수강 시 편리하게 사용하실 수 있습니다.</p>
        <p>• 수업 시작 3시간 전까지 예약 취소 시 수강권 횟수는 100% 자동 환원됩니다.</p>
        <p>• 정기권 중도 환불은 매월 15일에 잔여 횟수만큼 일괄 정산 입금됩니다.</p>
      </div>

      {/* Modals */}
      <TossPaymentModal
        ticketType={selectedTicketType}
        onClose={() => setSelectedTicketType(null)}
        onSuccess={() => {
          setSuccessToast('입금 완료 요청이 접수되었습니다! 운영진 확인 후 충전됩니다.');
          setTimeout(() => setSuccessToast(null), 3000);
        }}
      />

      <RefundModal
        ticket={refundTicket}
        onClose={() => setRefundTicket(null)}
        onSuccess={() => {
          setSuccessToast('환불 신청이 정상 접수되었습니다. 15일에 일괄 정산됩니다.');
          setTimeout(() => setSuccessToast(null), 3000);
        }}
      />
    </div>
  );
}
