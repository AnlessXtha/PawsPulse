import { z } from "zod";

// Base User Schema (common fields for all user types)
export const baseUserSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  userType: z.enum(["owner", "vet", "admin"], {
    errorMap: () => ({ message: "Invalid user type." }),
  }),
  username: z.string().min(1, "Username is required."),
  email: z.string().email("Invalid email address."),
  contactNumber: z.string().min(1, "Contact number is required."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .optional(),
  avatar: z.string().optional(),
});

// Vet Details Schema
export const vetDetailsSchema = z.object({
  specialization: z.string().min(1, "Specialization is required."),
  licenseNumber: z.string().min(1, "License number is required."),
});

// Pet Details Schema
export const petDetailsSchema = z.object({
  petName: z.string().min(1, "Pet name is required."),
  petType: z.string().min(1, "Pet type is required."),
  petBreed: z.string().min(1, "Pet breed is required."),
  petAge: z.number().int().min(0, "Pet age must be a non-negative integer."),
  petGender: z.string().min(1, "Pet gender is required."),
  petAvatar: z.string().optional(),
});
