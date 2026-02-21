import { z } from "zod";

const hexColor = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

export const therapistFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
  therapist_type: z.string().min(1, "Therapist type is required"),
  contact_number: z.string().min(1, "Contact number is required"),
  calendar_color: z
    .string()
    .min(1, "Calendar color is required")
    .regex(hexColor, "Enter a valid hex color (e.g. #3B82F6)"),
});

export type TherapistFormInput = z.infer<typeof therapistFormSchema>;
