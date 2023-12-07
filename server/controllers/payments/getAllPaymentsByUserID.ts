import { Request, Response } from "express";

import paymentsService from "../../services/paymentsService";

export const getAllPaymentsByUserID = async (req: Request, res: Response) => {
  const id = req.params.userId;
  const payments = await paymentsService.findAllByUserId(id);
  res.status(200).json(payments);
};
