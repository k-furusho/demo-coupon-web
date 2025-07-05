import useSWR from 'swr';
import { Member, Coupon, CouponUsage } from '../types';

const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then((r) => r.json());

export const useMembers = () => useSWR('/api/members', fetcher, { refreshInterval: 3000 });
export const useCoupons = () => useSWR('/api/coupons', fetcher, { refreshInterval: 3000 });
export const useCoupon = (id: string | null) => useSWR(id ? `/api/coupons/${id}` : null, fetcher);
export const useUsages = (couponId?: string) =>
  useSWR(`/api/usages${couponId ? `?couponId=${couponId}` : ''}`, fetcher, { refreshInterval: 3000 });

export const apiPost = async <T>(url: string, body: any): Promise<T> => {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    credentials: 'include',
  });
  return res.json();
};

export const createMember = (data: Omit<Member, 'id' | 'registeredAt'>) => apiPost<Member>('/api/members', data);
export const createCoupon = (data: Omit<Coupon, 'id' | 'createdAt'>) => apiPost<Coupon>('/api/coupons', data);
export const createUsage = (data: Omit<CouponUsage, 'id' | 'usedAt'>) => apiPost<CouponUsage>('/api/usages', data); 