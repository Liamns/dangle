"use client";
import AnnivWidget from "@/features/anniversary/components/anniv-widget";
import BottomNavBar from "../../shared/components/bottom-nav-bar";
import { InnerBox, InnerWrapper, Spacer } from "../../shared/components/layout";
import HomeProfile from "@/features/profile/components/HomeProfile";
import ScheduleBottomModal from "@/features/schedule/components/ScheduleBottomModal";

// 둘러보기 및 url 로 직접 접근 시 처리

export default function Home() {
  return (
    <InnerWrapper>
      <InnerBox>
        <Spacer height="32" />
        <AnnivWidget />
        <HomeProfile />
      </InnerBox>
      <ScheduleBottomModal />
      <BottomNavBar />
    </InnerWrapper>
  );
}
