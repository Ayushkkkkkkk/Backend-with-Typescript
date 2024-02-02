import { ProductTryCatch } from "../middlewares/error.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-clasee.js";
import { rm } from "fs";
import { myCache } from "../app.js";
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
    let products = [];
    if (myCache.has("latest-product"))
        products = JSON.parse(myCache.get("latest-product"));
    else {
        products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
        // stores the data in cache memory prevents multiple call to database
        myCache.set("latest-product", JSON.stringify(products));
    }
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
export const getAllProducts = ProductTryCatch(async (req, res, next) => {
    const { search, sort, category, price } = req.query;
    const page = Number(req.query.page) || 1;
    // 1,2,3,4,5,6,7,8
    // 9,10,11,12,13,14,15,16
    // 17,18,19,20,21,22,23,24
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit;
    const baseQuery = {};
    if (search)
        baseQuery.name = {
            $regex: search,
            $options: "i",
        };
    if (price)
        baseQuery.price = {
            $lte: Number(price),
        };
    if (category)
        baseQuery.category = category;
    const productsPromise = Product.find(baseQuery)
        .sort(sort && { price: sort === "asc" ? 1 : -1 })
        .limit(limit)
        .skip(skip);
    const [products, filteredOnlyProduct] = await Promise.all([
        productsPromise,
        Product.find(baseQuery),
    ]);
    const totalPage = Math.ceil(filteredOnlyProduct.length / limit);
    return res.status(200).json({
        success: true,
        products,
        totalPage,
    });
});
