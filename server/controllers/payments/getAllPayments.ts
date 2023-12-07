import { Request, Response } from "express";

import paymentsService from "../../services/paymentsService";

export const getAllPayments = async (
  _: Request,
  res: Response,
) => {
  const payments = await paymentsService.findAll();
  res.status(200).json(payments);
};
