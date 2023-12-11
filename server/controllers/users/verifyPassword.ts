import { Request, Response, NextFunction } from "express";

import usersService from "../../services/usersService";

export async function verifyPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userId } = (req as any).decoded;
  const isVerified = await usersService.verifyPassword(
    req.body.password,
    userId
  );
  if (!isVerified) {
    return res.status(400).json({ error: "Password is not valid" });
  }
  res.status(200).json({ message: "Password is valid" });
}
