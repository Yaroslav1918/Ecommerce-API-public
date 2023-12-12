import PaymentService from "../../services/paymentsService";
import { CartItem, Metadata } from "../../types/Stripe";
import connect, { MongoHelper } from "../db-helper";

describe("payment service", () => {
  let mongoHelper: MongoHelper;

  beforeAll(async () => {
    mongoHelper = await connect();
  });

  afterEach(async () => {
    await mongoHelper.clearDatabase();
  });

  afterAll(async () => {
    await mongoHelper.closeDatabase();
  });

  test("create payment session", async () => {
    const userId = "sdfsdfa";
    const cart: CartItem[] = [
      {
        _id: "sdfds",
        name: "phone",
        price: 123,
        quantity: 222,
      },
    ];
    const result = await PaymentService.createPaymentSession(userId, cart);
    const parsedCart = JSON.parse(result.customer.metadata.cart);
    expect(result.customer.metadata.userId).toBe(userId);
    expect(parsedCart).toEqual([
      {
        _id: "sdfds",
        name: "phone",
        price: 123,
        quantity: 222,
      },
    ]);
  });
});
