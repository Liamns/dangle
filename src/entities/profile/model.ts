import { z } from "zod";
import {
  usernameSchema,
  petnameSchema,
  petAgeFormSchema,
  petGenderFormSchema,
  petSpecSchema,
  petWeightSchema,
} from "./schema";
import { uuidSchema } from "@/entities/user/model";
import { allVaccines, personalityTraits } from "@/shared/types/pet";

export const profileModelSchema = z.object({
  id: uuidSchema,
  userId: uuidSchema,
  username: usernameSchema,
  petname: petnameSchema,
  petAge: petAgeFormSchema,
  petWeight: petWeightSchema,
  petGender: petGenderFormSchema,
  petSpec: petSpecSchema,
  // vaccinations: map vaccine key to boolean flag
  vaccinations: z.record(z.enum(allVaccines), z.boolean()),
  // aggregated personality trait scores
  personalityScores: z.record(z.enum(personalityTraits), z.number()),
});

// Profile model type derived from the schema
export type ProfileModel = z.infer<typeof profileModelSchema>;
