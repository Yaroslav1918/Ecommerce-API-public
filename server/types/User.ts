import { z } from "zod";
import mongoose from "mongoose";

import { userBodySchema } from "../schemas/userSchema";

export type User = z.infer<typeof userBodySchema> & {
  _id: mongoose.Types.ObjectId;
};
export type CreateUserInput = z.infer<typeof userBodySchema>;

export type UserUpdate = Partial<User>;
