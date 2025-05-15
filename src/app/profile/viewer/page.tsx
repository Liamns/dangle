"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { decrypt } from "@/shared/lib/crypto";
import { InnerWrapper, Spacer } from "@/shared/components/layout";
import { Button } from "@/shared/components/buttons";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import ProfileViewer from "@/features/profile/components/ProfileViewer";
import styles from "./page.module.scss";

export default function ProfileViewerPage() {
  const searchParams = useSearchParams();
  const dataParam = searchParams.get("data");
  const [profileData, setProfileData] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (!dataParam) return;
    (async () => {
      try {
        // 복호화 시 자료 오류가 나는 경우 URI 디코딩된 형태도 시도
        let decryptedText: string;
        try {
          decryptedText = await decrypt(dataParam);
        } catch (_e) {
          const decoded = decodeURIComponent(dataParam);
          decryptedText = await decrypt(decoded);
        }
        const parsed = JSON.parse(decryptedText);
        setProfileData(parsed);
      } catch (err) {
        console.error("Invalid profile data", err);
      }
    })();
  }, [dataParam]);

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
