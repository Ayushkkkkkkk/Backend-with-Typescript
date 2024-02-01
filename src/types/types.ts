import { Request, Response, NextFunction } from "express";
export interface NewUserRequestBody {
  name: string;
  email: string;
  photo: string;
  gender: string;
  _id: string;
  dob: Date;
}

export interface NewProductRequestBody {
  name: string;
  category: string;
  price: number;
  stock: number;
}

export type ControllerType = (
  req: Request<{}, {}, NewUserRequestBody>,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;


export type ProductControllerType = 
(
  req: Request<{}, {}, NewProductRequestBody>,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;
