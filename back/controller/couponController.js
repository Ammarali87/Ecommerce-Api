import { getAll, getOne, createOne, updateOne, deleteOne } from './handlersFactory';
import Coupon from '../models/couponModel';

export const getCoupons = getAll(Coupon);

export const getCoupon = getOne(Coupon);

export const createCoupon = createOne(Coupon);

export const updateCoupon = updateOne(Coupon);

export const deleteCoupon = deleteOne(Coupon);