import { Request, Response, NextFunction } from "express";
import UserRepo from "../models/UserModel";

export async function emailChecker(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const emailIsExisted = await UserRepo.findOne({ email: req.body.email });
    if (emailIsExisted) {
      return res.status(400).json({ message: "Email already exists" });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong in emailChecker" });
  }
}
