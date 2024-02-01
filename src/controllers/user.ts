import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.js";
import { NewUserRequestBody } from "../types/types.js";
import { TryCatch } from "../middlewares/error.js";
import ErrorHandler from "../utils/utility-clasee.js";

export const newUser = TryCatch(
  async (
    req: Request<{}, {}, NewUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, email, photo, gender, _id, dob } = req.body;

    let user = await User.findById(_id);
    if (user) {
      return res.status(200).json({
        sucess: true,
        message: `Welcome , ${user.name}`,
      });
    }

    if (!_id || !name || !email || !gender || !dob) {
      return next(new ErrorHandler("Please Add all field", 400));
    }

    user = await User.create({
      name,
      email,
      photo,
      gender,
      _id,
      dob: new Date(dob),
    });

    return res.status(201).json({
      sucess: true,
      message: `welcome , ${user.name}`,
    });
  }
);

export const getAllUsers = TryCatch(async (req, res, next) => {
  const users = await User.find({});

  return res.status(200).json({
    success: true,
    users,
  });
});

export const getUser = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const user = await User.findById(id);

    if (!user) return next(new ErrorHandler("Invalid Id", 400));

    return res.status(200).json({
      success: true,
      user,
    });
  }
);

export const deleteUser = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const user = await User.findById(id);

    if (!user) return next(new ErrorHandler("Invalid Id", 400));

    await user.deleteOne();

    return res.status(200).json({
      success: true,
      message: "user deleated successfully",
    });
  }
);
