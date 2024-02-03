import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import {
  allCoupons,
  applyDiscount,
  newCoupon,
} from "../controllers/payment.js";

const app = express.Router();
///api/v1/payment/coupon/new
app.post("/coupon/new", newCoupon);

app.get("/discount", applyDiscount);

app.get("/coupon/all", allCoupons);

export default app;
