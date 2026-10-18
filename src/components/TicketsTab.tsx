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
  HelpCircle,
  ChevronRight,
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
    <div className="space-y-4 pb-20">
      {/* Toast Notification */}
      {successToast && (
        <div className="p-3 bg-emerald-600 text-white text-xs rounded-2xl shadow-lg flex items-center gap-2 animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="font-medium">{successToast}</span>
        </div>
      )}

      {/* StudioMate Hybrid Notice Banner: Soft Lavender */}
      <div className="bg-violet-50/80 border border-violet-200/90 rounded-3xl p-4 flex items-start gap-3 text-violet-950 text-xs shadow-2xs">
        <div className="w-7 h-7 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="leading-relaxed">
          <strong className="text-violet-900 font-bold block text-sm">
            수강권 · 1회 쿠폰 간편 신청 포털
          </strong>
          <p className="text-[11px] text-violet-700/90 mt-0.5">
            원하시는 쿠폰/정기권을 선택 후 토스로 송금해주시면, 운영진 확인 즉시 <strong>스튜디오메이트(StudioMate)</strong> 앱에 수강권이 자동 충전됩니다.
          </p>
        </div>
      </div>

      {/* 1. Purchase Passes / 1-Session Coupons */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <PlusCircle className="w-4 h-4 text-violet-600" />
            수강권 & 1회 쿠폰 신청
          </h2>
          <span className="text-[11px] text-violet-600 font-bold flex items-center gap-1">
            토스 간편송금 지원
          </span>
        </div>

        <div className="grid gap-2.5">
          {ticketTypes.map((type) => {
            const isCoupon = type.category === 'coupon';
            const isFullCoupon = type.id === 'ticket-coupon-full';
            const isHalfCoupon = type.id === 'ticket-coupon-half';

            return (
              <div
                key={type.id}
                onClick={() => setSelectedTicketType(type)}
                className="bg-white rounded-3xl border border-slate-200/90 hover:border-violet-300 p-4 shadow-2xs transition-all cursor-pointer hover:shadow-xs active:scale-[0.99] flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isFullCoupon
                          ? 'bg-violet-100 text-violet-800 border border-violet-200'
                          : isHalfCoupon
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-purple-100 text-purple-800 border border-purple-200'
                      }`}
                    >
                      {type.category === 'coupon' ? '1회 쿠폰' : '정기 수강권'}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-violet-700 transition-colors">
                      {type.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{type.description}</p>
                  <p className="text-[11px] text-slate-400">
                    유효기간: 발급일로부터 {type.validDays}일
                  </p>
                </div>

                <div className="text-right shrink-0 pl-3">
                  <div className="text-base font-black text-slate-900 font-mono">
                    {type.price.toLocaleString()}원
                  </div>
                  <span className="inline-block mt-1 text-[11px] font-bold text-violet-700 bg-violet-50 group-hover:bg-violet-600 group-hover:text-white px-3 py-1 rounded-xl transition-all border border-violet-200/70 group-hover:border-transparent">
                    신청하기 →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. My Active Passes Section */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Ticket className="w-4 h-4 text-violet-600" />
            내 보유 수강권 현황
          </h2>
          <span className="text-[11px] text-slate-400">
            총 {myTickets.filter((t) => t.remainingCount > 0).length}장 보유
          </span>
        </div>

        {myTickets.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-violet-200 p-6 text-center space-y-1.5">
            <Ticket className="w-8 h-8 text-violet-300 mx-auto" />
            <p className="text-xs text-slate-600 font-semibold">현재 등록된 수강권이 없습니다.</p>
            <p className="text-[11px] text-slate-400">
              위 상품 목록에서 원하시는 쿠폰을 신청해주세요.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {myTickets.map((ticket) => {
              const isActive = ticket.remainingCount > 0;
              const percent = Math.round((ticket.remainingCount / ticket.totalCount) * 100);

              return (
                <div
                  key={ticket.id}
                  className={`bg-white rounded-3xl border p-4 shadow-2xs relative overflow-hidden ${
                    isActive ? 'border-violet-200/90' : 'border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-violet-800 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-full">
                        {ticket.title.includes('1회') ? '1회 쿠폰' : '정기권'}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm mt-1">{ticket.title}</h3>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>유효기간: {ticket.expiresAt}까지</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-black font-mono text-violet-700">
                        {ticket.remainingCount}
                        <span className="text-xs font-normal text-slate-400">/{ticket.totalCount}회</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress bar in soft lilac gradient */}
                  <div className="mt-3">
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer Action: Cancellation allowance & Refund Button */}
                  {isActive && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <span className="font-medium">취소·보강:</span>
                        <span
                          className={`font-bold ${
                            ticket.cancellationCount >= ticket.maxCancellations
                              ? 'text-rose-600'
                              : 'text-violet-700'
                          }`}
                        >
                          {ticket.maxCancellations - ticket.cancellationCount}회 가능
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          (최대 {ticket.maxCancellations}회)
                        </span>
                      </div>
                      <button
                        onClick={() => setRefundTicket(ticket)}
                        className="text-slate-400 hover:text-rose-600 font-semibold flex items-center gap-1 transition-colors"
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

      {/* 3. My Deposit Request History */}
      {myPayments.length > 0 && (
        <div className="pt-1">
          <h2 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            내 입금 확인 요청 내역
          </h2>
          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden text-xs">
            {myPayments.map((p) => (
              <div key={p.id} className="p-3.5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">{p.ticketTitle}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    입금자: {p.depositorName} • {p.amount.toLocaleString()}원 • {p.requestedAt}
                  </div>
                </div>
                <div>
                  {p.status === 'pending' ? (
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                      <Clock className="w-3 h-3 animate-spin" />
                      입금확인중
                    </span>
                  ) : p.status === 'approved' ? (
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      발급완료
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                      반려됨
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Help info box: Soft Cashmere / Slate */}
      <div className="p-4 rounded-3xl bg-slate-100/70 border border-slate-200/80 text-[11px] text-slate-600 space-y-1.5">
        <div className="font-bold text-slate-800 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-violet-600" />
          이용 규정 안내
        </div>
        <p className="leading-relaxed">• <strong>1회 쿠폰(Full 80분)</strong>: 정규 Full 수업 및 금요 파드되 클래스 예약 시 사용</p>
        <p className="leading-relaxed">• <strong>1회 쿠폰(Half 40분)</strong>: 런치 스트레칭, 포인트 입문, 월요 입문반 예약 시 사용</p>
        <p className="leading-relaxed">• 환불 신청 건은 동호회 정산일에 맞춰 <strong>매월 15일</strong>에 일괄 입금됩니다.</p>
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
