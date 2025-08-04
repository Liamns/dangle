"use client";
import { memo, useCallback, useState } from "react";
import styles from "./RoutineViewerModal.module.scss";
import Modal from "@/shared/components/modals";
import Routine from "@/app/routine/page";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import { RoutineWithContentsModel } from "@/entities/routine/schema";
import { RoutineCategoryColors } from "@/entities/routine/types";
import FavoriteSvg from "@/shared/svgs/favorites.svg";
import cn from "classnames";
import Image from "next/image";
import { DEFAULT_ROUTINE_IMAGE_URL } from "./WriteRoutineContent";
import { fontSizeMap } from "@/shared/types/text";
import { COMMON_MESSAGE } from "@/shared/consts/messages";

interface RoutineViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  routine?: RoutineWithContentsModel;
  isFavorite: boolean;
  toggleFavorite: (id: number) => void;
  isToggling?: boolean;
}

const RoutineViewModal = memo(
  ({
    isOpen,
    onClose,
    routine,
    isFavorite,
    toggleFavorite,
    isToggling = false,
  }: RoutineViewerModalProps) => {
    if (routine === undefined || routine === null) {
      if (isOpen) {
        alert(COMMON_MESSAGE.WRONG_ACCESS);
      }
      return null;
    }

    const categoryColor = RoutineCategoryColors[routine.category];
    // 로컬 클릭 방지 상태
    const [isClicked, setIsClicked] = useState(false);

    // 실제 토글링 상태는 외부 isToggling 또는 로컬 isClicked 중 하나라도 true면 true
    const isActuallyToggling = isToggling || isClicked;
    const handleFavoriteToggle = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();

        if (isActuallyToggling || !routine) return;

        setIsClicked(true);
        toggleFavorite(routine.id);

        setTimeout(() => {
          setIsClicked(false);
        }, 1000);
      },
      [isActuallyToggling, routine, toggleFavorite]
    );

    // 현재 선택된 콘텐츠 인덱스
    const [currentIndex, setCurrentIndex] = useState(0);

    // 다음 페이지로 이동
    const handleNext = useCallback(() => {
      if (routine?.contents && currentIndex < routine.contents.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      }
    }, [currentIndex, routine?.contents]);

    // 이전 페이지로 이동
    const handlePrev = useCallback(() => {
      if (currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      }
    }, [currentIndex]);

    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        style={{ backgroundColor: Colors.transparnet } as React.CSSProperties}
      >
        <div className={styles.container}>
          {/* Slider Wrapper */}
          <div className={styles.sliderWrapper}>
            {/* Slider Inner with transform for sliding effect */}
            <div
              className={styles.sliderInner}
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {/* Routine Card */}
              {routine.contents &&
                routine.contents.map((content, index) => (
                  <div
                    className={styles.content}
                    style={
                      {
                        "--routine-viewer-category-color": categoryColor,
                      } as React.CSSProperties
                    }
                    key={content.id}
                  >
                    <FavoriteSvg
                      className={cn(styles.favoriteToggleButton, {
                        [styles.active]: isFavorite,
                        [styles.toggling]: isToggling,
                      })}
                      onClick={handleFavoriteToggle}
                    />
                    {/* Title */}
                    <div className={styles.title}>
                      <Text text={routine.category} color={categoryColor} />
                      <Text
                        text={content.title}
                        color={Colors.black}
                        fontWeight="bold"
                      />
                    </div>
                    {/* End of Title */}

                    {/* Image */}
                    <div className={styles.image}>
                      <Image
                        src={
                          content.image
                            ? content.image
                            : DEFAULT_ROUTINE_IMAGE_URL
                        }
                        alt={`루틴 ${index + 1}번째 내용 이미지`}
                        fill
                      />
                    </div>
                    {/* End of Image */}

                    {/* Memo */}
                    <div className={styles.memoBox}>
                      <Text text="Memo" color={categoryColor} />
                      <textarea
                        className={styles.memo}
                        value={content.memo}
                        style={{ fontSize: fontSizeMap["sm"] }}
                        onChange={() => {}}
                        readOnly
                      />
                    </div>
                    {/* End of Memo */}

                    {/* Navigation Buttons */}
                    <div className={styles.navBox}>
                      <div className={styles.navButton} onClick={handlePrev}>
                        <div className={styles.navArrow}>
                          <Image
                            src={"/images/white-bracket.png"}
                            alt="이전으로"
                            fill
                          />
                        </div>
                      </div>
                      <Text
                        text={`${currentIndex + 1}/${routine.contents.length}`}
                        color={categoryColor}
                      />
                      <div className={styles.navButton} onClick={handleNext}>
                        <div className={styles.navArrow}>
                          <Image
                            src={"/images/white-bracket.png"}
                            alt="다음으로"
                            fill
                            style={
                              {
                                transform: "rotate(180deg)",
                              } as React.CSSProperties
                            }
                          />
                        </div>
                      </div>
                    </div>
                    {/* End of Navigation Buttons */}
                  </div>
                ))}
              {/* End of Routine Card */}
            </div>
          </div>
          {/* End of Slider Wrapper */}

          {/* 공유 버튼 */}
          {/* <div className={styles.button}>
            <Text
              text="루틴 공유하기"
              color={Colors.white}
              fontSize="lg"
              fontWeight="bold"
            />
          </div> */}
        </div>
      </Modal>
    );
  }
);

RoutineViewModal.displayName = "RoutineViewModal";
export default RoutineViewModal;
