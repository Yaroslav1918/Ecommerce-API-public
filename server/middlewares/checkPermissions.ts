import { NextFunction, Response } from "express";

import { WithAuthRequest } from "../types/Auth";
import { Permission } from "../utils/role";
import { ApiError } from "./errors/ApiError";

export function checkPermission(...permissions: Permission[]) {
  return (req: WithAuthRequest, res: Response, next: NextFunction) => {
    const user = req.decoded
    const hasMatchedPermission = user && permissions.filter(perm => user.permissions.includes(perm)).length === permissions.length
    if (!hasMatchedPermission) {
      next(ApiError.forbidden("You are not authorized"))
      return
    }
    next()
  }
}