import { z } from "zod";
import { usernameSchema, petnameSchema, petageFormSchema } from "./schema";
import { uuidSchema } from "@/entities/user/model";

export const profileModelSchema = z.object({
  id: uuidSchema,
  userId: uuidSchema,
  username: usernameSchema,
  petname: petnameSchema,
  petage: petageFormSchema,
});

// Profile model type derived from the schema
export type ProfileModel = z.infer<typeof profileModelSchema>;
