import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { myOrder, newOrder, allOrders, getSingleOrder, processOrder, deleteOrder, } from "../controllers/order.js";
const app = express.Router();
app.post("/new", newOrder);
app.get("/my", myOrder);
app.get("/all", adminOnly, allOrders);
app
    .route("/:id")
    .get(getSingleOrder)
    .put(adminOnly, processOrder)
    .delete(adminOnly, deleteOrder);
export default app;
