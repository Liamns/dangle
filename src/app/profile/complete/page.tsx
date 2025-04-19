"use client";
import { ArrowButton, Button } from "@/shared/components/buttons";
import {
  Card,
  Center,
  InnerBox,
  InnerWrapper,
  Spacer,
} from "@/shared/components/layout";
import { BottomModal } from "@/shared/components/modals";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import Image from "next/image";
import { useState } from "react";
import styles from "./page.module.scss";
import Dog from "@/shared/svgs/dog.svg";
import Cat from "@/shared/svgs/cat.svg";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/entities/profile/store";

export default function SelectSpecies() {
  const router = useRouter();
  const [front, setFront] = useState(true);
  const currentProfile = useProfileStore((s) => s.currentProfile);
  const petSpec = currentProfile?.petSpec ?? 0;

  return (
    <InnerWrapper>
      <Spacer height="48" />

      <Card>
        <InnerBox>
          <InnerBox direction="row">
            <Text
              text={`${petSpec === 0 ? "댕댕이" : "야옹이"} 프로필`}
              color={Colors.brown}
              fontWeight="bold"
              fontSize="title"
            />
            <Spacer width="6" />
            {petSpec === 0 ? (
              <Dog style={{ color: Colors.brown }} />
            ) : (
              <Cat style={{ color: Colors.brown }} />
            )}
          </InnerBox>
        </InnerBox>
      </Card>

      <BottomModal>
        <InnerBox>
          <Text text="기본 프로필 완성!" fontSize="lg" fontWeight="bold" />
          <Spacer height="6" />
          <Text text={`더 많은 정보를 등록하고 공유해보세요`} />
        </InnerBox>

        <Spacer height="22" />

        <Button
          color={Colors.brown}
          fontWeight="bold"
          onClick={() => {
            if (front) {
              setFront(false);
            } else {
              // Navigate to main app after profile completion
              router.push("/");
            }
          }}
        >
          {front ? "다음" : "댕글 시작하기"}
        </Button>
      </BottomModal>
    </InnerWrapper>
  );
}
