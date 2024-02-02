import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { myOrder, newOrder } from "../controllers/order.js";
const app = express.Router();

app.post("/new", newOrder);

app.get("/my", myOrder);

app.get("/all", allOrders);

export default app;
