import express from "express";

import controller from "../controllers/categories";
import { validate } from "../middlewares/validate";
import { categorySchema, uptadeCategorySchema } from "../schemas/categorySchema";
import { checkAuth } from "../middlewares/checkAuth";
import { ROLE } from "../utils/role";
import { checkRoles } from "../middlewares/checkRoles";

const categoriesRouter = express.Router();

categoriesRouter.get("/", controller.getAllCategories);
categoriesRouter.get("/:categoryId", controller.getSingleCategory);
categoriesRouter.post(
  "/",
  validate(categorySchema),
  checkAuth,
  checkRoles(ROLE.ADMIN),
  controller.createCategory
);
categoriesRouter.put(
  "/:categoryId",
  validate(uptadeCategorySchema),
  checkAuth,
  checkRoles(ROLE.ADMIN),
  controller.updateCategory
);
categoriesRouter.delete(
  "/:categoryId",
  checkAuth,
  checkRoles(ROLE.ADMIN),
  controller.deleteCategory
);

export default categoriesRouter;
