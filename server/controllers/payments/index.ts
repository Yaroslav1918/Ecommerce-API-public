import { getAllPayments } from "./getAllPayments";
import { getAllPaymentsByUserID } from "./getAllPaymentsByUserID";
import { getPayment } from "./getPayment";
import { removePayment } from "./removePayment";
import { stripePayment } from "./stripePayment";
import { webhook } from "./webhook";

export default {
  removePayment,
  getPayment,
  getAllPayments,
  stripePayment,
  webhook,
  getAllPaymentsByUserID,
};
