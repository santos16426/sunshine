import { z } from 'zod'

const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  role: z.enum(['admin', 'secretary']),
  firstName: z.string(),
  middleName: z.string().nullable(),
  lastName: z.string(),
  phone: z.string(),
  licenseNumber: z.string().nullable(),
  isActive: z.boolean().optional(),
  bio: z.string().nullable().optional(),
})


const loginUserSchema = userSchema.omit({
  firstName: true,
  middleName: true,
  lastName: true,
  phone: true,
  licenseNumber: true,
  isActive: true,
  bio: true,
})

export const loginResponseSchema = z.object({
  accessToken: z.string(),
  user: loginUserSchema,
})

export const authMeResponseSchema = z.object({
  user: userSchema,
})

export type LoginResponseData = z.infer<typeof loginResponseSchema>
export type AuthMeResponseData = z.infer<typeof authMeResponseSchema>
