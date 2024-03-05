import { Request, Response, NextFunction } from "express";
import { ProductTryCatch, TryCatch } from "../middlewares/error.js";
import {
  BaseQuery,
  NewProductRequestBody,
  SearchRequestQuery,
} from "../types/types.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-clasee.js";
import { rm } from "fs";
import { myCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";

export const newProduct = ProductTryCatch(
  async (
    req: Request<{}, {}, NewProductRequestBody>,
    res: Response,
    next: NextFunction,
  ) => {
    const { name, category, price, stock } = req.body;
    const photo = req.file;

    if (!photo) return next(new ErrorHandler("Please add photo", 400));
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

    await invalidateCache({ product: true });
    return res.status(201).json({
      sucess: true,
      message: "Product created sucessful",
    });
  },
);

// revalidate cache  on new update or delete in product

export const getLatestProducts = ProductTryCatch(
  async (
    req: Request<{}, {}, NewProductRequestBody>,
    res: Response,
    next: NextFunction,
  ) => {
    let products;
    if (myCache.has("latest-product"))
      products = JSON.parse(myCache.get("latest-product") as string);
    else {
      products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
      // stores the data in cache memory prevents multiple call to database
      myCache.set("latest-product", JSON.stringify(products));
    }
    return res.status(200).json({
      sucess: true,
      products,
    });
  },
);

// revalidate cache  on new update or delete in product

export const getAllCategories = ProductTryCatch(
  async (
    req: Request<{}, {}, NewProductRequestBody>,
    res: Response,
    next: NextFunction,
  ) => {
    let categories;

    if (myCache.has("categories"))
      categories = JSON.parse(myCache.get("categories") as string);
    else {
      categories = await Product.distinct("category");
      myCache.set("categories", JSON.stringify(categories));
    }

    return res.status(200).json({
      success: true,
      categories,
    });
  },
);
// revalidate cache  on new update or delete in product

export const getAdminProducts = ProductTryCatch(
  async (
    req: Request<{}, {}, NewProductRequestBody>,
    res: Response,
    next: NextFunction,
  ) => {
    let products;
    if (myCache.has("all-products"))
      products = JSON.parse(myCache.get("all-products") as string);
    else {
      products = await Product.find({});
      myCache.set("all-products", JSON.stringify(products));
    }

    return res.status(200).json({
      success: true,
      products,
    });
  },
);

export const getSingleProduct = ProductTryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    let product;
    const id = req.params.id;
    if (myCache.has(`product-${id}`))
      product = JSON.parse(myCache.get(`product-${id}`) as string);
    else {
      product = await Product.findById(id);

      if (!product) return next(new ErrorHandler("Product Not Found", 404));

      myCache.set(`product-${id}`, JSON.stringify(product));
    }

    return res.status(200).json({
      success: true,
      product,
    });
  },
);

export const updateProduct = ProductTryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const { name, category, price, stock } = req.body;
    const photo = req.file;
    const product = await Product.findById(id);
    if (!product) {
      return next(new ErrorHandler("invalid product", 400));
    }

    if (photo) {
      rm(product.photo!, () => {
        console.log("old photo deleated");
      });
      product.photo = photo.path;
    }

    if (name) product.name = name;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (category) product.category = category;

    await product.save();

    await invalidateCache({ product: true });

    return res.status(200).json({
      sucess: true,
      message: "Product updated sucessful",
    });
  },
);

export const deleteProduct = ProductTryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorHandler("invalid product", 400));
    }

    rm(product.photo!, () => {
      console.log("Product photo deleted");
    });

    await Product.deleteOne();

    await invalidateCache({ product: true });
    return res.status(200).json({
      sucess: true,
      message: "product Deleted succefully",
    });
  },
);

export const getAllProducts = ProductTryCatch(
  async (
    req: Request<{}, {}, {}, SearchRequestQuery>,
    res: Response,
    next: NextFunction,
  ) => {
    const { search, sort, category, price } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit;

    const baseQuery: BaseQuery = {};

    if (search)
      baseQuery.name = {
        $regex: search,
        $options: "i",
      };

    if (price)
      baseQuery.price = {
        $lte: Number(price),
      };

    if (category) baseQuery.category = category;

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
  },
);
