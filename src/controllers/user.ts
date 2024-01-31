import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.js";
import { NewUserRequestBody } from "../types/types.js";

export const newUser = async (
  req: Request<{}, {}, NewUserRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, photo, gender, _id, dob } = req.body;

    const user = await User.create({
      name,
      email,
      photo,
      gender,
      _id,
      dob,
    });

    return res.status(300).json({
      sucess: true,
      message: `welcome , ${user.name}`,
    });
  } catch (error) {
    res.status(300).json({
      sucess: true,
      message: `welcome , ${error}`,
    });
  }
};
