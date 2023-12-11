import request from "supertest";

import connect, { MongoHelper } from "../db-helper";
import app from "../../app";
import { authenticateUser } from "../auth/authenticateUser";

describe("Payments Controller", () => {
  let mongoHelper: MongoHelper;
  let accessToken: string;

  beforeEach(async () => {
    accessToken = await authenticateUser();
  });

  beforeAll(async () => {
    mongoHelper = await connect();
  });

  afterEach(async () => {
    await mongoHelper.clearDatabase();
  });

  afterAll(async () => {
    await mongoHelper.closeDatabase();
  });

  const cart = [
    {
      _id: "6554c883ab8e8fbcc83c643c",
      name: "Product 1",
      description: "wer",
      price: 10,
      images: ["dxfdgv"],
      quantity: 2,
      category: {
        _id: "6554c883ab8e8fbcc83c643a",
        name: "car",
        images: ["sdfds"],
      },
    },
  ];

  it("Should create a payment session", async () => {
    const response = await request(app)
      .post("/payments/create-checkout-session")
      .send({ cart })
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.body).toHaveProperty("url");
  });

});
