'use client';

import React, { useState } from 'react';
import { TicketType } from '@/types';
import { CLUB_INFO } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import { X, Check, Copy, ExternalLink, ShieldAlert, Sparkles } from 'lucide-react';

interface TossPaymentModalProps {
  ticketType: TicketType | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TossPaymentModal({ ticketType, onClose, onSuccess }: TossPaymentModalProps) {
  const { currentUser, requestPayment } = useApp();
  const [depositorName, setDepositorName] = useState(currentUser.name);
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!ticketType) return null;

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(`${CLUB_INFO.bankName} ${CLUB_INFO.accountNumber}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenTossApp = () => {
    // Toss app deep link
    // Scheme: supertoss://send?bank={bank}&account={account}&amount={amount}
    const cleanAccount = CLUB_INFO.accountNumber.replace(/-/g, '');
    const tossScheme = `supertoss://send?bank=${encodeURIComponent(CLUB_INFO.bankName)}&account=${cleanAccount}&amount=${ticketType.price}`;
    
    // Copy account to clipboard as fallback before opening app
    navigator.clipboard.writeText(`${CLUB_INFO.bankName} ${CLUB_INFO.accountNumber}`);

    // Try opening Toss app
    window.location.href = tossScheme;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositorName.trim()) {
      alert('입금자명을 입력해주세요.');
      return;
    }

    requestPayment(ticketType.id, depositorName.trim());
    setSubmitted(true);
    setTimeout(() => {
      onSuccess();
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl border border-violet-100 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-violet-50/50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-600" />
            <h3 className="font-bold text-slate-900 text-base">수강권 신청 및 입금 안내</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4.5">
          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Check className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-800">입금 확인 요청 완료!</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                운영진이 입금 내역을 확인하는 즉시<br />
                <strong className="text-violet-700">[{ticketType.title}]</strong>이 회원님의 계정에 자동 충전됩니다.
              </p>
            </div>
          ) : (
            <>
              {/* Product Info Card */}
              <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/90">
                <span className="text-[11px] font-semibold text-violet-700 uppercase tracking-wider">
                  {ticketType.category === 'coupon' ? '1회 쿠폰' : '정기 수강권'}
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">{ticketType.title}</h4>
                <p className="text-xs text-slate-500 mt-1">{ticketType.description}</p>
                <div className="mt-3 pt-3 border-t border-slate-200 flex items-baseline justify-between">
                  <span className="text-xs text-slate-600 font-medium">입금 금액</span>
                  <span className="text-xl font-black text-slate-900 font-mono">
                    {ticketType.price.toLocaleString()}원
                  </span>
                </div>
              </div>

              {/* Toss App Deep Link Quick Button */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                  토스(Toss) 간편 송금
                </label>
                <button
                  type="button"
                  onClick={handleOpenTossApp}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#0064FF] hover:bg-[#0052cc] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
                >
                  <span className="text-base font-extrabold tracking-tight">toss</span>
                  <span>토스 앱으로 바로 송금하기</span>
                  <ExternalLink className="w-4 h-4 opacity-80" />
                </button>
                <p className="text-[11px] text-slate-400 text-center">
                  버튼 클릭 시 토스 앱이 실행되며 계좌번호와 금액이 자동 입력됩니다.
                </p>
              </div>

              {/* Manual Bank Account Copy Box */}
              <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">동호회 공식 입금 계좌</span>
                  <button
                    type="button"
                    onClick={handleCopyAccount}
                    className="text-violet-700 hover:text-violet-900 font-semibold flex items-center gap-1 text-[11px] bg-white px-2 py-0.5 rounded-lg border border-slate-200"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600">복사완료</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>계좌번호 복사</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="text-sm font-bold text-slate-800 font-mono tracking-tight">
                  {CLUB_INFO.bankName} {CLUB_INFO.accountNumber}
                </div>
                <div className="text-[11px] text-slate-500">
                  예금주: <span className="font-semibold text-slate-700">{CLUB_INFO.accountHolder}</span>
                </div>
              </div>

              {/* Form: Depositor Name & Request Confirmation */}
              <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    입금자명 (실제 송금인 성함)
                  </label>
                  <input
                    type="text"
                    required
                    value={depositorName}
                    onChange={(e) => setDepositorName(e.target.value)}
                    placeholder="예: 김발레"
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-violet-500 bg-slate-50/50 font-medium"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    운영진이 통장 입금내역과 대조 확인하므로 정확히 입력해주세요.
                  </p>
                </div>

                {/* Information Notice */}
                <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200/60 flex items-start gap-2 text-amber-800 text-[11px] leading-relaxed">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    송금 완료 후 아래 <strong>[입금완료 요청]</strong> 버튼을 꼭 눌러주세요. 운영진 확인 즉시 수강권이 자동 충전됩니다.
                  </div>
                </div>

                {/* Submit Button in soft violet */}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm shadow-sm transition-all active:scale-[0.99]"
                >
                  입금완료 요청 보내기
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
