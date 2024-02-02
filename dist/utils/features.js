import mongoose from "mongoose";
import { myCache } from "../app.js";
import { Product } from "../models/product.js";
export const connectDB = () => {
    mongoose
        .connect("mongodb://localhost:27017", {
        dbName: "ecommerce_24",
    })
        .then((c) => console.log(`db connected to ${c.connection.host}`))
        .catch((e) => console.log(e));
};
export const invalidateCache = async ({ product, order, admin, userId, orderId, productId, }) => {
    if (product) {
        const productKeys = [
            "latest-products",
            "categories",
            "all-products",
        ];
        const products = await Product.find({}).select("_id");
        products.forEach((i) => {
            productKeys.push(`product-${i._id}`);
        });
        myCache.del(productKeys);
    }
    if (order) {
        const ordersKeys = [
            "all-orders",
            `my-orders-${userId}`,
            `order-${orderId}`,
        ];
        myCache.del(ordersKeys);
    }
    if (admin) {
        myCache.del([
            "admin-stats",
            "admin-pie-charts",
            "admin-bar-charts",
            "admin-line-charts",
        ]);
    }
};
