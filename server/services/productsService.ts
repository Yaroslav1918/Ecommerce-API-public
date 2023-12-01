import { FilterQuery, Types } from "mongoose";
import CategoryRepo from "../models/CategoryModel";
import ProductRepo from "../models/ProductModel";
import { Category } from "../types/Category";
import {
  CreateProductInput,
  Product,
  UpdateProductInput,
} from "../types/Product";
import { ProductQueries } from "../types/ProductQueries";

const createOne = async (newProduct: CreateProductInput) => {
  const category: Category | null = await CategoryRepo.findOne({
    _id: newProduct.category,
  });
  if (!category) {
    return null;
  }
  const product = new ProductRepo(newProduct);
  return await product.save();
};

const findAll = async () => {
  return await ProductRepo.find().populate("category").exec();
};

const removeOne = async (productId: string) => {
  return await ProductRepo.findByIdAndDelete(productId);
};

const updateOne = async (
  updatedProduct: UpdateProductInput,
  productId: string
) => {
  const result = await ProductRepo.findByIdAndUpdate(
    productId,
    updatedProduct,
    {
      new: true,
    }
  );
  return result;
};

const findOne = async (productId: string) => {
  const product = await ProductRepo.findById(productId);
  return product;
};

const queryHandling = async (queries: ProductQueries) => {
  const { page, limit, sort, ...filterValues } = queries;
  const pageNumber = Number(page);
  const pageSize = Number(limit);
  const sortByPrice: Record<string, "asc" | "desc"> | undefined = sort
    ? { price: sort }
    : undefined;
  const [key, value]: [string, any] = Object.entries(filterValues)[0] || [];
  let filteredProducts: FilterQuery<Product>;

  switch (true) {
    case !isNaN(Number(value)):
      filteredProducts = { [key]: { $eq: value } };
      break;
    case Types.ObjectId.isValid(value):
      filteredProducts = { [key]: { $eq: new Types.ObjectId(value) } };
      break;
    case typeof value === "string":
      filteredProducts = { [key]: { $regex: new RegExp(value, "i") } };
      break;
    default:
      filteredProducts = {};
      break;
  }

  const products = await ProductRepo.find(filteredProducts)
    .sort(sortByPrice)
    .limit(pageSize)
    .skip((pageNumber - 1) * pageSize);
  return products;
};

export default {
  createOne,
  findAll,
  removeOne,
  findOne,
  updateOne,
  queryHandling,
};
