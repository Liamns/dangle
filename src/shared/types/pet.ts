export const petType = ["dog", "cat"] as const;
export type PetType = (typeof petType)[number];

export type DogSize = "small" | "medium" | "large";

export function classifyDogSize(weight: number): DogSize {
  if (weight <= 10) return "small";
  if (weight <= 25) return "medium";
  return "large";
}

export const dogSizeTitles: Record<DogSize, string> = {
  small: "작아서 소중해",
  medium: "지금이 제일 완벽해",
  large: "왕크니까 왕귀엽다",
};
