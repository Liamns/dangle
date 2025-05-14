"use client";

import { ArrowButton, Button } from "@/shared/components/buttons";
import {
  Card,
  Center,
  InnerBox,
  InnerWrapper,
  Spacer,
} from "../../shared/components/layout";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import Plus from "@/shared/svgs/plus.svg";
import ProfileCard from "@/features/profile/components/ProfileCard";
import { useProfileStore } from "@/entities/profile/store";
import { useMyStore } from "@/shared/hooks/store";
import { useState } from "react";
import styles from "./page.module.scss";

export default function Profile() {
  const router = useRouter();
  const currentProfile = useMyStore(
    useProfileStore,
    (state) => state.currentProfile
  );

  // 상태 관리 로직 추가
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <InnerWrapper>
      <Spacer height="40" />
      <InnerBox px="30" justify="space-between" direction="row">
        <ArrowButton ml="0" onClick={() => router.back()}>
          <Image
            src="/images/white-bracket.png"
            alt="뒤로가기"
            width={5}
            height={8}
            style={{ objectFit: "cover" }}
            sizes="100%"
          />
        </ArrowButton>
        <Button
          color={Colors.halfBackground}
          width="168"
          height="28"
          style={{ outline: "1.5px solid #fff" }}
          onClick={() => alert("프로필 추가 페이지로 이동")}
        >
          <Text text="프로필 추가" color={Colors.brown} />
          <Spacer width="6" />
          <Plus color={Colors.brown} />
        </Button>
      </InnerBox>
      <Spacer height="18" />

      {/* ProfileCard에 상태와 핸들러 전달 */}
      <div className={styles.container}>
        <ProfileCard isFlipped={isFlipped} onFlip={setIsFlipped} />
      </div>

      <Button
        width="300"
        height="57"
        onClick={() => {
          setIsFlipped(!isFlipped);
        }}
        style={{
          position: "absolute",
          bottom: "14px",
          left: "50%",
          transform: "translateX(-50%)",
          marginTop: "14px",
        }}
      >
        다음 페이지
      </Button>
    </InnerWrapper>
  );
}
