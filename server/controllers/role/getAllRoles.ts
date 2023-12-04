import { NextFunction, Request, Response } from "express";

import services from "../../services/rolesService";

export const getAllRoles = async (req: Request, res: Response, next: NextFunction) => {
  const roles = await services.getAll();
  res.status(200).json(roles);
};
