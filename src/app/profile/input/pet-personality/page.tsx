"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/entities/profile/store";
import {
  petPersonalityFormSchema,
  PetPersonalityFormData,
} from "@/entities/profile/schema";
import {
  personalityTags,
  tagScoreMap,
  personalityTraits,
} from "../../../../shared/types/pet";
import { Card, InnerBox, Spacer } from "../../../../shared/components/layout";
import { Text } from "../../../../shared/components/texts";
import { Button } from "../../../../shared/components/buttons";
import { Colors } from "../../../../shared/consts/colors";
import layoutStyles from "../layout.module.scss";
import styles from "./page.module.scss";
import Image from "next/image";
import { hasJongseong } from "../../../../shared/lib/string";
import { useEffect } from "react";

export default function InputPetPersonality() {
  const router = useRouter();
  const updateRegisteringProfile = useProfileStore(
    (s) => s.updateRegisteringProfile
  );
  const name = useProfileStore(
    (state) => state.registeringProfile?.petname ?? ""
  );

  useEffect(() => {
    if (name === "") {
      router.replace("/profile/input/pet-name");
    }
  }, [name, router]);

  if (name === "") return null;

  // 이름 마지막 글자 받침 여부에 따른 조사 결정
  const josa = hasJongseong(name) ? "은" : "는";

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isValid },
  } = useForm<PetPersonalityFormData>({
    resolver: zodResolver(petPersonalityFormSchema),
    mode: "onChange",
    defaultValues: { tags: [] },
  });

  const selectedTags = watch("tags") || [];

  const toggleTag = (tag: PetPersonalityFormData["tags"][number]) => {
    if (selectedTags.includes(tag)) {
      setValue(
        "tags",
        selectedTags.filter((t) => t !== tag),
        { shouldValidate: true }
      );
    } else if (selectedTags.length < 5) {
      setValue("tags", [...selectedTags, tag], { shouldValidate: true });
    }
  };

  const onSubmit = (data: PetPersonalityFormData) => {
    // aggregate scores per trait based on selected tags
    const scores: Record<string, number> = {};
    personalityTraits.forEach((trait) => {
      scores[trait] = 0;
    });
    data.tags.forEach((tag) => {
      const { trait1, trait2, score1, score2 } = tagScoreMap[tag];
      scores[trait1] += score1;
      scores[trait2] += score2;
    });

    // Directly update the current profile with personality data
    updateRegisteringProfile({
      personalityScores: scores,
    });

    router.push("/profile/complete");
  };

  return (
    <div className={layoutStyles.container}>
      <div className={layoutStyles.imgContainer}>
        <Image
          src="/images/register/petpersonality/upper.png"
          fill
          sizes="100%"
          alt="반려동물 성격 선택"
          objectFit="contain"
        />
      </div>
      <Card align="center" height="570">
        <Spacer height="53" />
        <Text
          text={`우리집 ${name}${josa}`}
          fontSize="title"
          fontWeight="bold"
          color={Colors.brown}
        />
        <Spacer height="10" />
        <Text
          text={`해당하는 성격을 골라주세요!\n( 최대 5개 선택가능 )`}
          color={Colors.brown}
        />
        <Spacer height="30" />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.formContainer}
        >
          <div className={styles.scrollWrapper}>
            <div className={styles.tagGrid}>
              {personalityTags.map((tag) => (
                <div
                  key={tag}
                  className={`${styles.tagItem} ${
                    selectedTags.includes(tag) ? styles.selected : ""
                  }`}
                  onClick={() => toggleTag(tag)}
                >
                  <Text
                    text={tag}
                    color={
                      selectedTags.includes(tag) ? Colors.brown : Colors.grey
                    }
                    fontWeight="bold"
                    fontSize="md"
                  />
                </div>
              ))}
            </div>
          </div>
          <Spacer height="30" />
          <Button
            valid={isValid}
            onClick={handleSubmit(onSubmit)}
            style={{
              width: "100%",
            }}
          >
            프로필카드 완성
          </Button>
        </form>
      </Card>
    </div>
  );
}
