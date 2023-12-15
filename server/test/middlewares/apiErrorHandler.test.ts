import supertest from "supertest";
import express, { Request, Response, NextFunction } from "express";

import { apiErrorHandler } from "../../middlewares/apiErrorHandler";

const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error("Test error");
  next(error);
});

app.use(apiErrorHandler);

describe("apiErrorHandler middleware", () => {
  it("should handle generic Error correctly", async () => {
    const response = await supertest(app).get("/random-path");
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Something went wrong" });
  });

});
