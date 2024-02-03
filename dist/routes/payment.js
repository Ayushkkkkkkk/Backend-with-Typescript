import express from "express";
import { applyDiscount, newCoupon } from "../controllers/payment.js";
const app = express.Router();
///api/v1/payment/coupon/new
app.post("/coupon/new", newCoupon);
app.get("/discount", applyDiscount);
export default app;
