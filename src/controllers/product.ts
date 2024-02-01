import { Request, Response, NextFunction } from "express";
import { ProductTryCatch, TryCatch } from "../middlewares/error.js";
import { NewProductRequestBody } from "../types/types.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-clasee.js";
import { rm } from "fs";

export const newProduct = ProductTryCatch(
  async (
    req: Request<{}, {}, NewProductRequestBody>,
    res: Response,
    next: NextFunction
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

    return res.status(201).json({
      sucess: true,
      message: "Product created sucessful",
    });
  }
);
