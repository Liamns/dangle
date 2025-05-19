"use client";
import { BottomModal } from "@/shared/components/modals";
import Modal from "@/shared/components/modals";
import { InnerBox, Spacer } from "@/shared/components/layout";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import { formatDateToKorean, getShortKoreanDayOfWeek } from "@/shared/lib/date";
import styles from "@/app/home/page.module.scss";
import imgStyles from "@/shared/styles/images.module.scss";
import modalStyles from "./ScheduleBottomModal.module.scss";
import Share from "@/shared/svgs/share.svg";
import Image from "next/image";
import { Button } from "@/shared/components/buttons";
import Plus from "@/shared/svgs/plus.svg";
import React, { useEffect, useState, useCallback, memo, useRef } from "react";
import useSWR from "swr";
import Edit from "@/shared/svgs/edit.svg";
import Delete from "@/shared/svgs/delete.svg";
import { getTodaySchedules } from "../apis";
import {
  ScheduleWithItemsModel,
  ScheduleItemWithContentModel,
} from "@/entities/schedule/model";
import LoadingOverlay from "@/shared/components/LoadingOverlay";
import {
  getSubCategoryImagePath,
  SubCategory,
} from "@/shared/types/schedule-category";
import AddScheduleModal from "./AddScheduleModal";
import { useUserStore } from "@/entities/user/store";

/**
 * ScheduleBottomModal Props 인터페이스
 */
interface ScheduleBottomModalProps {
  initialHeight?: number;
}

/**
 * 스케줄 바텀 모달 컴포넌트
 * 홈 화면에서 사용되는 스케줄 정보를 표시하는 모달입니다.
 */
export default function ScheduleBottomModal({
  initialHeight = 0,
}: ScheduleBottomModalProps) {
  const formattedDate = formatDateToKorean();
  const todayDayOfWeek = getShortKoreanDayOfWeek();
  const [innerBoxHeight, setInnerBoxHeight] = useState(initialHeight);

  // useSWR을 사용하여 오늘의 일정 데이터 페칭
  const {
    data: schedules,
    error,
    isLoading,
  } = useSWR("todaySchedules", () => getTodaySchedules());

  /**
   * 공유 버튼 클릭 핸들러
   */
  const handleShareClick = useCallback(() => {
    alert("공유하기");
  }, []);

  // initialHeight가 변경되면 innerBoxHeight 업데이트
  useEffect(() => {
    setInnerBoxHeight(initialHeight);
  }, [initialHeight]);

  return (
    <BottomModal
      draggable
      width="90%"
      py="20"
      px="24"
      justify="start"
      align="center"
      minHeight={innerBoxHeight}
    >
      <ScheduleHeader
        formattedDate={formattedDate}
        dayOfWeek={todayDayOfWeek}
        onShareClick={handleShareClick}
      />
      <ScheduleContent
        schedules={schedules}
        isLoading={isLoading}
        error={error}
      />
    </BottomModal>
  );
}

/**
 * 스케줄 헤더 컴포넌트 Props
 */
interface ScheduleHeaderProps {
  formattedDate: string;
  dayOfWeek: string;
  onShareClick: () => void;
}

/**
 * 스케줄 헤더 컴포넌트
 * 날짜와 공유 버튼을 표시합니다.
 */
const ScheduleHeader = memo(
  ({ formattedDate, dayOfWeek, onShareClick }: ScheduleHeaderProps) => {
    return (
      <InnerBox direction="row">
        <Text
          text={`${formattedDate} [ ${dayOfWeek}요일 ]`}
          fontWeight="bold"
          fontSize="title"
          color={Colors.brown}
        />
        <Spacer width="12" />
        <div className={styles.share} onClick={onShareClick}>
          <Share />
        </div>
      </InnerBox>
    );
  }
);

ScheduleHeader.displayName = "ScheduleHeader";

/**
 * 스케줄 콘텐츠 컴포넌트 Props
 */
interface ScheduleContentProps {
  schedules: ScheduleWithItemsModel[] | undefined;
  isLoading: boolean;
  error: any;
}

/**
 * 스케줄 콘텐츠 컴포넌트
 * 스케줄 내용과 버튼을 표시합니다.
 */
