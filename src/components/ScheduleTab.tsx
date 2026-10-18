'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ClassSession } from '@/types';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  Users,
  CheckCircle2,
  AlertCircle,
  Flame,
  Ticket,
} from 'lucide-react';

interface ScheduleTabProps {
  onGoToTickets: () => void;
}

const DAYS: { key: ClassSession['dayOfWeek']; label: string }[] = [
  { key: 'mon', label: '월요일' },
  { key: 'tue', label: '화요일' },
  { key: 'wed', label: '수요일 (2+Half)' },
  { key: 'thu', label: '목요일' },
  { key: 'fri', label: '금요일' },
];

export default function ScheduleTab({ onGoToTickets }: ScheduleTabProps) {
  const { classes, bookings, userTickets, currentUser, bookClass, cancelBooking } = useApp();
  const [selectedDay, setSelectedDay] = useState<ClassSession['dayOfWeek']>('wed'); // Wednesday has 2+half
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Filter classes for selected day
  const dayClasses = classes.filter((c) => c.dayOfWeek === selectedDay);

  // Available tickets for current user
  const activeTickets = userTickets.filter(
    (t) => t.userId === currentUser.id && t.status === 'active' && t.remainingCount > 0
  );
  const totalRemaining = activeTickets.reduce((sum, t) => sum + t.remainingCount, 0);

  const handleBook = (classId: string) => {
    if (activeTickets.length === 0) {
      if (confirm('보유하신 수강권이 없습니다. 수강권 충전 화면으로 이동하시겠습니까?')) {
        onGoToTickets();
      }
      return;
    }

    const selectedTicket = activeTickets[0];
    const res = bookClass(classId, selectedTicket.id);

    setActionMessage(res.message);
    setTimeout(() => setActionMessage(null), 4000);
  };

  const handleCancel = (bookingId: string) => {
    if (confirm('수업 예약을 취소하시겠습니까? (수강권 1회가 자동 환원됩니다)')) {
      const res = cancelBooking(bookingId);
      setActionMessage(res.message);
      setTimeout(() => setActionMessage(null), 4000);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Top Banner: User Pass Status */}
      <div className="bg-linear-to-r from-rose-500 to-rose-400 rounded-2xl p-4 text-white shadow-md flex items-center justify-between">
        <div>
          <span className="text-[11px] font-medium text-rose-100 flex items-center gap-1">
            <Ticket className="w-3.5 h-3.5" />
            내 보유 수강권
          </span>
          <h2 className="text-xl font-extrabold mt-0.5">
            잔여 {totalRemaining}회{' '}
            <span className="text-xs font-normal text-rose-100 opacity-90">이용 가능</span>
          </h2>
        </div>
        <button
          onClick={onGoToTickets}
          className="px-3.5 py-2 rounded-xl bg-white text-rose-600 font-bold text-xs shadow-xs hover:bg-rose-50 transition-all active:scale-95"
        >
          수강권 충전하기
        </button>
      </div>

      {/* Action Toast Feedback */}
      {actionMessage && (
        <div className="p-3 bg-slate-900 text-white text-xs rounded-xl shadow-lg flex items-center gap-2 animate-in slide-in-from-top duration-300">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span className="font-medium leading-relaxed">{actionMessage}</span>
        </div>
      )}

      {/* Day Selector Pill Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {DAYS.map((d) => {
          const isSelected = selectedDay === d.key;
          return (
            <button
              key={d.key}
              onClick={() => setSelectedDay(d.key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {d.label}
            </button>
          );
        })}
      </div>

      {/* Classes List */}
      <div className="space-y-3.5">
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

          // Progress percentage
          const percent = Math.min(100, Math.round((confirmedCount / cls.capacity) * 100));

          return (
            <div
              key={cls.id}
              className={`bg-white rounded-2xl border p-4.5 shadow-xs transition-all ${
                myBooking
                  ? 'border-rose-400 ring-2 ring-rose-100'
                  : isFull
                  ? 'border-slate-200 bg-slate-50/50'
                  : 'border-slate-200 hover:border-rose-200'
              }`}
            >
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                    {cls.level}
                  </span>
                  {cls.capacity === 7 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                      Half 40분
                    </span>
                  )}
                  {remainingSlots <= 2 && remainingSlots > 0 && (
                    <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-red-100 text-red-600 flex items-center gap-0.5 animate-pulse">
                      <Flame className="w-3 h-3" />
                      마감임박
                    </span>
                  )}
                </div>

                {/* Capacity Counter */}
                <div className="flex items-center gap-1 text-xs">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span className={`font-bold font-mono ${isFull ? 'text-red-500' : 'text-slate-700'}`}>
                    {confirmedCount} / {cls.capacity}명
                  </span>
                  {waitlistCount > 0 && (
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1 rounded-sm">
                      대기 {waitlistCount}
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="font-bold text-slate-900 text-base mt-2.5 tracking-tight">
                {cls.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {cls.description}
              </p>

              {/* Time, Instructor & Studio Info */}
              <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-rose-500" />
                  <span className="font-medium font-mono">{cls.time}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-rose-500" />
                  <span className="font-medium">{cls.instructor}</span>
                </div>
                <div className="flex items-center gap-1.5 col-span-2 text-slate-400 text-[11px]">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{cls.location}</span>
                </div>
              </div>

              {/* Progress bar for 14 capacity */}
              <div className="mt-3">
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      isFull ? 'bg-red-500' : percent > 70 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons Area */}
              <div className="mt-4 pt-1">
                {myBooking ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-2.5">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>
                        {myBooking.status === 'confirmed'
                          ? '수강 예약 완료'
                          : `대기 ${myBooking.waitlistNumber}번 접수됨`}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCancel(myBooking.id)}
                      className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2.5 py-1 rounded-lg bg-white border border-rose-200 hover:bg-rose-50 transition-colors"
                    >
                      예약 취소
                    </button>
                  </div>
                ) : isFull ? (
                  <button
                    onClick={() => handleBook(cls.id)}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.99]"
                  >
                    <span>정원 마감 • 대기 예약하기</span>
                    <span className="text-[10px] bg-slate-700 px-1.5 py-0.5 rounded-sm">
                      대기 {waitlistCount + 1}번
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleBook(cls.id)}
                    className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.99]"
                  >
                    <span>수강 예약하기</span>
                    <span className="text-[11px] font-normal opacity-90">
                      (잔여 {remainingSlots}석 / 수강권 1회 차감)
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
