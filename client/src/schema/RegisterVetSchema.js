import { z } from "zod";

export const vetRegisterSchema = z.object({
  firstName: z
    .string({ required_error: "First name is required" })
    .min(1, "First name is required"),
  lastName: z
    .string({ required_error: "Last name is required" })
    .min(1, "Last name is required"),
  username: z
    .string({ required_error: "Username is required" })
    .min(3, "Username must be at least 3 characters"),
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format"),
  contactNumber: z
    .string({ required_error: "Contact number is required" })
    .min(10, "Contact number must be at least 10 digits")
    .regex(/^\+?\d+$/, "Invalid phone number"),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
  avatar: z.string({
    required_error: "The image of the certification is required",
  }),
  specialization: z
    .string({ required_error: "Specialization is required" })
    .min(1, "Specialization is required"),
  licenseNumber: z
    .string({ required_error: "License number is required" })
    .min(5, "License number must be at least 5 characters"),
});
