"use client";

import { useState } from "react";
import { InnerWrapper, Spacer } from "@/shared/components/layout";
import { Button } from "@/shared/components/buttons";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import ProfileViewer from "@/features/profile/components/ProfileViewer";
import styles from "./page.module.scss";
import { ProfileModel } from "@/entities/profile/model";

interface ProfileViewerContentProps {
  initialProfileData: ProfileModel;
}

export default function ProfileViewerContent({
  initialProfileData,
}: ProfileViewerContentProps) {
  const [profileData] = useState<ProfileModel | null>(initialProfileData);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!profileData) {
    return (
      <InnerWrapper>
        <Spacer height="20" />
        <Text text="유효한 프로필 데이터가 없습니다." color={Colors.invalid} />
      </InnerWrapper>
    );
  }

  return (
    <InnerWrapper>
      <Spacer height="40" />
      <div className={styles.container}>
        <ProfileViewer
          profile={profileData}
          isFlipped={isFlipped}
          onFlip={setIsFlipped}
        />
      </div>
      <Button
        width="300"
        height="57"
        mt="14"
        mb="14"
        onClick={() => {
          setIsFlipped(!isFlipped);
        }}
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          bottom: "0",
        }}
      >
        {isFlipped ? "이전 페이지" : "다음 페이지"}
      </Button>
    </InnerWrapper>
  );
}
