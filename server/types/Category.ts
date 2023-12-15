import { z } from "zod";
import mongoose from "mongoose";

import { categoryBodySchema } from "../schemas/categorySchema";

export type CategoryDto = z.infer<typeof categoryBodySchema>
export type Category = CategoryDto & {_id: mongoose.Types.ObjectId}
export type CreateCategoryInput = CategoryDto
export type UpdateCategoryInput = Partial<CategoryDto>

