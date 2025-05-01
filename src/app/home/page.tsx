"use client";
import AnnivWidget from "@/features/anniversary/components/anniv-widget";
import BottomNavBar from "../../shared/components/bottom-nav-bar";
import { InnerBox, InnerWrapper, Spacer } from "../../shared/components/layout";
import HomeProfile from "@/features/profile/components/HomeProfile";
import { BottomModal } from "@/shared/components/modals";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";

// 둘러보기 및 url 로 직접 접근 시 처리

export default function Home() {
  return (
    <InnerWrapper>
      <InnerBox>
        <Spacer height="32" />
        <AnnivWidget />
        <HomeProfile />
      </InnerBox>
      <BottomModal
        draggable
        width="90%"
        py="20"
        px="24"
        justify="start"
        align="center"
      >
        <Spacer height="10" />
        <InnerBox direction="row">
          <Text
            text="테스트"
            fontWeight="bold"
            fontSize="title"
            color={Colors.brown}
          />
        </InnerBox>

        <Spacer height="160" />
      </BottomModal>
      <BottomNavBar />
    </InnerWrapper>
  );
}
