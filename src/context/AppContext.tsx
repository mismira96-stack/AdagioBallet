'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  ClassSession,
  Booking,
  UserTicket,
  PaymentRequest,
  RefundRequest,
  Notice,
  TicketType,
} from '@/types';
import {
  INITIAL_CLASSES,
  INITIAL_TICKET_TYPES,
  INITIAL_NOTICES,
  MOCK_USERS,
} from '@/data/mockData';

interface AppContextType {
  currentUser: User;
  switchUserRole: (role: 'member' | 'admin') => void;
  updateUserProfile: (profile: Partial<User>) => void;
  
  classes: ClassSession[];
  ticketTypes: TicketType[];
  userTickets: UserTicket[];
  bookings: Booking[];
  paymentRequests: PaymentRequest[];
  refundRequests: RefundRequest[];
  notices: Notice[];

  // Classes & timetable status
  updateClassStatus: (classId: string, status: 'active' | 'holiday' | 'makeup', holidayReason?: string) => void;

  // Bookings
  bookClass: (classId: string, ticketId: string) => { success: boolean; message: string; isWaitlist?: boolean };
  cancelBooking: (bookingId: string) => { success: boolean; message: string };
  getClassBookings: (classId: string) => Booking[];
  getUserBookings: (userId: string) => Booking[];

  // Payments / Passes
  requestPayment: (ticketTypeId: string, depositorName: string) => PaymentRequest;
  approvePayment: (paymentRequestId: string) => void;
  rejectPayment: (paymentRequestId: string) => void;
  
  // Refunds
  requestRefund: (ticketId: string, bankName: string, accountNumber: string, accountHolder: string, reason: string) => { success: boolean; message: string };
  completeRefund: (refundRequestId: string) => void;

  // Notices
  addNotice: (notice: Omit<Notice, 'id' | 'createdAt'>) => void;
  deleteNotice: (id: string) => void;

