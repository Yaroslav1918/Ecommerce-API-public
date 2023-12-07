import mongoose from "mongoose";
import { z } from "zod";
export const paymentBodySchema = z
  .object({
    cart: z.array(
      z.object({
        _id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val)),
        name: z.string(),
        description: z.string(),
        price: z.number(),
        category: z.object({
          _id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val)),
          name: z.string(),
          images: z.array(z.string()),
        }),
      })
    ),
    userId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val)),
  })
  .strict();

export const paymentSchema = z.object({
  body: paymentBodySchema,
});
