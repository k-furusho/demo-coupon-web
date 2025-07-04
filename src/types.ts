export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  registeredAt: number;
}

export type CouponStatus = 'active' | 'expired';

export interface Coupon {
  id: string;
  code: string; // 110桁の英数字
  status: CouponStatus;
  maxUses: number;
  expiresAt: number; // Unix time (ms)
  createdAt: number;
  eligibleMemberIds: string[]; // 利用可能会員ID
}

export interface CouponUsage {
  id: string;
  couponId: string;
  memberId: string;
  usedAt: number; // Unix time (ms)
  count: number; // 今回利用回数
  latitude: number | null;
  longitude: number | null;
} 