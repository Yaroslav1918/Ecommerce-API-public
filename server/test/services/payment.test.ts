import { ProductDocument } from "Product";

import OrderService from "../../services/ordersService";
import UserService from "../../services/usersService";
import ProductRepo from "../../models/ProductModel";
import PaymentService from "../../services/paymentsService";
import CategoryRepo from "../../models/CategoryModel";
import connect, { MongoHelper } from "../db-helper";
import { Category } from "Category";
import { newOrderData } from "Order";
import { CreateUserInput } from "../../types/User";
import { createPaymentInput } from "Payment";

describe("Payment service", () => {
  let mongoHelper: MongoHelper;
  let productOne: ProductDocument;
  let category: Category;
  let bodyPayment: createPaymentInput;

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
    const bodyUser: CreateUserInput = {
      name: "Sirko",
      email: "te112@gmail.com",
      password: "1234567",
      avatar: "sdfdsds"
    };
    const user = await UserService.createUser(bodyUser);
    const bodyOrder: newOrderData = {
      userId: user._id.toString(),
      products: [{ productId: productOne._id, quantity: 1 }],
    };
    const order = await OrderService.createOrder(bodyOrder);
    if (!order?._id) {
      return;
    }
    bodyPayment = {
      method: "paypal",
      userId: user._id.toString(),
      ordersId: [order._id.toString()],
      bankName: "OTP",
      accountNumber: "sdfdsfdsf",
      shipmentInfo: {
        address: "new Street 1",
        shippingPrice: 10,
        city: "Oulu",
        postalCode: "12412",
        country: "Finland",
      },
    };
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

  it("should create a new payment", async () => {
    const payment = await PaymentService.createOne(bodyPayment);
    expect(payment?.[0]?.method).toEqual("paypal");
    expect(payment?.[0]?.bankName).toEqual("OTP");
  });

  it("should delete payment", async () => {
    const payment = await PaymentService.createOne(bodyPayment);
    if (!payment?.[0]?._id) {
      return;
    }
    await PaymentService.removeOne(payment[0]._id.toString());
    const payments = await PaymentService.findAll();
    expect(payments.length).toEqual(0);
  });

  it("should return all payments", async () => {
    await PaymentService.createOne(bodyPayment);
    const payments = await PaymentService.findAll();
    expect(payments.length).toEqual(1);
  });

  it("should return one payment", async () => {
    const newPayment = await PaymentService.createOne(bodyPayment);
    if (!newPayment?.[0]?._id) {
      return;
    }
    const payment = await PaymentService.findOne(newPayment[0]._id.toString());
    expect(payment?.bankName).toEqual("OTP");
    expect(payment?.method).toEqual("paypal");
  });
});
