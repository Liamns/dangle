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
import { useState, useEffect } from "react";
import styles from "./page.module.scss";
import Modal from "@/shared/components/modals"; // 모달 컴포넌트 임포트
import { encrypt } from "@/shared/lib/crypto";

export default function Profile() {
  const router = useRouter();
  const currentProfile = useMyStore(
    useProfileStore,
    (state) => state.currentProfile
  );

  const isFirst = useProfileStore((state) => state.isFirst);
  const setIsFirst = useProfileStore((state) => state.setIsFirst);

  // 상태 관리 로직 추가
  const [isFlipped, setIsFlipped] = useState(false);

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setIsFirst(false);
  };

  return (
    <InnerWrapper>
      {isFirst && (
        <Modal isOpen={isFirst} onClose={handleCloseModal}>
          <div className={styles.modalContainer}>
            <div className={styles.shareModal}>
              <Image
                src="/images/onboarding/profile/shareModal.png"
                alt="프로필 공유 안내"
                fill
              />
            </div>
            <Spacer height="24" />
            <Text
              text="상세 프로필을 완성하고"
              color={Colors.brown}
              fontSize="lg"
            />
            <Text text="나만의 반려동물" color={Colors.brown} fontSize="lg" />
            <InnerBox direction="row">
              <Text
                text="프로필을 공유"
                color={Colors.brown}
                fontSize="lg"
                fontWeight="bold"
              />
              <Text text="해보세요!" color={Colors.brown} fontSize="lg" />
            </InnerBox>
            <Spacer height="30" />
            <div className={styles.shareModalBtn} onClick={handleCloseModal}>
              <Text
                text="시작하기"
                color={Colors.brown}
                fontSize="lg"
                fontWeight="bold"
              />
            </div>
          </div>
        </Modal>
      )}

      <Spacer height="40" />
      <InnerBox px="30" justify="space-between" direction="row">
        <ArrowButton ml="0" width="30" onClick={() => router.back()}>
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
          onClick={() => {
            router.push("/profile/select-sp?isPlus=true");
          }}
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
        onClick={async () => {
          if (isFlipped) {
            const json = JSON.stringify(currentProfile?.id);
            const encrypted = await encrypt(json);
            const shareUrl = `${
              window.location.origin
            }/profile/viewer?id=${encodeURIComponent(encrypted)}`;
            if (navigator.clipboard?.writeText) {
              navigator.clipboard.writeText(shareUrl).then(() => {
                alert("공유용 링크가 복사되었습니다.");
              });
            } else {
              const textarea = document.createElement("textarea");
              textarea.value = shareUrl;
              document.body.appendChild(textarea);
              textarea.select();
              document.execCommand("copy");
              document.body.removeChild(textarea);
              alert("공유용 링크가 복사되었습니다.");
            }
          } else {
            setIsFlipped(!isFlipped);
          }
        }}
        style={{
          position: "absolute",
          bottom: "14px",
          left: "50%",
          transform: "translateX(-50%)",
          marginTop: "14px",
        }}
      >
        {isFlipped ? "프로필 자랑하기" : "다음 페이지"}
      </Button>
    </InnerWrapper>
  );
}
