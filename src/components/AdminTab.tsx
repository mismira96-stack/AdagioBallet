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
  Phone,
  Sparkles,
  Settings2,
  Clock,
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
    updateClassStatus,
  } = useApp();

  const [activeSection, setActiveSection] = useState<'payments' | 'roster' | 'timetable' | 'refunds' | 'notices'>('payments');
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[classes.length - 1]?.id || classes[0]?.id || '');
  const [copiedText, setCopiedText] = useState(false);
  const [copiedPhoneId, setCopiedPhoneId] = useState<string | null>(null);

  // Timetable quick edit state
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [holidayReasonInput, setHolidayReasonInput] = useState('');

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

  // Copy phone number for quick StudioMate lookup
  const handleCopyPhone = (id: string, phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhoneId(id);
    setTimeout(() => setCopiedPhoneId(null), 1500);
  };

  // Copy roster to clipboard
  const handleCopyRoster = () => {
    let text = `[${currentClass.dayLabel} ${currentClass.time}] ${currentClass.title} (정원 ${currentClass.capacity}명)\n`;
    text += `강사: ${currentClass.instructor} | 장소: ${currentClass.location}\n\n`;
    text += `■ 수강 확정자 (${confirmedList.length}/${currentClass.capacity}명):\n`;
    confirmedList.forEach((b, idx) => {
      text += `${idx + 1}. ${b.userName} (${b.userDept || '소속'}, ${b.userPhone})\n`;
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

  const handleSaveClassStatus = (classId: string, status: 'active' | 'holiday' | 'makeup') => {
    updateClassStatus(classId, status, status === 'holiday' ? holidayReasonInput || '공휴일 휴강' : undefined);
    setEditingClassId(null);
    setHolidayReasonInput('');
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Top Banner: Soft Violet / Royal Lilac */}
      <div className="bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-800 rounded-3xl p-4.5 text-white shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 text-white flex items-center justify-center border border-white/25">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base leading-tight">동호회 운영진 콘솔</h2>
              <p className="text-[11px] text-purple-200">입금확인 · 스튜디오메이트 충전 · 출석부 · 휴일관리</p>
            </div>
          </div>
        </div>

        {/* Quick Tabs inside Admin (5 Tabs) */}
        <div className="grid grid-cols-5 gap-1 mt-4 pt-3 border-t border-white/15 text-xs">
          <button
            onClick={() => setActiveSection('payments')}
            className={`py-2 px-0.5 rounded-xl font-bold transition-all flex flex-col items-center justify-center relative ${
              activeSection === 'payments' ? 'bg-white text-violet-900 shadow-xs' : 'text-purple-100 hover:bg-white/10'
            }`}
          >
            <span>입금확인</span>
            {pendingPayments.length > 0 && (
              <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 rounded-full mt-0.5 font-black">
                {pendingPayments.length}건
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSection('roster')}
            className={`py-2 px-0.5 rounded-xl font-bold transition-all flex flex-col items-center justify-center ${
              activeSection === 'roster' ? 'bg-white text-violet-900 shadow-xs' : 'text-purple-100 hover:bg-white/10'
            }`}
          >
            <span>출석부</span>
            <span className="text-[9px] opacity-75 mt-0.5">명단확인</span>
          </button>

          <button
            onClick={() => setActiveSection('timetable')}
            className={`py-2 px-0.5 rounded-xl font-bold transition-all flex flex-col items-center justify-center ${
              activeSection === 'timetable' ? 'bg-white text-violet-900 shadow-xs' : 'text-purple-100 hover:bg-white/10'
            }`}
          >
            <span>휴일설정</span>
            <span className="text-[9px] opacity-75 mt-0.5">월별시간표</span>
          </button>

          <button
            onClick={() => setActiveSection('refunds')}
            className={`py-2 px-0.5 rounded-xl font-bold transition-all flex flex-col items-center justify-center relative ${
              activeSection === 'refunds' ? 'bg-white text-violet-900 shadow-xs' : 'text-purple-100 hover:bg-white/10'
            }`}
          >
            <span>15일환불</span>
            {pendingRefunds.length > 0 && (
              <span className="text-[10px] bg-rose-400 text-white px-1.5 rounded-full mt-0.5 font-black">
                {pendingRefunds.length}건
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSection('notices')}
            className={`py-2 px-0.5 rounded-xl font-bold transition-all flex flex-col items-center justify-center ${
              activeSection === 'notices' ? 'bg-white text-violet-900 shadow-xs' : 'text-purple-100 hover:bg-white/10'
            }`}
          >
            <span>공지관리</span>
            <span className="text-[9px] opacity-75 mt-0.5">작성</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Payments & StudioMate Pass Assignment */}
      {activeSection === 'payments' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-violet-600" />
              입금 확인 및 수강권 발급 대기열
            </h3>
            <span className="text-[11px] text-slate-500 font-semibold">대기 {pendingPayments.length}건</span>
          </div>

          <div className="p-3.5 bg-violet-50/60 rounded-2xl text-[11px] text-violet-900 leading-relaxed border border-violet-200/80">
            💡 <strong>운영 가이드:</strong> 통장 입금 확인 후 <strong>[입금확인]</strong> 버튼을 누르면 즉시 수강권이 발급됩니다. (스튜디오메이트 병행 운영 시 회원의 전화번호를 1초 복사하여 바로 검색 등록 가능합니다.)
          </div>

          {pendingPayments.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              처리 대기 중인 입금 내역이 없습니다. (모두 처리 완료)
            </div>
          ) : (
            <div className="space-y-2.5">
              {pendingPayments.map((p) => (
                <div key={p.id} className="bg-white rounded-3xl border border-amber-200 p-4 shadow-2xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                        입금 확인 대기
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">{p.ticketTitle}</h4>
                      <p className="text-xs text-slate-700 mt-0.5">
                        신청 회원: <strong>{p.userName}</strong> ({p.userPhone})
                      </p>
                      <p className="text-xs text-violet-700 font-semibold mt-0.5">
                        실제 입금자명: <strong>[{p.depositorName}]</strong> • {p.amount.toLocaleString()}원
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-mono">요청일시: {p.requestedAt}</p>
                    </div>

                    {/* Quick Copy Phone for StudioMate */}
                    <button
                      onClick={() => handleCopyPhone(p.id, p.userPhone)}
                      className="text-[11px] bg-slate-100 hover:bg-violet-50 text-slate-700 hover:text-violet-700 font-semibold px-2.5 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1 shrink-0 transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedPhoneId === p.id ? '복사완료!' : '번호 복사'}</span>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex gap-2">
                    <button
                      onClick={() => approvePayment(p.id)}
                      className="flex-1 py-2.5 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-200" />
                      입금확인 (수강권 즉시 발급)
                    </button>
                    <button
                      onClick={() => rejectPayment(p.id)}
                      className="px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition-colors"
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

      {/* SECTION 2: Class Attendance Roster */}
      {activeSection === 'roster' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-violet-600" />
              클래스별 출석부 & 수강생 명단
            </h3>
            <button
              onClick={handleCopyRoster}
              className="text-[11px] bg-violet-50 hover:bg-violet-100 text-violet-700 font-bold px-2.5 py-1 rounded-xl border border-violet-200 flex items-center gap-1 transition-colors"
            >
              <Copy className="w-3 h-3" />
              <span>{copiedText ? '복사완료!' : '명단 텍스트 복사'}</span>
            </button>
          </div>

          {/* Class Select Dropdown */}
          <div className="bg-white rounded-2xl border border-slate-200 p-2.5">
            <label className="block text-[11px] font-bold text-slate-500 mb-1">조회할 클래스 선택</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full text-xs font-bold text-slate-800 bg-slate-50 p-2 rounded-xl border border-slate-200 focus:outline-hidden"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  [{c.dayLabel} {c.time.split(' ')[0]}] {c.title} ({c.instructor}, 정원 {c.capacity}명)
                </option>
              ))}
            </select>
          </div>

          {/* Roster Card */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="p-3.5 bg-slate-50/80 border-b border-slate-200 flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-slate-900">{currentClass.title}</span>
                <span className="text-[11px] text-slate-500 ml-1.5 font-mono">
                  ({currentClass.time})
                </span>
              </div>
              <span className="font-bold font-mono text-violet-700">
                {confirmedList.length} / {currentClass.capacity}명 확정
              </span>
            </div>

            {/* Confirmed List */}
            <div className="divide-y divide-slate-100 text-xs">
              {confirmedList.length === 0 ? (
                <div className="p-6 text-center text-slate-400">아직 예약 신청자가 없습니다.</div>
              ) : (
                confirmedList.map((b, idx) => (
                  <div key={b.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50/50">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          {b.userName}
                          <span className="text-[11px] font-normal text-slate-500">
                            ({b.userDept || '소속부서'})
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">{b.userPhone}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                        확정
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-mono">{b.bookedAt}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Waitlist Section */}
            {waitlist.length > 0 && (
              <div className="border-t border-dashed border-amber-200 bg-amber-50/40 p-3.5">
                <div className="text-xs font-bold text-amber-800 mb-2 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  대기자 명단 ({waitlist.length}명) - 취소자 발생 시 1번부터 자동 확정
                </div>
                <div className="space-y-1.5 text-xs">
                  {waitlist.map((b, idx) => (
                    <div key={b.id} className="flex justify-between items-center text-slate-700">
                      <span>
                        <strong className="text-amber-800">대기 {idx + 1}번:</strong> {b.userName} (
                        {b.userDept})
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">{b.userPhone}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 3: Timetable & Monthly Holiday Settings */}
      {activeSection === 'timetable' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-violet-600" />
              월별 시간표 & 공휴일 휴강 / 보강 관리
            </h3>
            <span className="text-[11px] text-slate-400">총 {classes.length}개 클래스</span>
          </div>

          <div className="p-3.5 bg-slate-100/80 rounded-2xl border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
            💡 공휴일(대체공휴일)이나 스튜디오 사정으로 휴강 또는 보강이 발생할 경우, 상태를 변경하면 회원들의 시간표 화면에 즉시 안내 및 예약 제한이 자동 반영됩니다.
          </div>

          <div className="space-y-2.5">
            {classes.map((cls) => {
              const isEditing = editingClassId === cls.id;

              return (
                <div
                  key={cls.id}
                  className={`bg-white rounded-3xl border p-4 shadow-2xs space-y-2.5 transition-all ${
                    cls.status === 'holiday'
                      ? 'border-rose-200 bg-rose-50/20'
                      : cls.status === 'makeup'
                      ? 'border-amber-200 bg-amber-50/20'
                      : 'border-slate-200/90'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-500 font-mono">
                          [{cls.dayLabel}]
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">{cls.title}</h4>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {cls.time} • {cls.instructor} ({cls.level})
                      </p>
                    </div>

                    <div>
                      {cls.status === 'holiday' ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                          휴강 ({cls.holidayReason || '공휴일'})
                        </span>
                      ) : cls.status === 'makeup' ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                          보강 수업
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          정상 운영
                        </span>
                      )}
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="pt-2 border-t border-slate-100 space-y-2 animate-in fade-in">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          휴강 사유 또는 보강 안내 메모
                        </label>
                        <input
                          type="text"
                          value={holidayReasonInput}
                          onChange={(e) => setHolidayReasonInput(e.target.value)}
                          placeholder="예: 대체공휴일 휴강, 정기 대관 점검"
                          className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveClassStatus(cls.id, 'active')}
                          className="flex-1 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs hover:bg-emerald-100"
                        >
                          정상 수업
                        </button>
                        <button
                          onClick={() => handleSaveClassStatus(cls.id, 'holiday')}
                          className="flex-1 py-1.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 font-bold text-xs hover:bg-rose-100"
                        >
                          휴강 처리
                        </button>
                        <button
                          onClick={() => handleSaveClassStatus(cls.id, 'makeup')}
                          className="flex-1 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 font-bold text-xs hover:bg-amber-100"
                        >
                          보강 처리
                        </button>
                        <button
                          onClick={() => setEditingClassId(null)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 font-medium text-xs hover:bg-slate-200"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-1 flex justify-end">
                      <button
                        onClick={() => {
                          setEditingClassId(cls.id);
                          setHolidayReasonInput(cls.holidayReason || '');
                        }}
                        className="text-[11px] text-violet-700 bg-violet-50 hover:bg-violet-100 px-2.5 py-1 rounded-xl font-bold border border-violet-200 transition-colors"
                      >
                        상태 변경 설정 →
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 4: 15th Settlement Refund Management */}
      {activeSection === 'refunds' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-violet-600" />
              매월 15일 일괄 환불 요청 관리
            </h3>
            <span className="text-[11px] text-slate-500 font-semibold">요청 {pendingRefunds.length}건</span>
          </div>

          <div className="p-3.5 bg-slate-100/80 rounded-2xl border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
            💡 접수된 환불 건은 <strong>매월 15일</strong>에 계좌로 일괄 송금 후 [종결 처리]를 진행하시면 됩니다.
          </div>

          {pendingRefunds.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              현재 대기 중인 환불 요청이 없습니다.
            </div>
          ) : (
            <div className="space-y-2.5">
              {pendingRefunds.map((r) => (
                <div key={r.id} className="bg-white rounded-3xl border border-slate-200 p-4 shadow-2xs space-y-2.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full">
                        15일 환불 대기
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">{r.ticketTitle}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        요청자: <strong>{r.userName}</strong> • {r.requestedAt}
                      </p>
                    </div>
                    <div className="text-right font-mono font-bold text-slate-900 text-sm">
                      약 {r.amount.toLocaleString()}원
                    </div>
                  </div>

                  {/* Bank Account Info Box */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                    <div className="text-slate-500">환불 입금 계좌:</div>
                    <div className="font-mono font-bold text-slate-800">
                      {r.bankName} {r.accountNumber} (예금주: {r.accountHolder})
                    </div>
                    <div className="text-[11px] text-slate-500">사유: {r.reason}</div>
                  </div>

                  <button
                    onClick={() => completeRefund(r.id)}
                    className="w-full py-2.5 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-200" />
                    송금 완료 및 환불 종결 처리
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 5: Notices Management */}
      {activeSection === 'notices' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-violet-600" />
              공지사항 작성 및 관리
            </h3>
            <button
              onClick={() => setShowNoticeForm(!showNoticeForm)}
              className="text-xs bg-violet-600 text-white font-bold px-3 py-1.5 rounded-xl shadow-xs hover:bg-violet-700 transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              새 공지 작성
            </button>
          </div>

          {showNoticeForm && (
            <form onSubmit={handleCreateNotice} className="bg-white rounded-3xl border border-violet-200 p-4 shadow-sm space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">새 공지 등록</h4>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">분류</label>
                <select
                  value={noticeCategory}
                  onChange={(e) => setNoticeCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50"
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
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">내용</label>
                <textarea
                  required
                  rows={4}
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  placeholder="공지 상세 내용을 입력하세요"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs"
                >
                  공지 등록하기
                </button>
                <button
                  type="button"
                  onClick={() => setShowNoticeForm(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs"
                >
                  취소
                </button>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {notices.map((n) => (
              <div key={n.id} className="bg-white rounded-3xl border border-slate-200 p-4 shadow-2xs flex justify-between items-start">
                <div className="space-y-1 pr-3">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        n.category === '필독'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {n.category}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">{n.createdAt}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{n.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{n.content}</p>
                </div>
                <button
                  onClick={() => {
                    if (confirm('이 공지를 삭제하시겠습니까?')) deleteNotice(n.id);
                  }}
                  className="text-slate-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
