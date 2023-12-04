import express from "express";

import ctrl from "../controllers/products";
import { validate } from "../middlewares/validate";
import { productSchema, uptadeProductSchema } from "../schemas/productSchema";
import { controlWrapper } from "../middlewares/controlWrapper";
import { checkAuth } from "../middlewares/checkAuth";
import { checkRoles } from "../middlewares/checkRoles";
import { ROLE } from "../utils/role";

const router = express.Router();
router.get("/", controlWrapper(ctrl.getAllProducts));
router.get("/:productId", controlWrapper(ctrl.getProduct));
router.post(
  "/",
  validate(productSchema),
  checkAuth,
  checkRoles(ROLE.ADMIN),
  controlWrapper(ctrl.addProduct)
);
router.delete(
  "/:productId",
  checkAuth,
  checkRoles(ROLE.ADMIN),
  controlWrapper(ctrl.deleteProduct)
);
router.put(
  "/:productId",
  checkAuth,
  checkRoles(ROLE.ADMIN),
  validate(uptadeProductSchema),
  controlWrapper(ctrl.updateProduct)
);

export default router;
