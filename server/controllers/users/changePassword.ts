import { NextFunction, Request, Response } from "express";

import usersService from "../../services/usersService";
import { ApiError } from "../../middlewares/errors/ApiError";

export async function changePassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userId } = (req as any).decoded;
  const { newPassword } = req.body;
  const isModifiedPassword = await usersService.updatePassword(
    newPassword,
    userId
  );
  if (!isModifiedPassword.status && isModifiedPassword.message) {
    next(ApiError.badRequest(isModifiedPassword.message));
    return;
  }
  res.status(200).json({ message: isModifiedPassword.message });
}
