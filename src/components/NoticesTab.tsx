'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Bell, ChevronDown, ChevronUp, Pin } from 'lucide-react';

export default function NoticesTab() {
  const { notices } = useApp();
  const [filter, setFilter] = useState<'전체' | '필독' | '수업' | '일반'>('전체');
  const [expandedId, setExpandedId] = useState<string | null>(notices[0]?.id || null);

  const filteredNotices = notices.filter((n) => {
    if (filter === '전체') return true;
    return n.category === filter;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
          <Bell className="w-4 h-4 text-rose-500" />
          공지사항 & 수강안내
        </h2>
        <span className="text-[11px] text-slate-400">총 {notices.length}개의 소식</span>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5">
        {(['전체', '필독', '수업', '일반'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === cat
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notices Accordion */}
      <div className="space-y-2.5">
        {filteredNotices.map((n) => {
          const isExpanded = expandedId === n.id;
          const isUrgent = n.category === '필독';

          return (
            <div
              key={n.id}
              className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                isUrgent ? 'border-rose-200 shadow-xs' : 'border-slate-200'
              }`}
            >
              {/* Header */}
              <button
                onClick={() => toggleExpand(n.id)}
                className="w-full p-4 text-left flex items-start justify-between gap-3 hover:bg-slate-50/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    {isUrgent ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white flex items-center gap-0.5">
                        <Pin className="w-2.5 h-2.5" />
                        필독
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {n.category}
                      </span>
                    )}
                    <span className="text-[11px] text-slate-400 font-mono">{n.createdAt}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug">{n.title}</h3>
                </div>

                <div className="text-slate-400 pt-1 shrink-0">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Body */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-100 text-xs text-slate-600 whitespace-pre-line leading-relaxed bg-slate-50/40">
                  {n.content}
                  <div className="mt-3 pt-2 border-t border-slate-200/60 text-[11px] text-slate-400 flex justify-between">
                    <span>작성자: {n.author}</span>
                    <span>아다지오 발레 동호회</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
