import supertest from "supertest";
import express, { Request, Response, NextFunction } from "express";
import { routeNotFound } from "../../middlewares/routeNotFound";

const app = express();
app.use(routeNotFound);

describe("routeNotFound middleware", () => {
  it("should handle route not found correctly", async () => {
    const response = await supertest(app).get("/nonexistent-route");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ msg: "Route not found" });
  });
});
