'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { CLUB_INFO } from '@/data/mockData';
import {
  User,
  Mail,
  Phone,
  Building,
  ShieldCheck,
  RotateCcw,
  Check,
  CreditCard,
  HeartHandshake,
} from 'lucide-react';

export default function ProfileTab() {
  const { currentUser, updateUserProfile, switchUserRole, resetToDefault } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [department, setDepartment] = useState(currentUser.department);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      department: department.trim(),
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-linear-to-tr from-rose-500 to-rose-300 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            {currentUser.name.substring(0, 1)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">{currentUser.name}</h2>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  currentUser.role === 'admin'
                    ? 'bg-rose-100 text-rose-700 border border-rose-300'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {currentUser.role === 'admin' ? '동호회 운영진' : '정회원'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{currentUser.department}</p>
          </div>
        </div>

        {/* Test Mode Switcher */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">테스트 모드 전환</span>
          <div className="flex gap-1.5">
            <button
              onClick={() => switchUserRole('member')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                currentUser.role === 'member'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              일반회원(김발레)
            </button>
            <button
              onClick={() => switchUserRole('admin')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                currentUser.role === 'admin'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              운영진(최운영)
            </button>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <h3 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-1.5">
          <User className="w-4 h-4 text-rose-500" />
          회원 가입 및 기본 정보 수정
        </h3>

        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
              <User className="w-3 h-3 text-slate-400" />
              이름
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Mail className="w-3 h-3 text-slate-400" />
              사내 이메일 주소
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="id@company.com"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Phone className="w-3 h-3 text-slate-400" />
              휴대전화번호
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010-0000-0000"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Building className="w-3 h-3 text-slate-400" />
              소속 부서 / 사업부
            </label>
            <input
              type="text"
              required
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="예: 디지털솔루션사업부 개발팀"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs active:scale-[0.99]"
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>저장 완료!</span>
              </>
            ) : (
              <span>내 정보 저장하기</span>
            )}
          </button>
        </form>
      </div>

      {/* Club Bank Account Card */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-4 text-xs space-y-1.5">
        <div className="font-bold text-slate-700 flex items-center gap-1.5">
          <CreditCard className="w-4 h-4 text-rose-500" />
          {CLUB_INFO.name} 공식 계좌
        </div>
        <p className="font-mono font-bold text-slate-800 text-sm">
          {CLUB_INFO.bankName} {CLUB_INFO.accountNumber}
        </p>
        <p className="text-slate-500 text-[11px]">
          예금주: {CLUB_INFO.accountHolder} • 환불 정산일: {CLUB_INFO.refundDayText}
        </p>
      </div>

      {/* Reset button for testing */}
      <div className="pt-2 text-center">
        <button
          onClick={() => {
            if (confirm('모든 로컬 테스트 데이터를 초기 상태로 리셋하시겠습니까?')) {
              resetToDefault();
            }
          }}
          className="text-slate-400 hover:text-red-500 text-[11px] flex items-center justify-center gap-1 mx-auto transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>테스트 데이터 초기화</span>
        </button>
      </div>
    </div>
  );
}
