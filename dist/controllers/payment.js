import { paymentTryCatch } from "../middlewares/error.js";
import { Coupon } from "../models/coupon.js";
import ErrorHandler from "../utils/utility-clasee.js";
import { stripe } from "../app.js";
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
export const deleteCoupon = paymentTryCatch(async (req, res, next) => {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon)
        return next(new ErrorHandler("Invalid Coupon ID", 400));
    return res.status(200).json({
        success: true,
        message: `Coupon ${coupon.code} Deleted Successfully`,
    });
});
export const createPaymentIntent = paymentTryCatch(async (req, res, next) => {
    const { amount } = req.body;
    if (!amount)
        return next(new ErrorHandler("Please enter amount", 400));
    const paymentIntent = await stripe.paymentIntents.create({
        amount: Number(amount) * 100,
        currency: "npr",
    });
    return res.status(201).json({
        success: true,
        clientSecret: paymentIntent.client_secret,
    });
});
