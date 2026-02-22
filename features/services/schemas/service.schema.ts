import { z } from "zod";

export const serviceFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
  description: z.string(),
  rate_per_hour: z
    .number({ error: "Rate is required" })
    .positive("Rate per hour must be greater than 0"),
  clinic_cut: z
    .number({ error: "Clinic cut is required" })
    .min(0.01, "Clinic cut must be greater than 0")
    .max(99.99, "Clinic cut must be less than 100"),
});

export type ServiceFormInput = z.infer<typeof serviceFormSchema>;
