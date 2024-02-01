import { ProductTryCatch } from "../middlewares/error.js";
import { Product } from "../models/product.js";
export const newProduct = ProductTryCatch(async (req, res, next) => {
    const { name, category, price, stock } = req.body;
    const photo = req.file;
    await Product.create({
        name,
        category: category.toLowerCase(),
        price,
        stock,
        photo: photo?.path,
    });
    return res.status(201).json({
        sucess: true,
        message: "Product created sucessful",
    });
});
