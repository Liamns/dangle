import { z } from "zod";
import {
  usernameSchema,
  petnameSchema,
  petAgeFormSchema,
  petWeightFormSchema,
  petGenderFormSchema,
} from "./schema";
import { uuidSchema } from "@/entities/user/model";

export const profileModelSchema = z.object({
  id: uuidSchema,
  userId: uuidSchema,
  username: usernameSchema,
  petname: petnameSchema,
  petAge: petAgeFormSchema,
  petWeight: petWeightFormSchema,
  petGender: petGenderFormSchema,
});

// Profile model type derived from the schema
export type ProfileModel = z.infer<typeof profileModelSchema>;
