"use client";
import { ArrowButton } from "@/shared/components/buttons";
import { useCallback, useMemo, useState } from "react";
import BottomNavBar from "../../shared/components/bottom-nav-bar";
import { InnerBox, InnerWrapper, Spacer } from "../../shared/components/layout";
import styles from "./page.module.scss";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Colors } from "@/shared/consts/colors";
import {
  FavoriteItem,
  useFavorites,
} from "@/features/favorites/hooks/useFavorites";
import LoadingOverlay from "@/shared/components/LoadingOverlay";
import { useProfileStore } from "@/entities/profile/store";
import { Text } from "@/shared/components/texts";
import cn from "classnames";
import ScheduleSvg from "@/shared/svgs/schedule.svg";
import RoutineSvg from "@/shared/svgs/routine.svg";
import FavoriteScheduleCard from "@/features/favorites/components/FavoriteScheduleCard";
import {
  FavoriteScheduleModel,
  ScheduleWithItemsModel,
} from "@/entities/schedule/model";
import FavoriteRoutineCard from "@/features/favorites/components/FavoriteRoutineCard";
import { RoutineWithContentsModel } from "@/entities/routine/schema";
import { encrypt } from "@/shared/lib/crypto";

export default function Favorites() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"routine" | "schedule">(
    "schedule"
  );
  const [isSelectMode, setIsSelectMode] = useState(false);
  const currentProfile = useProfileStore((s) => s.currentProfile);
  const profileId = currentProfile?.id ?? "";

  // 즐겨찾기 훅 호출
  const {
    favorites,
    isFetching: isLoading,
    toggleFavorite,
    isToggling,
    fetchError,
  } = useFavorites(activeTab);

  const isRoutineActive = useMemo(() => activeTab === "routine", [activeTab]);
  const isScheduleActive = useMemo(() => activeTab === "schedule", [activeTab]);

  const handleEmptyClick = useCallback(() => {
    if (isRoutineActive) router.push("/routine");
    else if (isScheduleActive) router.push("/schedule");
  }, [isRoutineActive, isScheduleActive, router]);

  const handleShareClick = useCallback(
    async (data: FavoriteItem[]) => {
      // 공유 기능 구현
      const ids = data.map((item) => item.id);
      const json = JSON.stringify(ids);
      const encrypted = encrypt(json);
      const url = `${
        window.location.origin
      }/favorites/${activeTab}-viewer?ids=${encodeURIComponent(encrypted)}`;
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      alert("공유용 링크가 복사되었습니다.");
    },
    [isRoutineActive, isScheduleActive]
  );

  return (
    <InnerWrapper>
      {isLoading && <LoadingOverlay isLoading={isLoading} />}
      <div className={styles.container}>
        {/* Upper Buttons */}
        <InnerBox px="30" justify="space-between" direction="row">
          <ArrowButton width="30" ml="0" onClick={() => router.back()}>
            <Image
              src="/images/white-bracket.png"
              alt="뒤로가기"
              width={5}
              height={8}
              style={{ objectFit: "cover" }}
              sizes="100%"
            />
          </ArrowButton>

          <div
            className={cn(styles.selectBtn, { [styles.active]: isSelectMode })}
            onClick={() => setIsSelectMode((prev) => !prev)}
          >
            <Text
              text={isSelectMode ? "완료" : "선택"}
              color={isSelectMode ? Colors.brown : Colors.white}
              fontWeight="bold"
            />
          </div>
        </InnerBox>
        {/* End of Upper Buttons */}

        {/* Toggle Tab */}
        <div className={styles.tabBox}>
          <div
            className={cn(styles.scheduleTab, {
              [styles.active]: isScheduleActive,
            })}
            onClick={() => setActiveTab("schedule")}
          >
            <ScheduleSvg className={styles.scheduleSvg} />
            <Text
              text="일정"
              fontWeight="bold"
              color={isScheduleActive ? Colors.white : Colors.darkGrey}
            />
          </div>
          <div
            className={cn(styles.routineTab, {
              [styles.active]: isRoutineActive,
            })}
            onClick={() => setActiveTab("routine")}
          >
            <RoutineSvg className={styles.routineSvg} />
            <Text
              text="루틴"
              fontWeight="bold"
              color={isRoutineActive ? Colors.white : Colors.darkGrey}
            />
          </div>
        </div>
        {/* End of Toggle Tab */}

        {/* Content Card */}
        {isScheduleActive && (
          <FavoriteScheduleCard
            favorites={favorites as FavoriteScheduleModel[]}
            onEmptyClick={handleEmptyClick}
            onShareClick={handleShareClick}
            isSelectMode={isSelectMode}
          />
        )}

        {isRoutineActive && (
          <FavoriteRoutineCard
            favorites={favorites as RoutineWithContentsModel[]}
            onEmptyClick={handleEmptyClick}
            onShareClick={handleShareClick}
            isSelectMode={isSelectMode}
          />
        )}
        {/* End of Content Card */}
      </div>

      <BottomNavBar />
    </InnerWrapper>
  );
}