const ScheduleContent = memo(
  ({ schedules, isLoading, error }: ScheduleContentProps) => {
    const [activeItemId, setActiveItemId] = useState<number | null>(null);
    // 일정 추가 모달 상태
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    // 현재 사용자 정보 가져오기
    const currentUser = useUserStore((state) => state.currentUser);
    // useSWR의 mutate 함수 가져오기
    const { mutate } = useSWR("todaySchedules");

    // 문서 전체에 대한 클릭 이벤트 리스너 등록
    useEffect(() => {
      const handleGlobalClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (
          activeItemId !== null &&
          !target.closest(`.${modalStyles.buttonContainer}`) &&
          !target.closest('svg[data-testid="edit-icon"]')
        ) {
          setActiveItemId(null);
        }
      };

      // 이벤트 리스너 등록
      document.addEventListener("mousedown", handleGlobalClick);

      // 페이지 변경 감지를 위한 라우터 이벤트 리스너 추가
      const handleRouteChange = () => {
        // 페이지 이동 시 활성 아이템 초기화
        setActiveItemId(null);
      };

      // Next.js의 router events 활용 (window 이벤트로 대체)
      window.addEventListener("beforeunload", handleRouteChange);

      return () => {
        // 이벤트 리스너 정리
        document.removeEventListener("mousedown", handleGlobalClick);
        window.removeEventListener("beforeunload", handleRouteChange);
      };
    }, [activeItemId]);

    if (isLoading) {
      return <LoadingOverlay isLoading={isLoading} />;
    }

    if (error) {
      return (
        <InnerBox className={modalStyles.errorContainer}>
          <div className={imgStyles.square}>
            <Image
              src={"/images/shared/error.png"}
              alt="error"
              fill
              sizes="100%"
            />
          </div>
          <Text text="오류가 발생했습니다." color={Colors.error} />
        </InnerBox>
      );
    }

    if (!schedules || schedules.length === 0) {
      return (
        <InnerBox className={modalStyles.emptyContainer}>
          <div className={imgStyles.square}>
            <Image
              src={"/images/shared/empty.png"}
              alt="empty"
              fill
              sizes="100%"
            />
          </div>
          <Button color={Colors.primary} width="250" height="40">
            <InnerBox direction="row">
              <Text
                text={`일정을 추가해주세요\u00a0`}
                fontWeight="bold"
                color={Colors.brown}
              />
              <Plus color={Colors.brown} />
            </InnerBox>
          </Button>
        </InnerBox>
      );
    }

    // 모든 일정 아이템들을 시간순으로 정렬
    const allScheduleItems = schedules
      .flatMap((schedule) =>
        schedule.scheduleItems.map((item) => ({
          ...item,
          scheduleId: schedule.id,
          profileId: Number(schedule.profileId),
        }))
      )
      .sort(
        (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
      );

    return (
      <InnerBox
        className={modalStyles.scheduleContentContainer}
        justify="start"
      >
        <Spacer height="16" />
        {allScheduleItems.map((item, index) => (
          <ScheduleItem
            key={`schedule-item-${item.id}-${item.startAt}`}
            item={item}
            isActive={activeItemId === item.id}
            onActivate={() => setActiveItemId(item.id)}
          />
        ))}

        <div
          className={modalStyles.addScheduleButton}
          onClick={() => setIsAddModalOpen(true)}
        >
          <InnerBox direction="row" justify="center">
            <Text
              text={`일정 추가하기\u00a0`}
              fontWeight="bold"
              color={Colors.black}
            />
            <Plus color={Colors.black} />
          </InnerBox>
        </div>

        {/* 일정 추가 모달 */}
        {schedules && schedules.length > 0 && currentUser && (
          <AddScheduleModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            scheduleId={schedules[0].id} // 첫 번째 스케줄의 ID 사용
            userId={currentUser.id} // Zustand 스토어에서 가져온 사용자 ID
            onAddScheduleContent={async (
              scheduleContent,
              scheduleItem,
              favoriteContent
            ) => {
              // 여기에 일정 콘텐츠 추가 API 호출 로직 구현
              console.log("일정 추가:", {
                scheduleContent,
                scheduleItem,
                favoriteContent,
              });
              // TODO: API 호출 구현
            }}
            onSuccess={() => {
              mutate(); // SWR mutate 호출하여 데이터 갱신
            }}
          />
        )}

        <Spacer height="60" />
      </InnerBox>
    );
  }
);

