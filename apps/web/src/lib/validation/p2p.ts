import { z } from "zod";

export const p2pOrderSchema = z.object({
  fiatAmount: z.number().min(1, "Amount is required"),
  cryptoAmount: z.number().min(0, "Crypto amount is required"),
  paymentMethod: z.string().min(1, "Please select a payment method"),
});

export type P2POrderInput = z.infer<typeof p2pOrderSchema>;
