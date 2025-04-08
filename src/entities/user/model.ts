import { z } from "zod";
import { emailSchema, passwordSchema } from "./schema";
import { create } from "zustand";
import { User } from "./schema";
import { usernameSchema } from "@/entities/profile/schema";

export const uuidSchema = z
  .string()
  .uuid({ message: "유효한 UUID가 아닙니다." });

export const userModelSchema = z.object({
  id: uuidSchema,
  email: emailSchema,
  password: passwordSchema,
  username: usernameSchema,
  profileIds: z.array(uuidSchema).nullable(),
});

// User model type derived from the schema
export type UserModel = z.infer<typeof userModelSchema>;
