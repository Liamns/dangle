"use client";

import React, { useCallback, useEffect, useState } from "react";
import cn from "classnames";
import { InnerBox, Spacer } from "@/shared/components/layout";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import { Tooltip, TooltipContent } from "@/shared/components/tooltip";
import Setting from "@/shared/svgs/setting.svg";
import styles from "./ScheduleContentBox.module.scss";
import Favorite from "@/shared/svgs/favorites.svg";
import { useProfileStore } from "@/entities/profile/store";
import ScheduleItemList from "./ScheduleItemList";
import { useRouter } from "next/navigation";
import { encrypt } from "@/shared/lib/crypto";
import RegisterFavoriteScheduleModal from "./RegisterFavoriteScheduleModal";
import { FavoriteScheduleFormData } from "@/entities/schedule/schema";
import { useSchedules } from "../hooks/useSchedules";
import { useScheduleStore } from "@/entities/schedule/store";

interface ScheduleContentProps {
  isEditMode: boolean;
  setIsEditMode: (isEditMode: boolean) => void;
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
  const { currentSchedule: schedule } = useScheduleStore();
  const { isProcessing: isLoading, fetchError: error } = useSchedules();

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
  const isEmpty =
    (!isLoading && !error && schedule.items && schedule.items.length === 0) ||
    !schedule.items;

  const [isFavorite, setIsFavorite] = useState<boolean>(
    schedule?.isFavorite ?? false
  );
  useEffect(() => {
    // schedule이 변경될 때마다 즐겨찾기 상태 업데이트
    setIsFavorite(schedule?.isFavorite ?? false);
  }, [schedule]);

  const [isFavoriteModalOpen, setIsFavoriteModalOpen] = useState(false);

  const handleRegisterFavorite = useCallback(
    (alias: string, icon: number) => {
      if (!schedule || !currentProfile) return;

      const favoriteData: FavoriteScheduleFormData = {
        alias: alias,
        icon: icon,
      };
      console.log("즐겨찾기 등록 데이터:", favoriteData);
      alert("즐겨찾기 여부에 따른 기능 구현 필요");
    },
    [isFavorite, currentProfile]
  );

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
                  setIsFavoriteModalOpen(true);
                }}
              >
                <Favorite
                  width={14}
                  height={14}
                  color={isFavorite ? Colors.brown : Colors.grey}
                />
                <Text
                  text="즐겨찾기"
                  color={isFavorite ? Colors.brown : Colors.grey}
                  fontWeight={isFavorite ? "bold" : "normal"}
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

          {schedule && (
            <RegisterFavoriteScheduleModal
              isOpen={isFavoriteModalOpen}
              onClose={() => {
                setIsFavoriteModalOpen(false);
              }}
              onRegister={handleRegisterFavorite}
            />
          )}
        </>
      )}

      <div className={cn(styles.scrollable, isEmpty && styles.empty)}>
        <ScheduleItemList
          schedule={schedule}
          isLoading={isLoading}
          error={error}
          openDatePicker={openDatePicker}
          hasAddBtn={false}
          onEmptyAddClick={handleEmptyClick}
        />

        {schedule.items && schedule.items.length > 0 && (
          <div className={styles.shareBtn} onClick={handleShareClick}>
            <Text text="일정 공유하기" fontWeight="bold" color={Colors.white} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleContentBox;
