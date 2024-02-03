import express, { NextFunction } from "express";
import { Request, Response } from "express";
import NodeCache from "node-cache";

import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";

// importing routes
import userRoutes from "./routes/user.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import paymentRoute from "./routes/payment.js";
import { config } from "dotenv";
import morgan from "morgan";

config({
  path: "./.env",
});

const app = express();
const port: number = 3000;

connectDB();

export const myCache = new NodeCache();

// middleware
app.use(express.json());
app.use(morgan("dev"));

// using routers
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/payment", paymentRoute);

app.get("/", (req, res) => {
  res.send("working");
});

//
app.use("/uploads", express.static("uploads"));

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is working on http://localhost:${port}`);
});
