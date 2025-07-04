import { LocalDB } from './LocalDB';
import { CouponUsage } from '../types';

export const usageDB = new LocalDB<CouponUsage>('coupon_usages'); 