import { paymentTryCatch } from "../middlewares/error.js";
import { Coupon } from "../models/coupon.js";
import ErrorHandler from "../utils/utility-clasee.js";
export const newCoupon = paymentTryCatch(async (req, res, next) => {
    const { code, amount } = req.body;
    if (!code || !amount)
        return next(new ErrorHandler("please enter latest cupon code", 400));
    await Coupon.create({ code, amount });
    return res.status(201).json({
        sucess: true,
        message: `coupon ${code} created sucessfully`,
    });
});
export const applyDiscount = paymentTryCatch(async (req, res, next) => {
    const { code } = req.query;
    const discount = await Coupon.findOne({ code });
    if (!discount)
        return next(new ErrorHandler("Invalid coupon code", 400));
    return res.status(200).json({
        sucess: true,
        discount: discount.amount,
    });
});
export const allCoupons = paymentTryCatch(async (req, res, next) => {
    const coupons = await Coupon.find({});
    return res.status(200).json({
        success: true,
        coupons,
    });
});
