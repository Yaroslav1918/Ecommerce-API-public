import stripe, { Stripe } from "stripe";

import PaymentRepo from "../models/StripeOrderModel";
import { Metadata, CartItem } from "../types/Stripe";

export const stripeInstance = new stripe(process.env.STRIPE_KEY as string);

const removeOne = async (paymentId: string) => {
  return await PaymentRepo.findByIdAndDelete(paymentId);
};

const findOne = async (paymentId: string) => {
  return await PaymentRepo.findById(paymentId);
};

const findAllByUserId = async (userId: string) => {
  return await PaymentRepo.find({ userId }).populate("products.productId");
};

const findAll = async () => {
  return await PaymentRepo.find().exec();
};

const createStripePayments = async (customer: any, data: any) => {
  const items = JSON.parse(customer.metadata.cart);
  const products: Metadata = items.map((item: CartItem) => {
    return {
      productId: item._id,
      quantity: item.quantity,
    };
  });
  const newOrder = new PaymentRepo({
    userId: customer.metadata.userId,
    customerId: data.customer,
    paymentIntentId: data.payment_intent,
    products,
    subtotal: data.amount_subtotal / 100,
    total: data.amount_total / 100,
    shipping: data.customer_details,
    payment_status: data.payment_status,
    date: new Date().toLocaleString(),
  });
  newOrder.save();
};

export const createPaymentSession = async (
  userId: string,
  cart: CartItem[]
) => {
  const simplifiedCart = cart.map((item) => ({
    _id: item._id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
  }));

  const customer = await stripeInstance.customers.create({
    metadata: {
      userId,
      cart: JSON.stringify(simplifiedCart),
    },
  });

  const line_items = cart.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.name,
        metadata: {
          id: item._id,
        },
      },
      unit_amount: item.price * 100,
    },
    quantity: item.quantity,
  }));

  const session = await stripeInstance.checkout.sessions.create({
    payment_method_types: ["card"],
    shipping_address_collection: {
      allowed_countries: ["US", "CA", "KE", "EC", "FI"],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 0,
            currency: "usd",
          },
          display_name: "Free shipping",
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 5,
            },
            maximum: {
              unit: "business_day",
              value: 7,
            },
          },
        },
      },
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 1500,
            currency: "usd",
          },
          display_name: "Next day air",
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 1,
            },
            maximum: {
              unit: "business_day",
              value: 1,
            },
          },
        },
      },
    ],
    phone_number_collection: {
      enabled: true,
    },
    line_items,
    mode: "payment",
    customer: customer.id,
    success_url: `${process.env.CLIENT_URL}/payment`,
    cancel_url: `${process.env.CLIENT_URL}/cart`,
  });

  return { customer, session };
};

export default {
  removeOne,
  findOne,
  findAll,
  createStripePayments,
  createPaymentSession,
  findAllByUserId,
};
