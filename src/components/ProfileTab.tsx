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
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-500 to-purple-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            {currentUser.name.substring(0, 1)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">{currentUser.name}</h2>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  currentUser.role === 'admin'
                    ? 'bg-purple-100 text-purple-800 border border-purple-200'
                    : 'bg-violet-50 text-violet-700 border border-violet-200'
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
          <span className="text-slate-500 font-medium">체험 모드 전환</span>
          <div className="flex gap-1.5">
            <button
              onClick={() => switchUserRole('member')}
              className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-colors ${
                currentUser.role === 'member'
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              일반회원(김발레)
            </button>
            <button
              onClick={() => switchUserRole('admin')}
              className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-colors ${
                currentUser.role === 'admin'
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              운영진(최운영)
            </button>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs">
        <h3 className="text-xs font-bold text-slate-800 mb-3.5 flex items-center gap-1.5">
          <User className="w-4 h-4 text-violet-600" />
          회원 가입 및 기본 정보 수정
        </h3>

        <form onSubmit={handleSave} className="space-y-3.5">
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
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-violet-500 focus:outline-hidden font-medium bg-slate-50/50"
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
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-violet-500 focus:outline-hidden font-mono bg-slate-50/50"
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
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-violet-500 focus:outline-hidden font-mono bg-slate-50/50"
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
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-violet-500 focus:outline-hidden bg-slate-50/50"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs active:scale-[0.99]"
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>저장 완료되었습니다</span>
              </>
            ) : (
              <span>내 정보 저장하기</span>
            )}
          </button>
        </form>
      </div>

      {/* Club Bank Account Card */}
      <div className="bg-slate-100/70 rounded-3xl border border-slate-200/80 p-4 text-xs space-y-1.5">
        <div className="font-bold text-slate-700 flex items-center gap-1.5">
          <CreditCard className="w-4 h-4 text-violet-600" />
          {CLUB_INFO.name} 공식 계좌
        </div>
        <p className="font-mono font-bold text-slate-900 text-sm">
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
          className="text-slate-400 hover:text-rose-500 text-[11px] flex items-center justify-center gap-1 mx-auto transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>테스트 데이터 초기화</span>
        </button>
      </div>
    </div>
  );
}
