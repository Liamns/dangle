"use client";

import React from "react";
import { InnerBox, Spacer } from "@/shared/components/layout";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import { Tooltip, TooltipContent } from "@/shared/components/tooltip";
import Setting from "@/shared/svgs/setting.svg";
import styles from "./ScheduleContent.module.scss";
import Favorite from "@/shared/svgs/favorites.svg";

interface ScheduleContentProps {
  isEditMode: boolean;
  setIsEditMode: (isEditMode: boolean) => void;
  isFavorite?: boolean;
}

/**
 * 스케줄 콘텐츠 컴포넌트
 * 즐겨찾기 및 일정관리 버튼을 포함한 스케줄 페이지 상단 영역
 */
const ScheduleContent: React.FC<ScheduleContentProps> = ({
  isEditMode,
  setIsEditMode,
  isFavorite = false,
}) => {
  // 일정관리 버튼 클릭 시 편집모드 전환
  const handleSettingClick = () => {
    setIsEditMode(!isEditMode);
  };

  // 일반모드일 때 렌더링되는 컴포넌트
  return (
    <div className={styles.container}>
      <InnerBox direction="row" justify="space-between" py="0" px="0">
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

        <div className={styles.scheduleSettingBtn} onClick={handleSettingClick}>
          <Text
            text="일정관리"
            color={Colors.brown}
            fontWeight="bold"
            fontSize="sm"
          />
          <Spacer width="4" />
          <Setting width={12} height={12} color={Colors.brown} />
        </div>
      </InnerBox>

      <Spacer height="15" />
    </div>
  );
};

export default ScheduleContent;
