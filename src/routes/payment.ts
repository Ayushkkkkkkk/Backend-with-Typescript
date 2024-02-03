import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { newCoupon } from "../controllers/payment.js";

const app = express.Router();
///api/v1/payment/coupon/new
app.post("/coupon/new", newCoupon);

export default app;
