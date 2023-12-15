import { z } from "zod";
import mongoose from "mongoose";

import { paymentBodySchema } from "../schemas/paymentSchema";

export type Payment = z.infer<typeof paymentBodySchema> 
   & {
    _id: mongoose.Types.ObjectId;
    status: "pending" | "completed" | "failed";
  };
export type createPaymentInput = z.infer<typeof paymentBodySchema>; 
