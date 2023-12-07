import { NextFunction, Request, Response } from "express";

import usersService from "../../services/usersService";
import { ApiError } from "../../middlewares/errors/ApiError";

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  const id = req.params.userId;
  const usersData = await usersService.getSingleUser(id);
  if (!usersData) {
    next(ApiError.resourceNotFound("User is not found"));
    return;
  }
  const deletedUser = await usersService.deleteUser(id);
  if (!deletedUser) {
    next(ApiError.resourceNotFound("User can't be deleted"));
    return;
  }
  res.status(200).json({ message: "User deleted" });
}
