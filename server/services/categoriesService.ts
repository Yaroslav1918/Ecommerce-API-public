import mongoose from "mongoose";

import CategoryRepo from "../models/CategoryModel";

import { CreateCategoryInput, UpdateCategoryInput } from "../types/Category";

async function getAll() {
  return await CategoryRepo.find().exec();
}

async function getSingle(categoryId: string) {
  const id = new mongoose.Types.ObjectId(categoryId);
  return await CategoryRepo.findOne({ _id: id }).exec();
}

async function getSingleByName(categoryName: string) {
  return await CategoryRepo.findOne({ name: categoryName }).exec();
}

async function createCategory(createData: CreateCategoryInput) {
  const newCategory = new CategoryRepo(createData);
  return await newCategory.save();
}

async function updateCategory(
  categoryId: string,
  updateData: UpdateCategoryInput
) {
  const id = new mongoose.Types.ObjectId(categoryId);
  return await CategoryRepo.findByIdAndUpdate(id, updateData, { new: true });
}

async function deleteCategory(categoryId: string) {
  const id = new mongoose.Types.ObjectId(categoryId);
  return await CategoryRepo.findByIdAndDelete(id);
}

export default {
  getAll,
  getSingle,
  getSingleByName,
  createCategory,
  updateCategory,
  deleteCategory,
};
