import { LocalDB } from './LocalDB';
import { Coupon } from '../types';

export const couponDB = new LocalDB<Coupon>('coupons'); 