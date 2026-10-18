'use client';

import React, { useState } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import Header from '@/components/Header';
import Navigation, { TabType } from '@/components/Navigation';
import ScheduleTab from '@/components/ScheduleTab';
import TicketsTab from '@/components/TicketsTab';
import NoticesTab from '@/components/NoticesTab';
import AdminTab from '@/components/AdminTab';
import ProfileTab from '@/components/ProfileTab';

function MainAppContent() {
  const [currentTab, setCurrentTab] = useState<TabType>('schedule');
  const { currentUser } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Header */}
      <Header />

      {/* Main Content Area (Mobile Frame) */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 pt-4 pb-24">
        {currentTab === 'schedule' && (
          <ScheduleTab onGoToTickets={() => setCurrentTab('tickets')} />
        )}
        {currentTab === 'tickets' && <TicketsTab />}
        {currentTab === 'notices' && <NoticesTab />}
        {currentTab === 'admin' && <AdminTab />}
        {currentTab === 'profile' && <ProfileTab />}
      </main>

      {/* Sticky Bottom Navigation Bar */}
      <Navigation currentTab={currentTab} onChangeTab={setCurrentTab} />
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
