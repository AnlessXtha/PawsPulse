import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Required"),
  password: z.string().min(1, "Required"),
  //   .refine((val) => val.length >= 8, {
  //     message: "Password must be at least 8 characters",
  //   }),
});
