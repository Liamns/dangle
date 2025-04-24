import { PetType } from "../../shared/types/pet";

export function getPetAgeLabel(petType: PetType, ageYears: number): string {
  if (petType === "dog") {
    if (ageYears < 2) return "애기강아지";
    if (ageYears < 5) return "나는야개린이";
    if (ageYears < 8) return "뛰어놀나이";
    if (ageYears < 12) return "으른강아지";
    if (ageYears < 15) return "아직도귀여워";
    return "오래행복하자";
  } else if (petType === "cat") {
    if (ageYears < 1) return "애기냥";
    if (ageYears < 3) return "꼬마냥";
    if (ageYears < 5) return "활발냥";
    if (ageYears < 7) return "으른냥";
    if (ageYears < 10) return "아직도깜찍해";
    return "오래행복하자";
  }
  return "";
}
