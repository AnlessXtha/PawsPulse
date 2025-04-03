import { z } from "zod";

export const appointmentSchema = z.object({
  reason: z.string().min(1, "Reason to visit is required."),
  appointmentDate: z.date({ required_error: "Appointment date is required." }),
  appointmentTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format."),
  recurring: z.boolean(),
  recurringRule: z.string().optional(), // Optional if not recurring
  recurringUntil: z.string().optional(), // Optional if not recurring
  vet: z.string().min(1, "A vet must be selected."),
});
