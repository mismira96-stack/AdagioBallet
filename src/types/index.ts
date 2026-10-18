export type Role = 'member' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string; // 사내 이메일
  phone: string;
  department: string; // 소속/사업부/부서
  role: Role;
}

export interface TicketType {
  id: string;
  title: string;
  description: string;
  totalCount: number;
  price: number;
  validDays: number;
  category: 'regular' | 'coupon'; // 정기권 or 1회 쿠폰
}

export interface UserTicket {
  id: string;
  userId: string;
  ticketTypeId: string;
  title: string;
  totalCount: number;
  remainingCount: number;
  expiresAt: string; // YYYY-MM-DD
  status: 'active' | 'used' | 'expired';
}

export interface ClassSession {
  id: string;
  dayOfWeek: 'mon' | 'tue' | 'wed' | 'thu' | 'fri';
  dayLabel: string; // 월요일, 화요일...
  time: string; // 19:00 - 20:10
  title: string;
  instructor: string;
  level: string; // 입문, 레벨1, 레벨1.5, 토슈즈
  capacity: number; // 기본 14명 (하프는 7명)
  location: string;
  description: string;
}

export interface Booking {
  id: string;
  classId: string;
  userId: string;
  userName: string;
  userPhone: string;
  userDept: string;
  ticketId: string;
  bookedAt: string;
  status: 'confirmed' | 'waitlist' | 'cancelled';
  waitlistNumber?: number;
}

export interface PaymentRequest {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  ticketTypeId: string;
  ticketTitle: string;
  amount: number;
  depositorName: string; // 입금자명
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  approvedAt?: string;
}

export interface RefundRequest {
  id: string;
  userId: string;
  userName: string;
  ticketId: string;
  ticketTitle: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  reason: string;
  amount: number;
  status: 'requested' | 'completed';
  requestedAt: string;
  processedAt?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: '필독' | '일반' | '수업';
  author: string;
  createdAt: string;
}
