import { NextFunction, Request, Response } from "express";
import usersService from "../../services/usersService";
import { ApiError } from "../../middlewares/errors/ApiError";

export async function logIn(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;
  const loggedInUser = await usersService.logIn(email, password);
  if (!loggedInUser.status && loggedInUser.message) {
    next(ApiError.badRequest(loggedInUser.message));
    return;
  }
  const { accessToken, user } = loggedInUser;
  res.status(200).json({ accessToken, user });
}
