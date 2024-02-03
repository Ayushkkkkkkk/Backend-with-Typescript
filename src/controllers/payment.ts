import { TryCatch, paymentTryCatch } from "../middlewares/error.js";
import { Request, Response, NextFunction } from "express";
import { couponRequestBody } from "../types/types.js";
import { Coupon } from "../models/coupon.js";
import ErrorHandler from "../utils/utility-clasee.js";

export const newCoupon = paymentTryCatch(
  async (
    req: Request<{}, {}, couponRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { code, amount } = req.body;
    if (!code || !amount)
      return next(new ErrorHandler("please enter latest cupon code", 400));
    await Coupon.create({ code, amount });

    return res.status(201).json({
      sucess: true,
      message: `coupon ${code} created sucessfully`,
    });
  }
);

export const applyDiscount = paymentTryCatch(
  async (
    req: Request<{}, {}, couponRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { code } = req.query;
    const discount = await Coupon.findOne({ code });

    if (!discount) return next(new ErrorHandler("Invalid coupon code", 400));

    return res.status(200).json({
      sucess: true,
      discount: discount.amount,
    });
  }
);
