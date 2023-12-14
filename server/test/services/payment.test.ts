import PaymentService from "../../services/paymentsService";
import { CartItem } from "../../types/Stripe";
import connect, { MongoHelper } from "../db-helper";
import ProductRepo from "../../models/ProductModel";
import CategoryRepo from "../../models/CategoryModel";
import { ProductDocument } from "Product";
import { Category } from "Category";

describe("payment service", () => {
  let mongoHelper: MongoHelper;
  let productOne: ProductDocument;
  let category: Category;
  beforeEach(async () => {
    const categoryInstance = new CategoryRepo({
      name: "mobile",
      images: ["fdfgdf"],
    });

    category = await categoryInstance.save();
    const iphoneProduct = new ProductRepo({
      name: "iphone",
      description: "super phone",
      price: 123,
      category: category._id.toString(),
      images: ["fdfgdf"],
      stock: 12,
    });

    productOne = await iphoneProduct.save();
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
  const newCustomer = {
    metadata: {
      cart: '[{"_id":"655ddd33a14052a8b4e508f4","name":"phone","price":123,"quantity":222}]',
      userId: "755ddd33a14052a8b4e508f4",
    },
  };
  const customer = {
    metadata: {
      cart: '[{"_id":"655ddd33a14052a8b4e508f4","name":"phone","price":123,"quantity":222}]',
      userId: "655ddd33a14052a8b4e508f4",
    },
  };
  const data = {
    customer: "655ddd33a14052a8b4e508f4",
    payment_intent: "paymentIntentId",
    amount_subtotal: 10000,
    amount_total: 12000,
    customer_details: "customerDetails",
    payment_status: "succeeded",
  };

  test("create payment session", async () => {
    const userId = "655ddd33a14052a8b4e508f4";
    const cart: CartItem[] = [
      {
        _id: "655ddd33a14052a8b4e508f4",
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
        _id: "655ddd33a14052a8b4e508f4",
        name: "phone",
        price: 123,
        quantity: 222,
      },
    ]);
  });

  test("create  new payment", async () => {
    const result = await PaymentService.createStripePayments(customer, data);
    const expectedUserId = result.userId.toString();
    expect(expectedUserId).toBe(customer.metadata.userId);
    expect(result.payment_status).toBe("succeeded");
  });

  test("should return all payments", async () => {
    await PaymentService.createStripePayments(customer, data);
    const result = await PaymentService.findAll();
    expect(result.length).toBe(1);
  });

  test("should return  payment by id", async () => {
    await PaymentService.createStripePayments(customer, data);
    const newPayment = await PaymentService.createStripePayments(
      customer,
      data
    );
    const payment = await PaymentService.findOne(newPayment._id.toString());
    expect(payment?._id).toStrictEqual(newPayment._id);
  });

  test("should return  payment by  user id", async () => {
    await PaymentService.createStripePayments(customer, data);
    const newPayment = await PaymentService.createStripePayments(
      newCustomer,
      data
    );
    const userId = newPayment.userId.toString();
    const paymentUserId = await PaymentService.findAllByUserId(userId);
    expect(paymentUserId[0]?.userId.toString()).toStrictEqual(userId);
  });
});