ScheduleContent.displayName = "ScheduleContent";

/**
 * 스케줄 아이템 컴포넌트 Props
 */
interface ScheduleItemProps {
  item: ScheduleItemWithContentModel & {
    scheduleId: number;
    profileId: number;
  };
  isActive: boolean;
  onActivate: () => void;
}

/**
 * 개별 스케줄 아이템 컴포넌트
 */
const ScheduleItem = memo(
  ({ item, isActive, onActivate }: ScheduleItemProps) => {
    // 이전 상태를 추적하기 위한 ref
    const wasActive = React.useRef(isActive);
    // 마운트 상태 추적을 위한 ref
    const isMounted = React.useRef(false);

    // 애니메이션 클래스를 관리하기 위한 상태
    const [animationClass, setAnimationClass] = useState("");

    // 컴포넌트 마운트/언마운트 감지
    useEffect(() => {
      // 컴포넌트가 마운트될 때 초기화
      isMounted.current = true;

      // 초기 상태 설정 - 마운트 시에는 애니메이션 없이 즉시 상태 적용
      setAnimationClass(isActive ? "active" : "");

      return () => {
        // 컴포넌트 언마운트 시 정리
        isMounted.current = false;
      };
    }, []);

    // isActive 변경시 적절한 애니메이션 클래스 적용
    useEffect(() => {
      // 컴포넌트가 마운트된 후에만 애니메이션 적용
      if (isMounted.current) {
        if (isActive) {
          setAnimationClass("active");
        } else if (wasActive.current) {
          // 이전에 활성화 상태였다면 inactive 애니메이션 적용
          setAnimationClass("inactive");
        }
      }

      // 현재 상태를 ref에 저장
      wasActive.current = isActive;
    }, [isActive]);

    // 시간 포맷팅
    const formatTime = (date: Date) => {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const formattedHours = hours < 10 ? `0${hours}` : hours;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      return `${formattedHours}:${formattedMinutes}`;
    };

    return (
      <div
        style={{
          width: "100%",
          position: "relative",
          marginBottom: "8px",
        }}
      >
        <InnerBox direction="row" className={modalStyles.scheduleItem}>
          <InnerBox className={modalStyles.itemContent}>
            <div className={modalStyles.itemPrefixSection}>
              <div className={modalStyles.iconContainer}>
                <Image
                  src={getSubCategoryImagePath(
                    item.content.sub.name as SubCategory
                  )}
                  fill
                  sizes="100%"
                  alt={item.content.sub.name}
                />
              </div>
              <div className={modalStyles.itemDivider}></div>
              <Text
                text={item.content.sub.name}
                fontWeight="bold"
                color={Colors.black}
              />
            </div>
            <div className={modalStyles.itemSuffixSection}>
              <Text text="시작시간" color={Colors.black} />
              <Text
                text={formatTime(new Date(item.startAt))}
                fontSize="sm"
                color={Colors.black}
              />
              <Edit
                width={16}
                height={16}
                color={Colors.brown}
                onClick={onActivate}
                data-testid="edit-icon"
              />
            </div>
          </InnerBox>
        </InnerBox>
        <div
          className={`${modalStyles.buttonContainer} ${
            animationClass ? modalStyles[animationClass] : ""
          }`}
          onAnimationEnd={(e) => {
            // 애니메이션 종료 후 상태 관리
            if (
              e.animationName.includes("hide-buttons") &&
              animationClass === "inactive"
            ) {
              // 숨김 애니메이션이 끝나면 클래스를 비워서 width:0 상태 유지
              setAnimationClass("");
            }
          }}
        >
          <div
            className={modalStyles.deleteButton}
            onClick={() => {
              alert("삭제 클릭");
            }}
          >
            <Delete width={12} height={13} color={Colors.brown} />
          </div>
          <div
            className={modalStyles.editButton}
            onClick={() => {
              alert("수정 클릭");
            }}
          >
            <Edit width={13} height={13} color={Colors.background} />
          </div>
        </div>
      </div>
    );
  }
);

ScheduleItem.displayName = "ScheduleItem";
