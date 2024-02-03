import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import {
  allCoupons,
  applyDiscount,
  deleteCoupon,
  newCoupon,
} from "../controllers/payment.js";

const app = express.Router();
///api/v1/payment/coupon/new

app.get("/discount", applyDiscount);

app.post("/coupon/new", newCoupon);



app.get("/coupon/all", allCoupons);

app.delete("/coupon/:id", deleteCoupon);

export default app;
