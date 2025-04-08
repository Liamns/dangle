export const petType = ["dog", "cat"] as const;
export type PetType = (typeof petType)[number];
