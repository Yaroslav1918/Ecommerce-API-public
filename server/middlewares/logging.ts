import { Request, Response, NextFunction } from "express";

export let requestCount = 0;
export const statusCodes = {
  "200": 0,
  "201": 0,
  "400": 0,
  "404": 0,
  "409": 0,
  "500": 0,
};

export const monitorRequest = (
  req: Request,
  res: Response,
  next: NextFunction,
  isReturn?: boolean
) => {
  requestCount++;
    res.on("finish", () => {
      switch (Math.floor(res.statusCode)) {
        case 200:
          statusCodes["200"]++;
          break;
        case 201:
          statusCodes["201"]++;
          break;
        case 400:
          statusCodes["400"]++;
          break;
        case 404:
          statusCodes["404"]++;
          break;
        case 409:
          statusCodes["409"]++;
          break;
        case 500:
          statusCodes["500"]++;
          break;
        default:
          break;
      }
      console.log(
        "👀 [INFO]: ",
        req.method,
        req.originalUrl,
        res.statusCode,
        res.statusMessage
      );
      console.log("Total requests:", requestCount);
      for (const [key, value] of Object.entries(statusCodes)) {
        value > 0 && console.log(`Code: ${key}: requests: ${value}`);
      }
    });
  if (isReturn) {
    return;
  } else {
    next();
  }
};

export const loggingMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  monitorRequest(req, res, next);
};
