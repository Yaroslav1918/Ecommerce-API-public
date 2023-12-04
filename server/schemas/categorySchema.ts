import { z } from "zod";

export const categoryBodySchema = z.object({
  name: z.string({
    required_error: "Category name is required",
  }),
  images: z
    .array(
      z.string({
        required_error: "Should be at least one category image",
      })
    )
    .max(3),
});


export const uptadeCategorySchema = z.object({
  body: z
    .object({
      name: z.string().optional(),
      images: z.array(z.string()).optional(),
    })
    .strict(),
});
export const categorySchema = z.object({
  body: categoryBodySchema,
});
