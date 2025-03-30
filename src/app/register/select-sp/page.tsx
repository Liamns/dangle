"use client";
import {
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

export default function SelectSpecies() {
  const [species, setSpecies] = useState<number>(0);

  return (
    <InnerWrapper>
      <Spacer height="48" />

      <Center>
        <Image
          src="/images/register/select-sp/icon.png"
          width={40}
          height={40}
          alt="동물선택 페이지 아이콘"
        />
      </Center>
      <InnerBox>
        <Text
          text="나만의"
          fontSize="lg"
          fontWeight="bold"
          color={Colors.brown}
        />
        <Text
          text="댕글"
          fontSize="logo"
          fontWeight="bold"
          fontFamily="jalnan"
          color={Colors.brown}
        />
      </InnerBox>

      <Spacer height="36" />

      <BottomModal>
        <div>test</div>
      </BottomModal>
    </InnerWrapper>
  );
}
