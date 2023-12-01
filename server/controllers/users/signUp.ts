import { NextFunction, Request, Response } from "express";
import usersService from "../../services/usersService";
import { ApiError } from "../../middlewares/errors/ApiError";

export async function signUp(req: Request, res: Response, next: NextFunction) {
    const user = await usersService.signUp(req.body);
    if (!user) {
        next(ApiError.badRequest("User not created"));
        return;
    }
  res.status(200).json({ user, message: "User created" });
}
