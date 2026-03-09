import { z } from "zod";

function parseOptionalDate(value: string): Date | null {
  if (!value || value.trim() === "") return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export const patientFormSchema = z
  .object({
    name: z.string().min(1, "Full name is required").max(100, "Name must be 100 characters or less"),
    date_of_birth: z.string().min(1, "Date of birth is required").refine(
      (val) => parseOptionalDate(val) !== null,
      "Invalid date"
    ),
    age: z.number().int().min(0, "Age must be 0 or greater"),
    gender: z.string().optional(),
    email: z.string().email("Invalid email address").optional().or(z.literal("")),
    guardian_name: z.string().min(1, "Guardian name is required"),
    guardian_relationship: z.string().min(1, "Relationship is required"),
    guardian_contact_number: z.string().min(1, "Contact number is required"),
    medical_diagnosis: z.string().min(1, "Medical diagnosis is required"),
    doctor_id: z.string().optional(),
    remarks: z.string(),
  })
  .refine(
    (data) => {
      const dob = parseOptionalDate(data.date_of_birth);
      if (!dob) return true;
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
      return data.age === Math.max(0, age);
    },
    { message: "Age does not match date of birth", path: ["age"] }
  );

export type PatientFormInput = z.infer<typeof patientFormSchema>;
