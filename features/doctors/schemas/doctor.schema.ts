import { z } from "zod";

export const doctorFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
  contact_information: z.string().min(1, "Contact information is required"),
  hospital_affiliation: z.string().min(1, "Hospital affiliation is required"),
  remarks: z.string(),
});

export type DoctorFormInput = z.infer<typeof doctorFormSchema>;
