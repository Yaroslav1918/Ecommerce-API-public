import { Request, Response } from "express";
import stripe, { Stripe } from "stripe";

import paymentsService, {
  stripeInstance,
} from "../../services/paymentsService";

export const webhook = async (req: Request, res: Response) => {
  let data: Stripe.Charge;
  let eventType: string;
  let webhookSecret;

  if (webhookSecret) {
    let event: Stripe.Event;
    let signature = req.headers["stripe-signature"];
    if (!signature) {
      return res.sendStatus(400);
    }

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret
      );
    } catch (err) {
      return res.sendStatus(400);
    }

    data = event.data.object as Stripe.Charge;
    eventType = event.type;
  } else {
    data = req.body.data.object as Stripe.Charge;
    eventType = req.body.type;
  }

  if (eventType === "checkout.session.completed") {
    stripeInstance.customers
      .retrieve(data.customer as string)
      .then(async (customer) => {
        try {
          paymentsService.createStripePayments(customer, data);
        } catch (err) {
          console.log(err);
        }
      })
      .catch((err) => console.log(err.message));
  }

  res.status(200).end();
};
