import { OrderTryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { invalidateCache, reduceStock } from "../utils/features.js";
export const newOrder = OrderTryCatch(async (req, res, next) => {
    const { shippingInfo, orderItems, user, subtotal, tax, shippingCharges, discount, total, } = req.body;
    await Order.create({
        shippingInfo,
        orderItems,
        user,
        subtotal,
        tax,
        shippingCharges,
        discount,
        total,
    });
    await reduceStock(orderItems);
    await invalidateCache({ product: true, order: true, admin: true });
    res.status(201).json({
        sucess: true,
        message: "order placed sucessfully",
    });
});
