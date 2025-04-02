import { z } from "zod";

// Step 1: User Details Schema
export const userSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    userType: z.enum(["owner", "vet", "admin"], "Invalid user type"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email"),
    contactNumber: z.string().regex(/^\d{10}$/, "Invalid contact number"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string().min(8, "Confirm password is required"),
    avatar: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Step 2: Pet Profile Schema (for Owners)
export const petSchema = z.object({
  petName: z.string().min(1, "Pet name is required"),
  petType: z.enum(["dog", "cat"], "Invalid pet type"),
  petBreed: z.string().min(1, "Breed is required"),
  petGender: z.enum(["male", "female"], "Gender is required"),
  petAge: z.number().int().min(0, "Age must be a valid number"),
  // weight: z.number().min(0, "Weight must be a valid number"),
  petAvatar: z.string().min(1, "Avatar is required"),
});

// Combine User & Pet Schema (for Owners)
export const registerSchema = z.object({
  user: userSchema,
  pet: petSchema.optional(),
});
