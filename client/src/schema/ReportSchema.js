import { z } from "zod";

export const reportSchema = z.object({
  petName: z.string().optional(), // Disabled field, optional
  ownerName: z.string().optional(), // Disabled field, optional

  temperature: z
    .union([
      z
        .string({ required_error: "Temperature is required" })
        .min(1, "Respiratory rate cannot be empty"),

      z.number({ required_error: "Temperature is required" }),
    ])
    .transform((val) => (val === "" ? undefined : Number(val))),

  heartRate: z
    .union([
      z
        .string({ required_error: "Heart rate is required" })
        .min(1, "Respiratory rate cannot be empty"),

      z.number({ required_error: "Heart rate is required" }),
    ])
    .transform((val) => (val === "" ? undefined : Number(val))),

  respiratoryRate: z
    .union([
      z
        .string({ required_error: "Respiratory rate is required" })
        .min(1, "Respiratory rate cannot be empty"),
      z.number({ required_error: "Respiratory rate is required" }),
    ])
    .transform((val) => (val === "" ? undefined : Number(val))),
  symptoms: z
    .array(
      z
        .string({ required_error: "Symptom is required" })
        .min(1, "Symptom cannot be empty")
    )
    .nonempty({ message: "At least one symptom is required" }),

  recommendations: z
    .array(
      z
        .string({ required_error: "Recommendation is required" })
        .min(1, "Recommendation cannot be empty")
    )
    .nonempty({ message: "At least one recommendation is required" }),

  diseases: z
    .array(
      z.object({
        diseaseName: z
          .string({ required_error: "Disease name is required" })
          .min(1, "Disease name cannot be empty"),
        cureTrial: z
          .string({ required_error: "Cure trial is required" })
          .min(1, "Cure trial cannot be empty"),
        effectOfTrial: z
          .string({ required_error: "Effect of trial is required" })
          .min(1, "Effect of trial cannot be empty"),
        effectiveness: z.enum(["low", "mid", "high"], {
          required_error: "Effectiveness is required",
        }),
        diseaseRemarks: z.string().optional(),
        treatmentStartDate: z.string({
          required_error: "Treatment start date is required",
        }),
        treatmentEndDate: z.string({
          required_error: "Treatment end date is required",
        }),
      })
    )
    .optional(),

  treatments: z
    .array(
      z.object({
        medicationName: z
          .string({ required_error: "Medication name is required" })
          .min(1, "Medication name cannot be empty"),
        dosage: z
          .string({ required_error: "Dosage is required" })
          .min(1, "Dosage cannot be empty"),
        frequency: z
          .string({ required_error: "Frequency is required" })
          .min(1, "Frequency cannot be empty"),
        durationDays: z
          .union([
            z.string({ required_error: "Duration days is required" }),
            z.number({ required_error: "Duration days is required" }),
          ])
          .transform((val) => (val === "" ? undefined : Number(val)))
          .optional(),
        purpose: z
          .string({ required_error: "Purpose is required" })
          .min(1, "Purpose cannot be empty"),
      })
    )
    .optional(),

  vetNotes: z.string().optional(),
});
