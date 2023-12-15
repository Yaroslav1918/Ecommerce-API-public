import { NextFunction, Response } from "express";

import { WithAuthRequest } from "../types/Auth";
import { Role } from "../utils/role";
import { ApiError } from "./errors/ApiError";

export function checkRoles(...roles: Role[]) {
  return (req: WithAuthRequest, res: Response, next: NextFunction) => {
    const user = req.decoded;
    const hasMatchedRole = user && roles.includes(user.role);
    if (!hasMatchedRole) {
      next(ApiError.forbidden("You do not have access"));
      return;
    }
    next();
  };
}
