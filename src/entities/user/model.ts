import { z } from "zod";
import { emailSchema, passwordSchema } from "./schema";

// UUID schema for id validation
export const uuidSchema = z
  .string()
  .uuid({ message: "유효한 UUID가 아닙니다." });

// User model schema with id, email, and password
export const userModelSchema = z.object({
  id: uuidSchema,
  email: emailSchema,
  password: passwordSchema,
});

// User model type derived from the schema
export type UserModel = z.infer<typeof userModelSchema>;
