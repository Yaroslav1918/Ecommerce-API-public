import express from "express";

import ctrl from "../controllers/payments";
import { checkAuth } from "../middlewares/checkAuth";
import { checkRoles } from "../middlewares/checkRoles";
import { ROLE } from "../utils/role";
import { paymentSchema } from "../schemas/paymentSchema";
import { validate } from "../middlewares/validate";

const router = express.Router();
router.get(
  "/",
  checkAuth,
  checkRoles(ROLE.ADMIN, ROLE.USER),
  ctrl.getAllPayments
);
router.get(
  "/:userId",
  checkAuth,
  checkRoles(ROLE.ADMIN, ROLE.USER),
  ctrl.getAllPaymentsByUserID
);
router.get(
  "/:paymentId",
  checkAuth,
  checkRoles(ROLE.ADMIN, ROLE.USER),
  ctrl.getPayment
);
router.post(
  "/create-checkout-session",
  validate(paymentSchema),
  checkAuth,
  checkRoles(ROLE.ADMIN, ROLE.USER),
  ctrl.stripePayment
);
router.post(
  "/webhook",
  express.json({ type: "application/json" }),
  ctrl.webhook
);

router.delete("/:paymentId", checkAuth, ctrl.removePayment);

export default router;
