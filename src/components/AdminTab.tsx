'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Users,
  Copy,
  Calendar,
  DollarSign,
  Plus,
  Trash2,
  FileText,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export default function AdminTab() {
  const {
    classes,
    bookings,
    paymentRequests,
    refundRequests,
    notices,
    approvePayment,
    rejectPayment,
    completeRefund,
    addNotice,
    deleteNotice,
  } = useApp();

  const [activeSection, setActiveSection] = useState<'payments' | 'roster' | 'refunds' | 'notices'>('payments');
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [copiedText, setCopiedText] = useState(false);

  // Notice form
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<'필독' | '수업' | '일반'>('필독');
  const [noticeContent, setNoticeContent] = useState('');
  const [showNoticeForm, setShowNoticeForm] = useState(false);

  // Pending items counts
  const pendingPayments = paymentRequests.filter((p) => p.status === 'pending');
  const pendingRefunds = refundRequests.filter((r) => r.status === 'requested');

  // Selected class & bookings
  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const classBookings = bookings.filter((b) => b.classId === currentClass.id && b.status !== 'cancelled');
  const confirmedList = classBookings.filter((b) => b.status === 'confirmed');
  const waitlist = classBookings.filter((b) => b.status === 'waitlist');

  // Copy roster to clipboard
  const handleCopyRoster = () => {
    let text = `[${currentClass.dayLabel} ${currentClass.time}] ${currentClass.title} (정원 ${currentClass.capacity}명)\n`;
    text += `강사: ${currentClass.instructor} | 장소: ${currentClass.location}\n\n`;
    text += `■ 수강 확정자 (${confirmedList.length}/${currentClass.capacity}명):\n`;
    confirmedList.forEach((b, idx) => {
      text += `${idx + 1}. ${b.userName} (${b.userDept || '소속미입력'}, ${b.userPhone})\n`;
    });
    if (waitlist.length > 0) {
      text += `\n■ 대기자 명단 (${waitlist.length}명):\n`;
      waitlist.forEach((b, idx) => {
        text += `대기${idx + 1}. ${b.userName} (${b.userDept})\n`;
      });
    }

    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeContent.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    addNotice({
      title: noticeTitle.trim(),
      category: noticeCategory,
      content: noticeContent.trim(),
      author: '동호회 운영진',
    });

    setNoticeTitle('');
    setNoticeContent('');
    setShowNoticeForm(false);
    alert('새 공지사항이 등록되었습니다.');
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Top Banner */}
      <div className="bg-slate-900 rounded-2xl p-4 text-white shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base leading-tight">동호회 운영진 관리 콘솔</h2>
              <p className="text-[11px] text-slate-400">수강권 자동발급 • 출석부 • 15일 환불정산</p>
            </div>
          </div>
        </div>

        {/* Quick Tabs inside Admin */}
        <div className="grid grid-cols-4 gap-1 mt-4 pt-3 border-t border-slate-800 text-xs">
          <button
            onClick={() => setActiveSection('payments')}
            className={`py-2 px-1 rounded-xl font-bold transition-all flex flex-col items-center justify-center relative ${
              activeSection === 'payments' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span>입금확인</span>
            {pendingPayments.length > 0 && (
              <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 rounded-full mt-0.5 font-extrabold">
                {pendingPayments.length}건
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSection('roster')}
            className={`py-2 px-1 rounded-xl font-bold transition-all flex flex-col items-center justify-center ${
              activeSection === 'roster' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span>14명출석부</span>
            <span className="text-[10px] opacity-75 mt-0.5">명단확인</span>
          </button>

          <button
            onClick={() => setActiveSection('refunds')}
            className={`py-2 px-1 rounded-xl font-bold transition-all flex flex-col items-center justify-center relative ${
              activeSection === 'refunds' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span>15일환불</span>
            {pendingRefunds.length > 0 && (
              <span className="text-[10px] bg-red-400 text-white px-1.5 rounded-full mt-0.5 font-extrabold">
                {pendingRefunds.length}건
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSection('notices')}
            className={`py-2 px-1 rounded-xl font-bold transition-all flex flex-col items-center justify-center ${
              activeSection === 'notices' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span>공지관리</span>
            <span className="text-[10px] opacity-75 mt-0.5">글작성</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Payments & Auto Pass Issuance */}
      {activeSection === 'payments' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-rose-500" />
              입금 확인 및 수강권 즉시 발급 대기열
            </h3>
            <span className="text-[11px] text-slate-500">대기 {pendingPayments.length}건</span>
          </div>

          {pendingPayments.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              처리 대기 중인 입금 내역이 없습니다. (모두 처리 완료)
            </div>
          ) : (
            <div className="space-y-2.5">
              {pendingPayments.map((p) => (
                <div key={p.id} className="bg-white rounded-2xl border border-amber-200 p-4 shadow-xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md">
                        입금 확인 대기
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">{p.ticketTitle}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        신청자: <strong className="text-slate-800">{p.userName}</strong> ({p.userPhone})
                      </p>
                      <p className="text-xs text-rose-600 font-semibold">
                        실제 입금자명: <strong>[{p.depositorName}]</strong> • {p.amount.toLocaleString()}원
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">요청일시: {p.requestedAt}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex gap-2">
                    <button
                      onClick={() => approvePayment(p.id)}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      입금확인 (수강권 즉시 충전)
                    </button>
                    <button
                      onClick={() => rejectPayment(p.id)}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition-colors"
                    >
                      반려
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: 14 Capacity Class Attendance Roster */}
      {activeSection === 'roster' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-rose-500" />
              클래스별 14명 수강 확정자 및 대기 명단
            </h3>
            <button
              onClick={handleCopyRoster}
              className="text-[11px] bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 font-bold px-2.5 py-1 rounded-lg border border-slate-300 flex items-center gap-1 transition-colors"
            >
              <Copy className="w-3 h-3" />
              <span>{copiedText ? '복사완료!' : '명단 텍스트 복사'}</span>
            </button>
          </div>

          {/* Class Select Dropdown */}
          <div className="bg-white rounded-xl border border-slate-200 p-2.5">
            <label className="block text-[11px] font-bold text-slate-500 mb-1">조회할 클래스 선택</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full text-xs font-bold text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-200 focus:outline-hidden"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  [{c.dayLabel} {c.time}] {c.title} ({c.instructor})
                </option>
              ))}
            </select>
          </div>

          {/* Roster Card */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-3 bg-slate-50/80 border-b border-slate-200 flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-slate-800">{currentClass.title}</span>
                <span className="text-[11px] text-slate-500 ml-1.5">
                  ({currentClass.dayLabel} {currentClass.time})
                </span>
              </div>
              <span className="font-bold font-mono text-rose-600">
                {confirmedList.length} / {currentClass.capacity}명 확정
              </span>
            </div>

            {/* Confirmed List */}
            <div className="divide-y divide-slate-100 text-xs">
              {confirmedList.length === 0 ? (
                <div className="p-6 text-center text-slate-400">아직 예약 신청자가 없습니다.</div>
              ) : (
                confirmedList.map((b, idx) => (
                  <div key={b.id} className="p-3 flex items-center justify-between hover:bg-slate-50">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          {b.userName}
                          <span className="text-[11px] font-normal text-slate-500">
                            ({b.userDept || '소속부서'})
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">{b.userPhone}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                        예약확정
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-mono">{b.bookedAt}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Waitlist Section */}
            {waitlist.length > 0 && (
              <div className="border-t-2 border-dashed border-slate-200 bg-amber-50/40 p-3">
                <div className="text-xs font-bold text-amber-800 mb-2 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  대기자 명단 ({waitlist.length}명) - 취소자 발생 시 1번부터 자동 확정됩니다
                </div>
                <div className="space-y-1.5 text-xs">
                  {waitlist.map((b, idx) => (
                    <div key={b.id} className="flex justify-between items-center text-slate-700">
                      <span>
                        <strong className="text-amber-700">대기 {idx + 1}번:</strong> {b.userName} (
                        {b.userDept})
                      </span>
                      <span className="text-[11px] text-slate-400">{b.userPhone}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 3: 15th Settlement Refund Management */}
      {activeSection === 'refunds' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-rose-500" />
              매월 15일 일괄 환불 요청 관리
            </h3>
            <span className="text-[11px] text-slate-500">요청 {pendingRefunds.length}건</span>
          </div>

          <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 text-[11px] text-rose-800 leading-relaxed">
            💡 동호회 회칙에 따라 접수된 환불 건은 <strong>매월 15일에 일괄 송금</strong> 후 완료 처리하시면 됩니다.
          </div>

          {pendingRefunds.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              현재 대기 중인 환불 요청이 없습니다.
            </div>
          ) : (
            <div className="space-y-2.5">
              {pendingRefunds.map((r) => (
                <div key={r.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-md">
                        15일 환불 대기
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">{r.ticketTitle}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        요청자: <strong>{r.userName}</strong> • {r.requestedAt}
                      </p>
                    </div>
                    <div className="text-right font-mono font-bold text-rose-600 text-sm">
                      약 {r.amount.toLocaleString()}원
                    </div>
                  </div>

                  {/* Bank Account Info Box */}
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="text-slate-500">환불 입금처:</div>
                    <div className="font-mono font-bold text-slate-800">
                      {r.bankName} {r.accountNumber} (예금주: {r.accountHolder})
                    </div>
                    <div className="text-[11px] text-slate-500">사유: {r.reason}</div>
                  </div>

                  <button
                    onClick={() => completeRefund(r.id)}
                    className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    송금 완료 및 환불 종결 처리
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 4: Notices Management */}
      {activeSection === 'notices' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-rose-500" />
              공지사항 작성 및 관리
            </h3>
            <button
              onClick={() => setShowNoticeForm(!showNoticeForm)}
              className="text-xs bg-rose-600 text-white font-bold px-3 py-1.5 rounded-xl shadow-xs hover:bg-rose-700 transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              새 공지 작성
            </button>
          </div>

          {/* New Notice Form Modal/Dropdown */}
          {showNoticeForm && (
            <form onSubmit={handleCreateNotice} className="bg-white rounded-2xl border border-rose-200 p-4 shadow-sm space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">새 공지 등록</h4>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">분류</label>
                <select
                  value={noticeCategory}
                  onChange={(e) => setNoticeCategory(e.target.value as any)}
                  className="w-full p-2 rounded-lg border border-slate-300 text-xs"
                >
                  <option value="필독">필독 (상단 강조)</option>
                  <option value="수업">수업/시간표 공지</option>
                  <option value="일반">일반 동호회 공지</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">제목</label>
                <input
                  type="text"
                  required
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="공지 제목을 입력하세요"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">내용</label>
                <textarea
                  rows={4}
                  required
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  placeholder="공지 내용을 자세히 적어주세요"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs resize-none"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowNoticeForm(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-slate-100"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-700"
                >
                  등록하기
                </button>
              </div>
            </form>
          )}

          {/* Existing Notices List */}
          <div className="space-y-2">
            {notices.map((n) => (
              <div key={n.id} className="bg-white rounded-xl border border-slate-200 p-3.5 flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-200">
                      {n.category}
                    </span>
                    <h5 className="font-bold text-slate-900 text-xs">{n.title}</h5>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{n.content}</p>
                  <p className="text-[10px] text-slate-400">{n.createdAt} • {n.author}</p>
                </div>
                <button
                  onClick={() => deleteNotice(n.id)}
                  className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
