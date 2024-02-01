import { ProductTryCatch } from "../middlewares/error.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-clasee.js";
import { rm } from "fs";
export const newProduct = ProductTryCatch(async (req, res, next) => {
    const { name, category, price, stock } = req.body;
    const photo = req.file;
    if (!photo)
        return next(new ErrorHandler("Please add photo", 400));
    if (!name || !category || !price || !stock) {
        rm(photo.path, () => {
            console.log("deleted");
        });
        return next(new ErrorHandler("Please enter all field", 400));
    }
    await Product.create({
        name,
        category: category.toLowerCase(),
        price,
        stock,
        photo: photo.path,
    });
    return res.status(201).json({
        sucess: true,
        message: "Product created sucessful",
    });
});
export const getLatestProducts = ProductTryCatch(async (req, res, next) => {
    const products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
    return res.status(200).json({
        sucess: true,
        products,
    });
});
export const getAllCategories = ProductTryCatch(async (req, res, next) => {
    const categories = await Product.distinct("category");
    return res.status(200).json({
        sucess: true,
        categories,
    });
});
export const getAdminProducts = ProductTryCatch(async (req, res, next) => {
    const products = await Product.find({});
    return res.status(200).json({
        sucess: true,
        products,
    });
});
export const getSingleProduct = ProductTryCatch(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 400));
    }
    return res.status(200).json({
        sucess: true,
        product,
    });
});
export const updateProduct = ProductTryCatch(async (req, res, next) => {
    const id = req.params.id;
    const { name, category, price, stock } = req.body;
    const photo = req.file;
    const product = await Product.findById(id);
    if (!product) {
        return next(new ErrorHandler("invalid product", 400));
    }
    if (photo) {
        rm(product.photo, () => {
            console.log("old photo deleated");
        });
        product.photo = photo.path;
    }
    if (name)
        product.name = name;
    if (price)
        product.price = price;
    if (stock)
        product.stock = stock;
    if (category)
        product.category = category;
    await product.save();
    return res.status(200).json({
        sucess: true,
        message: "Product updated sucessful",
    });
});
export const deleteProduct = ProductTryCatch(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("invalid product", 400));
    }
    rm(product.photo, () => {
        console.log("Product photo deleted");
    });
    await Product.deleteOne();
    return res.status(200).json({
        sucess: true,
        message: "product Deleted succefully",
    });
});
