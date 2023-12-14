import { getAllPayments } from "./getAllPayments";
import { getAllPaymentsByUserID } from "./getAllPaymentsByUserID";
import { getPayment } from "./getPayment";
import { stripePayment } from "./stripePayment";
import { webhook } from "./webhook";

export default {
  getPayment,
  getAllPayments,
  stripePayment,
  webhook,
  getAllPaymentsByUserID,
};
