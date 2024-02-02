import express from "express";
import NodeCache from "node-cache";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
// importing routes
import userRoutes from "./routes/user.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
const app = express();
const port = 3000;
connectDB();
export const myCache = new NodeCache();
// middleware
app.use(express.json());
// using routers
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/order", orderRoutes);
app.get("/", (req, res) => {
    res.send("working");
});
//
app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware);
app.listen(port, () => {
    console.log(`Server is working on http://localhost:${port}`);
});
