import { Response, NextFunction } from "express";

import usersService from "../../services/usersService";
import { ApiError } from "../../middlewares/errors/ApiError";

export async function googleLogIn(req: any, res: Response, next: NextFunction) {
  const loggedInUser = await usersService.googleLogin(req.user);
  if (!loggedInUser) {
    next(ApiError.forbidden("Credentials is invalid"));
    return;
  }
  const { accessToken, user } = loggedInUser;
  res.status(200).json({ accessToken, user });
}
