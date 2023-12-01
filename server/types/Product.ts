import { z } from "zod";
import mongoose from "mongoose";
import { productBodySchema } from "../schemas/productSchema";

export type Product = z.infer<typeof productBodySchema> & {
  _id: mongoose.Types.ObjectId;
};
export type UpdateProductInput = Partial<Product>;
export type CreateProductInput = Omit<Product, "_id">;
interface ProductDto
  extends Omit<z.infer<typeof productBodySchema>, "category" | "stock"> {}
export interface ProductDocument extends mongoose.Document, ProductDto {
  category: mongoose.Types.ObjectId;
  stock?: number | null | undefined;
}
