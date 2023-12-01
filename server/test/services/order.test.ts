import connect, { MongoHelper } from "../db-helper";

import { CreateUserInput, User } from "User";
import { ProductDocument } from "Product";
import { newOrderData } from "Order";
import usersService from "../../services/usersService";
import orderService from "../../services/ordersService";
import productsService from "../../services/productsService";
import ProductRepo from "../../models/ProductModel";
import CategoryRepo from "../../models/CategoryModel";

export async function createOrder() {
  const bodyUser: CreateUserInput = {
    name: "Alan",
    email: "alan@gmail.com",
    password: "1234567",
    avatar: "dfvdsgvds"
  };

  const category = new CategoryRepo({
    name: "mobile",
    images: ["fdfgdf"],
  });
  await category.save();
  const iphoneProduct = new ProductRepo({
    name: "iphone",
    description: "super phone",
    price: 123,
    category: category._id.toString(),
    images: ["fdfgdf"],
    stock: 12,
  });
  await iphoneProduct.save();
  const user = await usersService.createUser(bodyUser);
  if (!iphoneProduct?._id) {
    return;
  }
  const bodyOrder: newOrderData = {
    userId: user._id.toString(),
    products: [
      {
        productId: iphoneProduct._id.toString(),
        quantity: 1,
      },
      {
        productId: iphoneProduct._id.toString(),
        quantity: 2,
      },
    ],
  };

  return await orderService.createOrder(bodyOrder);
}

describe("Order Service", () => {
  let mongoHelper: MongoHelper;
  let productOne: ProductDocument;
  let user: User;

  beforeAll(async () => {
    mongoHelper = await connect();
  });

  afterAll(async () => {
    await mongoHelper.closeDatabase();
  });

  afterEach(async () => {
    await mongoHelper.clearDatabase();
  });

  it("should create a new order", async () => {
    const order = await createOrder();
    expect(order).toHaveProperty("_id");
    expect(order).toHaveProperty("userId");
    expect(order?.paymentStatus).toBe("pending");
    expect(order?.totalAmount).toBe(369);
  });

  it("Should return a list of all orders", async () => {
    await createOrder();
    const orders = await orderService.getAllOrderItems();
    expect(orders.length).toBeGreaterThanOrEqual(1);
  });

  it("Should return a single order", async () => {
    const order = await createOrder();
    if (!order?._id) {
      return;
    }
    const singleOrder = await orderService.getSingleOrder(order._id.toString());
    expect(singleOrder).toHaveProperty("userId");
    expect(singleOrder?.paymentStatus).toBe("pending");
    expect(singleOrder?.totalAmount).toBe(369);
  });
});
