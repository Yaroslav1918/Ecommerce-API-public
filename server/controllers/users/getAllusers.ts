import { Request, Response, NextFunction } from "express";

import { ApiError } from "../../middlewares/errors/ApiError";
import UsersService from "../../services/usersService";

export async function getAllUsers(
  _: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const users = await UsersService.findAll();
    res.status(200).json(users);
  } catch (error) {
    next(ApiError.resourceNotFound("User not found"));
  }
}
