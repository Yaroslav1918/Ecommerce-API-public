import { NextFunction, Request, Response } from "express";

import paymentsService from "../../services/paymentsService";

export const stripePayment = async (req: Request, res: Response) => {
    const { userId } = (req as any).decoded;
    console.log("🚀 ~ file: stripePayment.ts:7 ~ stripePayment ~ userId:", userId)
  const { session } = await paymentsService.createPaymentSession(
    userId,
    req.body.cart
  );
  res.send({ url: session.url });
};
