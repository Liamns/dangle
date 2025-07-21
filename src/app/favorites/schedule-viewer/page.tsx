"use client";
import { Card, Center, InnerWrapper } from "@/shared/components/layout";
import styles from "./page.module.scss";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { decrypt } from "@/shared/lib/crypto";
import { ScheduleWithItemsModel, ScheduleItemWithSubCategoryModel } from "@/entities/schedule/model";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import LoadingOverlay from "@/shared/components/LoadingOverlay";
import Image from "next/image";
import cn from "classnames";
import ChevronSvg from "@/shared/svgs/chevron.svg";
import {
  getSubCategoryImagePath,
  SubCategory,
} from "@/entities/schedule/types";
import { formatTime } from "@/shared/lib/date";
import { EMPTY_PROFILE, useProfileStore } from "@/entities/profile/store";

function FavoriteScheduleViewer() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  const searchParams = useSearchParams();
  const dataParam = searchParams.get("data");
  const [schedules, setSchedules] = useState<ScheduleWithItemsModel[]>([]);

  useEffect(() => {
    if (!dataParam) return;

    try {
      const decode = decodeURIComponent(dataParam);
      const decryptedText = decrypt(decode);
      const parsedData = JSON.parse(decryptedText);
      setSchedules(parsedData as ScheduleWithItemsModel[]);
      console.log("Decrypted and parsed data:", parsedData);
    } catch (e) {
      console.error("Error parsing data:", e);
    }
  }, [dataParam]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  // 페이지 이동 함수
  const goToPage = useCallback(
    (index: number) => {
      // 범위 체크
      if (index < 0 || index >= schedules.length) return;

      // 페이지 상태 업데이트
      setCurrentIndex(index);

      // 슬라이더 이동
      if (wrapperRef.current) {
        wrapperRef.current.style.transform = `translateX(-${index * 100}%)`;
      }
    },
    [schedules.length]
  );

  // 다음 페이지로 이동
  const handleNext = useCallback(() => {
    goToPage(currentIndex + 1);
  }, [currentIndex, goToPage]);

  // 이전 페이지로 이동
  const handlePrev = useCallback(() => {
    goToPage(currentIndex - 1);
  }, [currentIndex, goToPage]);

  const profile = useProfileStore((state) => state.currentProfile);

  const handleSave = useCallback(
    (data: ScheduleWithItemsModel) => {
      if (!profile || profile === EMPTY_PROFILE) {
        alert("댕글 회원가입 후 이용해주세요.");
        return;
      }

      alert("즐겨찾기에 일정 추가로직");
      console.log("Saving schedule:", data);
    },
    [currentIndex, profile]
  );

  return (
    <InnerWrapper>
      {schedules.length > 0 ? (
        <div className={styles.container}>
          {/* Title */}
          <div className={styles.titleBox}>
            <div className={styles.badge}>
              <Image src={"/images/shared/badge.png"} alt="댕글 뱃지" fill />
            </div>

            <div className={styles.title}>
              <Text
                text={`슬기로운 반려생활,\u00a0`}
                color={Colors.brown}
                fontSize="lg"
              />
              <Text
                text="댕글"
                color={Colors.brown}
                fontFamily="jalnan"
                fontWeight="bold"
                fontSize="title"
              />
            </div>

            <div className={styles.subtitle}>
              <Text
                text="따듯하고 편리한 "
                color={Colors.brown}
                fontWeight="bold"
                fontSize="tiny"
              />
              <Text
                text="반려생활을 위하여"
                color={Colors.brown}
                fontSize="tiny"
              />
            </div>
          </div>
          {/* End of Title */}

          {/* Content */}
          <div className={styles.contentBox}>
            <div className={styles.indicatorWrapper}>
              {schedules.map((schedule, index) => (
                <div
                  className={cn(styles.indicator, {
                    [styles.active]: currentIndex === index,
                  })}
                  key={index}
                >
                  <Text
                    text={`${index + 1}`}
                    color={Colors.white}
                    fontWeight="bold"
                  />
                </div>
              ))}
            </div>

            <Card py="15" px="25" mx="0" height="504">
              {schedules[currentIndex] && (
                <div className={styles.cardTitle}>
                  <div
                    className={cn(styles.navButton, {
                      [styles.inactive]: currentIndex === 0,
                    })}
                    onClick={handlePrev}
                  >
                    <ChevronSvg className={styles.chevron} />
                  </div>
                  <Text
                    text={
                      schedules[currentIndex].alias ||
                      `${currentIndex + 1}번째 일정`
                    }
                    fontWeight="bold"
                    fontSize="title"
                    color={Colors.brown}
                  />
                  <div
                    className={cn(styles.navButton, styles.next, {
                      [styles.inactive]: currentIndex === schedules.length - 1,
                    })}
                    onClick={handleNext}
                  >
                    <ChevronSvg className={styles.chevron} />
                  </div>
                </div>
              )}

              <div className={styles.slideContainer}>
                <div
                  className={styles.slideWrapper}
                  ref={wrapperRef}
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                  {schedules.map((schedule, index) => {
                    return (
                      <div className={styles.slide} key={index}>
                        {schedule.items &&
                          schedule.items.length > 0 && (
                            <div className={styles.cardContentBox}>
                              {schedule.items.map((item: ScheduleItemWithSubCategoryModel, itemIndex: number) => {
                                return (
                                  <div
                                    className={styles.cardContent}
                                    key={`item-${itemIndex}`}
                                  >
                                    <div className={styles.cardContentPrefix}>
                                      <div
                                        className={styles.cardContentPrefixIcon}
                                      >
                                        <Image
                                          src={getSubCategoryImagePath(
                                            item.subCategory.name as SubCategory
                                          )}
                                          alt={item.subCategory.name}
                                          fill
                                        />
                                      </div>
                                      <div
                                        className={
                                          styles.cardContentPrefixDivider
                                        }
                                      ></div>
                                      <Text
                                        text={item.subCategory.name}
                                        color={Colors.black}
                                        fontWeight="bold"
                                      />
                                    </div>
                                    <div className={styles.cardContentSuffix}>
                                      <Text
                                        text="시작시간"
                                        color={Colors.black}
                                      />
                                      <Text
                                        text={formatTime(
                                          new Date(item.startAt)
                                        )}
                                        color={Colors.black}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                              <div
                                className={styles.saveButton}
                                onClick={() => handleSave(schedule)}
                              >
                                <Text
                                  text="저장하기"
                                  color={Colors.white}
                                  fontWeight="bold"
                                />
                              </div>
                            </div>
                          )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>
          {/* End of Content */}
        </div>
      ) : (
        <LoadingOverlay isLoading={!hydrated} />
      )}
    </InnerWrapper>
  );
}

FavoriteScheduleViewer.displayName = "FavoriteScheduleViewer";
export default FavoriteScheduleViewer;
