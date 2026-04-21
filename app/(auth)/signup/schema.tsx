import { z } from "zod";

export const signUpSchema = z
  .object({
    email: z.string().email({ message: "Invalid email" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    confirmPassword: z.string(),
    role: z.enum(["VENDOR", "HOST"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });