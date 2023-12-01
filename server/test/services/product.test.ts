import { CreateProductInput, Product, ProductDocument } from "Product";
import ProductService from "../../services/productsService";
import ProductRepo from "../../models/ProductModel";
import CategoryRepo from "../../models/CategoryModel";
import connect, { MongoHelper } from "../db-helper";
import { ProductQueries } from "ProductQueries";
import { Category } from "Category";
import mongoose from "mongoose";

describe("Product service", () => {
  let mongoHelper: MongoHelper;
  let productOne: ProductDocument;
  let productTwo: ProductDocument;
  let productThree: ProductDocument;
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
    const nokiaProduct = new ProductRepo({
      name: "nokia mobile",
      description: "nokia description",
      price: 300,
      category: category._id,
      images: ["fdfgdf"],
    });
    const sonyProduct = new ProductRepo({
      name: "sony mobile",
      description: "sony description",
      price: 200,
      category: category._id,
      images: ["fdfgdf"],
      stock: 10,
    });
    productOne = await iphoneProduct.save();
    productTwo = await nokiaProduct.save();
    productThree = await sonyProduct.save();
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

  it("should create a new product", async () => {
    const product: CreateProductInput = {
      name: "mobile",
      description: "super phone",
      price: 123,
      category: category._id.toString(),
      images: ["fdfgdf"],
      stock: 42,
    };
    const newProduct = await ProductService.createOne(product);
    expect(newProduct).toHaveProperty("_id");
    expect(newProduct?.price).toEqual(123);
  });
  it("should return a list of products", async () => {
    const products = await ProductService.findAll();
    expect(products.length).toEqual(3);
  });

  it("should update product", async () => {
    const updatedProduct = await ProductService.updateOne(
      { name: "Ivan Sirko" },
      productOne._id.toString()
    );
    expect(updatedProduct?.name).toEqual("Ivan Sirko");
    expect(updatedProduct).toHaveProperty("price");
  });

  it("should find one product", async () => {
    const foundProduct = await ProductService.findOne(
      productOne._id.toString()
    );
    expect(foundProduct?.name).toEqual("iphone");
    expect(foundProduct?.description).toEqual("super phone");
  });

  it("should delete one product", async () => {
    await ProductService.removeOne(productOne._id.toString());
    const products = await ProductService.findAll();
    expect(products.length).toEqual(2);
  });

  it("shouldn't delete when the id is invalid", async () => {
    // invalid id
    await ProductService.removeOne("655ddd33a14052a8b4e508f4");
    const products = await ProductService.findAll();
    expect(products.length).toEqual(3);
  });

  it("should asc sort products by price", async () => {
    const filteredProductsByPrice = await ProductService.queryHandling({
      sort: "asc",
    });
    expect(filteredProductsByPrice.length).toEqual(3);
    expect(filteredProductsByPrice[0].price).toBeLessThan(
      filteredProductsByPrice[1].price
    );
  });

  it("should desc sort products by price", async () => {
    const filteredProductsByPrice = await ProductService.queryHandling({
      sort: "desc",
    });
    expect(filteredProductsByPrice.length).toEqual(3);
    expect(filteredProductsByPrice[0].price).toBeGreaterThan(
      filteredProductsByPrice[1].price
    );
  });

  it("should filter products by name", async () => {
    const filteredProductsByName = await ProductService.queryHandling({
      name: "iphone",
    } as ProductQueries);
    expect(filteredProductsByName.length).toEqual(1);
    expect(filteredProductsByName[0].name).toEqual("iphone");
  });

  it("should filter products by description", async () => {
    const filteredProductsByDesc = await ProductService.queryHandling({
      description: "sony description",
    } as ProductQueries);
    expect(filteredProductsByDesc.length).toEqual(1);
    expect(filteredProductsByDesc[0].description).toEqual("sony description");
  });
});
