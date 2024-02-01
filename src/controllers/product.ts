import { Request, Response, NextFunction } from "express";
import { ProductTryCatch, TryCatch } from "../middlewares/error.js";
import { NewProductRequestBody } from "../types/types.js";
import { Product } from "../models/product.js";

export const newProduct = ProductTryCatch(
  async (
    req: Request<{}, {}, NewProductRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
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
  }
);
