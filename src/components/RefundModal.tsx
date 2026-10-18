'use client';

import React, { useState } from 'react';
import { UserTicket } from '@/types';
import { useApp } from '@/context/AppContext';
import { CLUB_INFO } from '@/data/mockData';
import { X, Check, AlertCircle, Calendar } from 'lucide-react';

interface RefundModalProps {
  ticket: UserTicket | null;
  onClose: () => void;
  onSuccess: () => void;
}

const COMMON_BANKS = [
  '토스뱅크',
  '카카오뱅크',
  '국민은행',
  '신한은행',
  '우리은행',
  '하나은행',
  '기업은행',
  '농협은행',
  'SC제일은행',
];

export default function RefundModal({ ticket, onClose, onSuccess }: RefundModalProps) {
  const { currentUser, requestRefund } = useApp();

  const [bankName, setBankName] = useState(COMMON_BANKS[0]);
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState(currentUser.name);
  const [reason, setReason] = useState('개인 사정 (업무 바쁨/출장 등)');
  const [submitted, setSubmitted] = useState(false);

  if (!ticket) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber.trim()) {
      alert('환불받으실 계좌번호를 입력해주세요.');
      return;
    }
    if (!accountHolder.trim()) {
      alert('예금주 성함을 입력해주세요.');
      return;
    }

    const res = requestRefund(ticket.id, bankName, accountNumber.trim(), accountHolder.trim(), reason);
    if (res.success) {
      setSubmitted(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1800);
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl border border-rose-100 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <h3 className="font-bold text-slate-800 text-base">수강권 환불 신청</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Check className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-800">환불 신청 접수 완료!</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                운영진에게 환불 요청이 안전하게 접수되었습니다.<br />
                동호회 회칙에 따라 <strong className="text-rose-600">매월 15일</strong>에 정산되어<br />
                입력하신 계좌로 일괄 입금됩니다.
              </p>
            </div>
          ) : (
            <>
              {/* Ticket Summary */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500">환불 대상 수강권</span>
                    <h4 className="text-sm font-bold text-slate-900 mt-0.5">{ticket.title}</h4>
                  </div>
                  <span className="text-xs bg-rose-100 text-rose-700 font-bold px-2 py-1 rounded-lg">
                    잔여 {ticket.remainingCount}회
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-200 flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>환불 정산일: <strong className="text-slate-700 font-semibold">{CLUB_INFO.refundDayText}</strong></span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">환불 은행</label>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500 bg-white"
                  >
                    {COMMON_BANKS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">계좌번호 (하이픈 제외 가능)</label>
                  <input
                    type="text"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="예: 110-123-456789"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">예금주</label>
                  <input
                    type="text"
                    required
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    placeholder="예금주 성함"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">환불 사유</label>
                  <textarea
                    rows={2}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="환불 사유를 간단히 적어주세요."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-rose-500 resize-none"
                  />
                </div>

                <div className="bg-amber-50 rounded-xl p-3 border border-amber-200/60 flex items-start gap-2 text-amber-800 text-[11px] leading-relaxed">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    환불 요청 시 기존 수강권은 즉시 회수 대기 상태로 전환되며, 남은 횟수에 비례하여 15일에 정산 송금됩니다.
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all active:scale-[0.99]"
                >
                  환불 요청 접수하기
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
