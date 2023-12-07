import { NextFunction, Request, Response } from "express";

import paymentsService from "../../services/paymentsService";

export const stripePayment = async (req: Request, res: Response) => {
  const { session } = await paymentsService.createPaymentSession(
    req.body.userId,
    req.body.cart
  );
  res.send({ url: session.url });
};
