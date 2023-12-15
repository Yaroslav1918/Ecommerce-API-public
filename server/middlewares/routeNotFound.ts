import { NextFunction, Request, Response } from "express";

import { monitorRequest } from "./logging";

export function routeNotFound(req: Request, res: Response, next: NextFunction) {
  const paths = /^(\/products|\/categories|\/orders)/;
  res.status(404).json({ msg: "Route not found" });
  if (!paths.test(req.originalUrl)) monitorRequest(req, res, next, true);
}
