'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ClassSession } from '@/types';
import {
  Clock,
  MapPin,
  User,
  Users,
  CheckCircle2,
  AlertCircle,
  Ticket,
  ChevronRight,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface ScheduleTabProps {
  onGoToTickets: () => void;
}

interface WeekOption {
  id: string;
  label: string;
  dates: { [key in ClassSession['dayOfWeek']]: string };
  badge?: string;
}

const WEEKS: WeekOption[] = [
  {
    id: 'week-10-4',
    label: '10월 4주차 (10.21 ~ 10.25)',
    dates: {
      mon: '10/21',
      tue: '10/22',
      wed: '10/23',
      thu: '10/24',
      fri: '10/25',
    },
    badge: '정규 시간표',
  },
  {
    id: 'week-10-5',
    label: '10월 5주차 (10.28 ~ 11.01)',
    dates: {
      mon: '10/28',
      tue: '10/29',
      wed: '10/30',
      thu: '10/31',
      fri: '11/01',
    },
    badge: '10월 마감주',
  },
  {
    id: 'week-11-1',
    label: '11월 1주차 (11.04 ~ 11.08)',
    dates: {
      mon: '11/04',
      tue: '11/05',
      wed: '11/06',
      thu: '11/07',
      fri: '11/08',
    },
    badge: '11월 신규',
  },
];

const DAYS: { key: ClassSession['dayOfWeek']; label: string; desc: string }[] = [
  { key: 'mon', label: '월요일', desc: '민경림 쌤' },
  { key: 'tue', label: '화요일', desc: '런치+김진희 쌤' },
  { key: 'wed', label: '수요일', desc: '이명은 쌤' },
  { key: 'thu', label: '목요일', desc: '김진희 쌤' },
  { key: 'fri', label: '금요일', desc: '런치+홍성우 쌤' },
];

export default function ScheduleTab({ onGoToTickets }: ScheduleTabProps) {
  const { classes, bookings, userTickets, currentUser, bookClass, cancelBooking } = useApp();
  const [selectedWeekId, setSelectedWeekId] = useState<string>(WEEKS[0].id);
  const [selectedDay, setSelectedDay] = useState<ClassSession['dayOfWeek']>('fri'); // Friday default to showcase Pas de deux
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const selectedWeek = WEEKS.find((w) => w.id === selectedWeekId) || WEEKS[0];

  // Filter classes for selected day
  const dayClasses = classes.filter((c) => c.dayOfWeek === selectedDay);

  // Available tickets for current user
  const activeTickets = userTickets.filter(
    (t) => t.userId === currentUser.id && t.status === 'active' && t.remainingCount > 0
  );
  const totalRemaining = activeTickets.reduce((sum, t) => sum + t.remainingCount, 0);

  const handleBook = (cls: ClassSession) => {
    if (cls.status === 'holiday') {
      alert(`해당 수업은 [${cls.holidayReason || '공휴일 휴강'}]으로 예약이 불가합니다.`);
      return;
    }

    if (activeTickets.length === 0) {
      if (confirm('보유하신 수강권/쿠폰이 없습니다. 수강권 신청 화면으로 이동하시겠습니까?')) {
        onGoToTickets();
      }
      return;
    }

    const selectedTicket = activeTickets[0];
    const res = bookClass(cls.id, selectedTicket.id);

    setActionMessage(res.message);
    setTimeout(() => setActionMessage(null), 4000);
  };

  const handleCancel = (bookingId: string) => {
    if (confirm('수업 예약을 취소하시겠습니까? (규정 한도 내 수강권이 자동 환원됩니다)')) {
      const res = cancelBooking(bookingId);
      setActionMessage(res.message);
      setTimeout(() => setActionMessage(null), 4000);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Top Banner: Soft Lavender / Lilac Pass Card */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-3xl p-4.5 text-white shadow-md relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-purple-100 flex items-center gap-1.5">
              <Ticket className="w-3.5 h-3.5 text-purple-200" />
              내 보유 수강권 잔여 횟수
            </span>
            <h2 className="text-2xl font-black mt-0.5 tracking-tight font-mono flex items-baseline gap-1">
              {totalRemaining}
              <span className="text-xs font-normal text-purple-100">회 이용 가능</span>
            </h2>
          </div>
          <button
            onClick={onGoToTickets}
            className="px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold text-xs border border-white/25 backdrop-blur-xs transition-all flex items-center gap-1 active:scale-95 shadow-xs"
          >
            <span>쿠폰 충전</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-90" />
          </button>
        </div>
      </div>

      {/* Action Toast Feedback */}
      {actionMessage && (
        <div className="p-3.5 bg-violet-900/90 text-white text-xs rounded-2xl shadow-lg flex items-center gap-2.5 animate-in slide-in-from-top duration-300 border border-violet-700/60 backdrop-blur-md">
          <AlertCircle className="w-4 h-4 text-purple-300 shrink-0" />
          <span className="font-medium leading-relaxed">{actionMessage}</span>
        </div>
      )}

      {/* Week Selector Dropdown / Notice (Monthly Timetable Variations) */}
      <div className="bg-white rounded-2xl border border-violet-100/90 p-3 shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-violet-600" />
            수강 주차 / 월별 일정
          </span>
          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            {selectedWeek.badge}
          </span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {WEEKS.map((w) => (
            <button
              key={w.id}
              onClick={() => setSelectedWeekId(w.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedWeekId === w.id
                  ? 'bg-violet-100 text-violet-800 border border-violet-300'
                  : 'bg-slate-50 text-slate-600 border border-slate-200/80 hover:bg-slate-100'
              }`}
            >
              {w.label.split('(')[0].trim()}
              <span className="text-[10px] opacity-70 ml-1">
                ({w.label.split('(')[1]?.replace(')', '')})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Day Selector Pill Tabs with Dates */}
      <div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {DAYS.map((d) => {
            const isSelected = selectedDay === d.key;
            const dateStr = selectedWeek.dates[d.key];

            return (
              <button
                key={d.key}
                onClick={() => setSelectedDay(d.key)}
                className={`flex-1 min-w-[70px] py-2 px-1 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex flex-col items-center ${
                  isSelected
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-violet-50/40'
                }`}
              >
                <span className={`text-[10px] font-mono font-normal ${isSelected ? 'text-purple-200' : 'text-slate-400'}`}>
                  {dateStr}
                </span>
                <span className="text-xs font-bold mt-0.5">{d.label.replace('요일', '')}</span>
                <span className={`text-[9px] font-normal truncate max-w-[65px] ${isSelected ? 'text-purple-100' : 'text-slate-400'}`}>
                  {d.desc.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Classes List (Soft studio cards) */}
      <div className="space-y-3">
        {dayClasses.map((cls) => {
          // Booking stats
          const classBookings = bookings.filter(
            (b) => b.classId === cls.id && b.status !== 'cancelled'
          );
          const confirmedCount = classBookings.filter((b) => b.status === 'confirmed').length;
          const waitlistCount = classBookings.filter((b) => b.status === 'waitlist').length;
          const isFull = confirmedCount >= cls.capacity;
          const remainingSlots = Math.max(0, cls.capacity - confirmedCount);

          // User booking status for this class
          const myBooking = bookings.find(
            (b) => b.classId === cls.id && b.userId === currentUser.id && b.status !== 'cancelled'
          );

          const isPasDeDeux = cls.id === 'class-fri-pasdedeux';
          const isHoliday = cls.status === 'holiday';
          const isMakeup = cls.status === 'makeup';

          return (
            <div
              key={cls.id}
              className={`bg-white rounded-3xl border p-4 shadow-2xs transition-all ${
                myBooking
                  ? 'border-violet-400 ring-2 ring-violet-100'
                  : isPasDeDeux
                  ? 'border-purple-300 bg-purple-50/25'
                  : isHoliday
                  ? 'border-rose-200 bg-rose-50/20 opacity-80'
                  : 'border-slate-200/90 hover:border-violet-300'
              }`}
            >
              {/* StudioMate Style Time Header with Soft Violet Bar */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className={`w-1 h-3.5 rounded-full ${isHoliday ? 'bg-rose-400' : 'bg-violet-600'}`} />
                  <span className="font-extrabold text-sm text-slate-800 font-mono tracking-tight">
                    {cls.time.split(' ')[0]} {cls.time.split(' ')[1]} {cls.time.split(' ')[2]}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {cls.time.includes('(') ? `(${cls.time.split('(')[1]}` : ''}
                  </span>
                </div>

                {isHoliday ? (
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    휴강 ({cls.holidayReason || '공휴일'})
                  </span>
                ) : isMakeup ? (
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    보강 수업
                  </span>
                ) : isPasDeDeux ? (
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 shadow-2xs">
                    Full 파드되 (정원 5명)
                  </span>
                ) : cls.time.includes('Half') || cls.time.includes('런치') ? (
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Half 40분
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                    Full 80분
                  </span>
                )}
              </div>

              {/* Title & Instructor */}
              <div className="flex items-start justify-between mt-1">
                <div>
                  <h3 className="font-bold text-slate-900 text-base tracking-tight">
                    {cls.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <User className="w-3.5 h-3.5 text-violet-400" />
                    <span className="font-semibold text-slate-700">{cls.instructor}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[11px] text-slate-400">{cls.level}</span>
                  </div>
                </div>

                {/* Capacity Counter */}
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-slate-500">예약</span>
                    <span
                      className={`font-bold font-mono text-sm ${
                        isFull ? 'text-violet-700' : 'text-violet-600'
                      }`}
                    >
                      {confirmedCount}
                    </span>
                    <span className="text-slate-400 font-mono">/{cls.capacity}명</span>
                  </div>
                  {waitlistCount > 0 && (
                    <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-sm mt-0.5 inline-block font-medium">
                      대기 {waitlistCount}명
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed bg-slate-50/70 p-2.5 rounded-2xl">
                {cls.description}
              </p>

              {/* Action Buttons Area */}
              <div className="mt-3.5 pt-1">
                {isHoliday ? (
                  <div className="py-2.5 text-center bg-rose-50/80 border border-rose-200 text-rose-700 text-xs font-semibold rounded-2xl">
                    공휴일 휴강인 수업입니다.
                  </div>
                ) : myBooking ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-2xl p-2.5">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>
                        {myBooking.status === 'confirmed'
                          ? '예약 확정됨'
                          : `대기 ${myBooking.waitlistNumber}번`}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCancel(myBooking.id)}
                      className="text-xs text-slate-600 hover:text-red-600 font-semibold px-2.5 py-1 rounded-xl bg-white border border-slate-200 hover:border-red-200 transition-colors shadow-2xs"
                    >
                      예약 취소
                    </button>
                  </div>
                ) : isFull ? (
                  <button
                    onClick={() => handleBook(cls)}
                    className="w-full py-2.5 rounded-2xl border border-amber-400 bg-amber-50/60 hover:bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.99]"
                  >
                    <span>대기가능</span>
                    <span className="text-[10px] bg-amber-200/70 text-amber-900 px-1.5 py-0.5 rounded-md font-mono">
                      대기 {waitlistCount + 1}번 신청
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleBook(cls)}
                    className="w-full py-2.5 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.99]"
                  >
                    <span>예약하기</span>
                    <span className="text-[11px] font-normal text-purple-200 font-mono">
                      (잔여 {remainingSlots}석)
                    </span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
