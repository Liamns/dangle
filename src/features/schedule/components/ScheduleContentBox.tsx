"use client";

import React, { useCallback } from "react";
import cn from "classnames";
import { InnerBox, Spacer } from "@/shared/components/layout";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import { Tooltip, TooltipContent } from "@/shared/components/tooltip";
import Setting from "@/shared/svgs/setting.svg";
import styles from "./ScheduleContentBox.module.scss";
import Favorite from "@/shared/svgs/favorites.svg";
import { useProfileStore } from "@/entities/profile/store";
import ScheduleContents from "./ScheduleContents";
import { useRouter } from "next/navigation";
import { useScheduleByDate } from "../hooks/useScheduleByDate";
import { encrypt } from "@/shared/lib/crypto";

interface ScheduleContentProps {
  isEditMode: boolean;
  setIsEditMode: (isEditMode: boolean) => void;
  isFavorite?: boolean;
  selectedDate: Date;
  openDatePicker: (initialDate: Date, callback: (date: Date) => void) => void;
}

/**
 * 스케줄 콘텐츠 컴포넌트
 * 즐겨찾기 및 일정관리 버튼을 포함한 스케줄 페이지 상단 영역
 */
const ScheduleContentBox: React.FC<ScheduleContentProps> = ({
  isEditMode,
  setIsEditMode,
  isFavorite = false,
  selectedDate,
  openDatePicker,
}) => {
  const router = useRouter();

  const handleEmptyClick = useCallback(() => {
    // 빈 상태에서 일정 추가 버튼 클릭 시
    router.push("/schedule?edit=true");
  }, [router]);

  // 일정관리 버튼 클릭 시 편집모드 전환
  const handleSettingClick = () => {
    setIsEditMode(!isEditMode);
  };

  // fetch schedule by date (single)
  const currentProfile = useProfileStore((s) => s.currentProfile);
  const profileId = currentProfile?.id ?? "";
  const {
    data: schedule,
    error,
    isLoading,
  } = useScheduleByDate(profileId, selectedDate);

  // 일정 공유 버튼 클릭 핸들러
  const handleShareClick = useCallback(async () => {
    if (!schedule || !currentProfile) return;
    try {
      // Exclude profileId and include pet info
      const { profileId: _, ...scheduleData } = schedule;
      const payload = {
        petName: currentProfile.petname,
        petType: currentProfile.petSpec,
        petGender: currentProfile.petGender,
        schedule: scheduleData,
      };
      const json = JSON.stringify(payload);
      const encrypted = await encrypt(json);
      const shareUrl = `${
        window.location.origin
      }/schedule/viewer?data=${encodeURIComponent(encrypted)}`;
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = shareUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      alert("공유용 링크가 복사되었습니다.");
    } catch (e) {
      console.error("일정 공유 실패", e);
      alert("공유에 실패했습니다. 다시 시도해주세요.");
    }
  }, [schedule, currentProfile]);

  // empty 상태 체크
  const isEmpty = !isLoading && !error && !schedule;

  // 일반모드일 때 렌더링되는 컴포넌트
  return (
    <div className={styles.container}>
      {!isEmpty && (
        <>
          <Spacer height="16" />
          <div className={styles.scheduleBtnHeader}>
            <InnerBox
              direction="row"
              justify="start"
              align="center"
              style={{ flex: 1 }}
            >
              <div
                className={`${styles.favoriteBtn} ${
                  isFavorite ? styles.active : ""
                }`}
                onClick={() => {
                  alert("즐겨찾기 설정");
                }}
              >
                <Favorite
                  width={14}
                  height={14}
                  color={isFavorite ? Colors.primary : Colors.grey}
                />
                <Text
                  text="즐겨찾기"
                  color={isFavorite ? Colors.black : Colors.grey}
                />
              </div>
              <Spacer width="6" />
              <Tooltip>
                <div className={styles.favoriteTip}>
                  <Text text="?" color={Colors.white} />
                </div>
                <TooltipContent
                  placement="bottom"
                  offset={8}
                  showBackdrop={true}
                  hasArrow={false}
                >
                  <div>
                    <Text
                      text="'즐겨찾기'를 설정하면 '불러오기'로 일정을 불러올 수 있어요!"
                      fontSize="sm"
                      color={Colors.black}
                    />
                  </div>
                </TooltipContent>
              </Tooltip>
            </InnerBox>

            <div
              className={styles.scheduleSettingBtn}
              onClick={handleSettingClick}
            >
              <Text
                text="일정관리"
                color={Colors.brown}
                fontWeight="bold"
                fontSize="sm"
              />
              <Spacer width="4" />
              <Setting width={12} height={12} color={Colors.brown} />
            </div>
          </div>
        </>
      )}

      <div className={cn(styles.scrollable, isEmpty && styles.empty)}>
        <ScheduleContents
          schedule={schedule}
          isLoading={isLoading}
          error={error}
          openDatePicker={openDatePicker}
          hasAddBtn={false}
          onEmptyAddClick={handleEmptyClick}
        />

        {schedule && (
          <div className={styles.shareBtn} onClick={handleShareClick}>
            <Text text="일정 공유하기" fontWeight="bold" color={Colors.white} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleContentBox;
