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