  // Reset
  resetToDefault: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Current user (defaults to member '김발레')
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]);

  const [classes, setClasses] = useState<ClassSession[]>(INITIAL_CLASSES);
  const [ticketTypes] = useState<TicketType[]>(INITIAL_TICKET_TYPES);

  // Persistent states
  const [userTickets, setUserTickets] = useState<UserTicket[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);
  const [notices, setNotices] = useState<Notice[]>(INITIAL_NOTICES);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedClasses = localStorage.getItem('adagio_classes');
      const savedTickets = localStorage.getItem('adagio_tickets');
      const savedBookings = localStorage.getItem('adagio_bookings');
      const savedPayments = localStorage.getItem('adagio_payments');
      const savedRefunds = localStorage.getItem('adagio_refunds');
      const savedNotices = localStorage.getItem('adagio_notices');
      const savedUser = localStorage.getItem('adagio_user');

      if (savedUser) setCurrentUser(JSON.parse(savedUser));
      if (savedClasses) setClasses(JSON.parse(savedClasses));
      
      if (savedTickets) {
        setUserTickets(JSON.parse(savedTickets));
      } else {
        // Default initial ticket for test user
        const initialTicket: UserTicket = {
          id: 'mock-user-ticket-1',
          userId: MOCK_USERS[0].id,
          ticketTypeId: 'ticket-regular-8',
          title: '11월 정기 수강권 (월 8회)',
          totalCount: 8,
          remainingCount: 7,
          maxCancellations: 2, // 취소 한도 2회
          cancellationCount: 0, // 사용한 취소 횟수
          expiresAt: '2026-11-30',
          status: 'active',
        };
        setUserTickets([initialTicket]);
      }

      if (savedBookings) {
        setBookings(JSON.parse(savedBookings));
      } else {
        // Seed some initial bookings to make classes look alive!
        const initialBookings: Booking[] = [
          {
            id: 'mock-book-1',
            classId: 'class-wed-3', // Half class (정원 7명 중 6명 찬 상태로 1분컷 느낌 테스트)
            userId: 'other-user-1',
            userName: '이유진',
            userPhone: '010-3333-4444',
            userDept: '글로벌마케팅팀',
            ticketId: 't-1',
            bookedAt: '2026-10-18 09:00',
            status: 'confirmed',
          },
          {
            id: 'mock-book-2',
            classId: 'class-wed-3',
            userId: 'other-user-2',
            userName: '박지현',
            userPhone: '010-5555-6666',
            userDept: '디자인그룹',
            ticketId: 't-2',
            bookedAt: '2026-10-18 09:01',
            status: 'confirmed',
          },
          {
            id: 'mock-book-3',
            classId: 'class-wed-3',
            userId: 'other-user-3',
            userName: '한수아',
            userPhone: '010-7777-8888',
            userDept: 'HR운영팀',
            ticketId: 't-3',
            bookedAt: '2026-10-18 09:01',
            status: 'confirmed',
          },
          {
            id: 'mock-book-4',
            classId: 'class-wed-3',
            userId: 'other-user-4',
            userName: '최유나',
            userPhone: '010-9999-0000',
            userDept: '재무관리팀',
            ticketId: 't-4',
            bookedAt: '2026-10-18 09:02',
            status: 'confirmed',
          },
          {
            id: 'mock-book-5',
            classId: 'class-wed-3',
            userId: 'other-user-5',
            userName: '강민경',
            userPhone: '010-2222-1111',
            userDept: '품질경영팀',
            ticketId: 't-5',
            bookedAt: '2026-10-18 09:02',
            status: 'confirmed',
          },
          {
            id: 'mock-book-6',
            classId: 'class-wed-3',
            userId: 'other-user-6',
            userName: '송다은',
            userPhone: '010-4444-2222',
            userDept: '선행R&D',
            ticketId: 't-6',
            bookedAt: '2026-10-18 09:02',
            status: 'confirmed',
          },
          // 1자리 남음!
        ];
        setBookings(initialBookings);
      }

      if (savedPayments) setPaymentRequests(JSON.parse(savedPayments));
      if (savedRefunds) setRefundRequests(JSON.parse(savedRefunds));
      if (savedNotices) setNotices(JSON.parse(savedNotices));

    } catch (e) {
      console.error('Failed to load local storage state:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('adagio_classes', JSON.stringify(classes));
    localStorage.setItem('adagio_tickets', JSON.stringify(userTickets));
    localStorage.setItem('adagio_bookings', JSON.stringify(bookings));
    localStorage.setItem('adagio_payments', JSON.stringify(paymentRequests));
    localStorage.setItem('adagio_refunds', JSON.stringify(refundRequests));
    localStorage.setItem('adagio_notices', JSON.stringify(notices));
    localStorage.setItem('adagio_user', JSON.stringify(currentUser));
  }, [classes, userTickets, bookings, paymentRequests, refundRequests, notices, currentUser, isLoaded]);

  // Role switch (for testing member vs admin view)
  const switchUserRole = (role: 'member' | 'admin') => {
    if (role === 'admin') {
      setCurrentUser(MOCK_USERS[1]);
    } else {
      setCurrentUser(MOCK_USERS[0]);
    }
  };

  const updateUserProfile = (profile: Partial<User>) => {
    setCurrentUser((prev) => ({ ...prev, ...profile }));
  };

  // Timetable monthly status management (holiday / makeup / active)
  const updateClassStatus = (
    classId: string,
    status: 'active' | 'holiday' | 'makeup',
    holidayReason?: string
  ) => {
    setClasses((prev) =>
      prev.map((c) => (c.id === classId ? { ...c, status, holidayReason } : c))
    );
  };

  // Booking helper
  const getClassBookings = (classId: string) => {
    return bookings.filter((b) => b.classId === classId && b.status !== 'cancelled');
  };

  const getUserBookings = (userId: string) => {
    return bookings.filter((b) => b.userId === userId && b.status !== 'cancelled');
  };

  // 1-Click Book Class (handles 14 capacity, waitlist, atomic pass deduction)
  const bookClass = (classId: string, ticketId: string) => {
    const targetClass = classes.find((c) => c.id === classId);
    if (!targetClass) return { success: false, message: '수업 정보를 찾을 수 없습니다.' };

    const ticket = userTickets.find((t) => t.id === ticketId && t.userId === currentUser.id);
    if (!ticket || ticket.remainingCount <= 0) {
      return { success: false, message: '사용 가능한 수강권 횟수가 부족합니다. 수강권을 충전해주세요.' };
    }

    // Check if already booked
    const existing = bookings.find(
      (b) => b.classId === classId && b.userId === currentUser.id && b.status !== 'cancelled'
    );
    if (existing) {
      return { success: false, message: '이미 신청하신 클래스입니다.' };
    }

    // Count confirmed bookings
    const confirmedCount = bookings.filter(
      (b) => b.classId === classId && b.status === 'confirmed'
    ).length;

    const isFull = confirmedCount >= targetClass.capacity;

    if (!isFull) {
      // Confirmed spot
      const newBooking: Booking = {
        id: `book-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        classId,
        userId: currentUser.id,
        userName: currentUser.name,
        userPhone: currentUser.phone,
        userDept: currentUser.department,
        ticketId,
        bookedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        status: 'confirmed',
      };

      // Deduct 1 count
      setUserTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, remainingCount: t.remainingCount - 1 } : t))
      );
      setBookings((prev) => [...prev, newBooking]);

      return {
        success: true,
        message: `[${targetClass.title}] ${targetClass.dayLabel} 수업이 예약되었습니다! (수강권 1회 차감)`,
        isWaitlist: false,
      };
    } else {
      // Waitlist
      const waitlistCount = bookings.filter(
        (b) => b.classId === classId && b.status === 'waitlist'
      ).length;
      const waitlistNum = waitlistCount + 1;

      const newBooking: Booking = {
        id: `book-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        classId,
        userId: currentUser.id,
        userName: currentUser.name,
        userPhone: currentUser.phone,
        userDept: currentUser.department,
        ticketId,
        bookedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        status: 'waitlist',
        waitlistNumber: waitlistNum,
      };

      // Note: for waitlist, we don't deduct pass until confirmed, or we hold it.
      // Here we don't deduct pass yet.
      setBookings((prev) => [...prev, newBooking]);

      return {
        success: true,
        message: `정원(${targetClass.capacity}명)이 마감되어 [대기 ${waitlistNum}번]으로 접수되었습니다. 취소자 발생 시 자동 승급됩니다.`,
        isWaitlist: true,
      };
    }
  };

  // Cancel Booking (checks cancellation limits, auto-refunds pass, auto-promotes waitlist!)
  const cancelBooking = (bookingId: string) => {
    const targetBooking = bookings.find((b) => b.id === bookingId);
    if (!targetBooking) return { success: false, message: '예약 정보를 찾을 수 없습니다.' };

    const wasConfirmed = targetBooking.status === 'confirmed';
    let ticketRefunded = false;
    let cancelCountMsg = '';

    if (wasConfirmed && targetBooking.ticketId) {
      const ticket = userTickets.find((t) => t.id === targetBooking.ticketId);
      if (ticket) {
        // Check cancellation limit rule
        if (ticket.maxCancellations === 0) {
          return {
            success: false,
            message: '규정상 1회 체험권/원데이 쿠폰은 노쇼 방지를 위해 예약 취소 및 변경이 불가합니다.',
          };
        }

        if (ticket.cancellationCount >= ticket.maxCancellations) {
          return {
            success: false,
            message: `이번 달 취소 가능 횟수(최대 ${ticket.maxCancellations}회)를 모두 소진하셨습니다. 추가 취소는 불가합니다.`,
          };
        }

        // Within limit: increment cancellationCount and refund remainingCount!
        setUserTickets((prev) =>
          prev.map((t) =>
            t.id === targetBooking.ticketId
              ? {
                  ...t,
                  remainingCount: t.remainingCount + 1,
                  cancellationCount: t.cancellationCount + 1,
                }
              : t
          )
        );
        ticketRefunded = true;
        cancelCountMsg = `(취소 횟수: ${ticket.cancellationCount + 1}/${ticket.maxCancellations}회 사용)`;
      }
    }

    // Cancel this booking
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
    );

    // Auto-promote first waitlisted member if available!
    if (wasConfirmed) {
      const classWaitlist = bookings
        .filter((b) => b.classId === targetBooking.classId && b.status === 'waitlist')
        .sort((a, b) => (a.waitlistNumber || 0) - (b.waitlistNumber || 0));

      if (classWaitlist.length > 0) {
        const promoted = classWaitlist[0];
        // Promote to confirmed
        setBookings((prev) =>
          prev.map((b) =>
            b.id === promoted.id ? { ...b, status: 'confirmed', waitlistNumber: undefined } : b
          )
        );
        // Deduct ticket for promoted user
        setUserTickets((prev) =>
          prev.map((t) =>
            t.id === promoted.ticketId ? { ...t, remainingCount: Math.max(0, t.remainingCount - 1) } : t
          )
        );
      }
    }

    return {
      success: true,
      message: ticketRefunded
        ? `수업 예약이 취소되었습니다. 수강권 1회가 자동 환원되었습니다. ${cancelCountMsg}`
        : '대기 예약이 취소되었습니다.',
    };
  };

  // Request Pass Purchase via Toss
  const requestPayment = (ticketTypeId: string, depositorName: string): PaymentRequest => {
    const tType = ticketTypes.find((t) => t.id === ticketTypeId);
    const newReq: PaymentRequest = {
      id: `pay-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userPhone: currentUser.phone,
      ticketTypeId,
      ticketTitle: tType?.title || '수강권',
      amount: tType?.price || 0,
      depositorName,
      status: 'pending',
      requestedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setPaymentRequests((prev) => [newReq, ...prev]);
    return newReq;
  };

  // Admin approves payment -> Auto-issue UserTicket
  const approvePayment = (paymentRequestId: string) => {
    const req = paymentRequests.find((p) => p.id === paymentRequestId);
    if (!req) return;

    const tType = ticketTypes.find((t) => t.id === req.ticketTypeId);
    if (!tType) return;

    // Calculate expiry (today + validDays)
    const expDate = new Date();
    expDate.setDate(expDate.getDate() + tType.validDays);
    const expDateStr = expDate.toISOString().substring(0, 10);

    const newTicket: UserTicket = {
      id: `ticket-${Date.now()}`,
      userId: req.userId,
      ticketTypeId: req.ticketTypeId,
      title: req.ticketTitle,
      totalCount: tType.totalCount,
      remainingCount: tType.totalCount,
      maxCancellations: tType.maxCancellations ?? 1,
      cancellationCount: 0,
      expiresAt: expDateStr,
      status: 'active',
    };

    setUserTickets((prev) => [newTicket, ...prev]);
    setPaymentRequests((prev) =>
      prev.map((p) =>
        p.id === paymentRequestId
          ? { ...p, status: 'approved', approvedAt: new Date().toISOString().replace('T', ' ').substring(0, 16) }
          : p
      )
    );
  };

  const rejectPayment = (paymentRequestId: string) => {
    setPaymentRequests((prev) =>
      prev.map((p) => (p.id === paymentRequestId ? { ...p, status: 'rejected' } : p))
    );
  };

  // Request Refund (processed on 15th)
  const requestRefund = (
    ticketId: string,
    bankName: string,
    accountNumber: string,
    accountHolder: string,
    reason: string
  ) => {
    const ticket = userTickets.find((t) => t.id === ticketId);
    if (!ticket) return { success: false, message: '수강권을 찾을 수 없습니다.' };

    const tType = ticketTypes.find((t) => t.id === ticket.ticketTypeId);
    const unitPrice = tType ? Math.floor(tType.price / tType.totalCount) : 15000;
    const estRefundAmount = unitPrice * ticket.remainingCount;

    const newRefund: RefundRequest = {
      id: `refund-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      ticketId,
      ticketTitle: ticket.title,
      bankName,
      accountNumber,
      accountHolder,
      reason,
      amount: estRefundAmount,
      status: 'requested',
      requestedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setRefundRequests((prev) => [newRefund, ...prev]);
    return {
      success: true,
      message: `환불 신청이 정상 접수되었습니다. 잔여 ${ticket.remainingCount}회 정산금액(약 ${estRefundAmount.toLocaleString()}원)은 매월 15일에 일괄 입금됩니다.`,
    };
  };

  const completeRefund = (refundRequestId: string) => {
    setRefundRequests((prev) =>
      prev.map((r) =>
        r.id === refundRequestId
          ? { ...r, status: 'completed', processedAt: new Date().toISOString().replace('T', ' ').substring(0, 16) }
          : r
      )
    );
  };

  // Notices
  const addNotice = (noticeData: Omit<Notice, 'id' | 'createdAt'>) => {
    const newNotice: Notice = {
      id: `notice-${Date.now()}`,
      ...noticeData,
      createdAt: new Date().toISOString().substring(0, 10),
    };
    setNotices((prev) => [newNotice, ...prev]);
  };

  const deleteNotice = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  };

  const resetToDefault = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchUserRole,
        updateUserProfile,
        classes,
        ticketTypes,
        userTickets,
        bookings,
        paymentRequests,
        refundRequests,
        notices,
        updateClassStatus,
        bookClass,
        cancelBooking,
        getClassBookings,
        getUserBookings,
        requestPayment,
        approvePayment,
        rejectPayment,
        requestRefund,
        completeRefund,
        addNotice,
        deleteNotice,
        resetToDefault,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
