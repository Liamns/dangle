"use client";
import { RoutineWithContentsModel } from "@/entities/routine/schema";
import { FavoriteItem } from "../hooks/useFavorites";
import styles from "./FavoriteRoutineCard.module.scss";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/shared/components/layout";
import EmptyFavorites from "./EmptyFavorites";
import { RoutineCategory } from "@/entities/routine/types";
import { Text } from "@/shared/components/texts";
import SortSvg from "@/shared/svgs/sort.svg";
import { Colors } from "@/shared/consts/colors";
import Image from "next/image";
import cn from "classnames";
import chkbox from "@/shared/styles/buttons.module.scss";

interface FavoriteRoutineCardProps {
  favorites: RoutineWithContentsModel[];
  onEmptyClick: () => void;
  isSelectMode: boolean;
  onShareClick: (data: FavoriteItem[]) => void;
}

const FavoriteRoutineCard = memo(
  ({
    favorites,
    onEmptyClick,
    isSelectMode,
    onShareClick,
  }: FavoriteRoutineCardProps) => {
    const [isSortOpen, setIsSortOpen] = useState(false);
    const sortRef = useRef<HTMLDivElement>(null);

    // 활성화된 아이템 관리를 위한 상태 (index 기반으로 변경)
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          sortRef.current &&
          !sortRef.current.contains(event.target as Node) &&
          isSortOpen
        ) {
          setIsSortOpen(false);
        }

        // 활성화된 아이템이 있고, 클릭이 해당 아이템 외부에서 발생한 경우 비활성화
        if (activeIndex !== null) {
          const target = event.target as Element;
          // EditSvg 클릭이나 버튼 컨테이너 내부 클릭이 아닌 경우
          const isClickedOnEditSvg = target.closest(
            `.${styles.contentSuffixSvg}`
          );
          const isClickedOnButtonContainer = target.closest(
            `.${styles.buttonContainer}`
          );

          if (!isClickedOnEditSvg && !isClickedOnButtonContainer) {
            setActiveIndex(null);
          }
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isSortOpen, activeIndex]);
    const [sortType, setSortType] = useState<"category" | "name">("category");
    const handleSortChange = (type: "category" | "name") => {
      setSortType(type);
      setIsSortOpen(false);
    };
    const getSortLabel = (type: "category" | "name") => {
      return type === "category" ? "카테고리순" : "이름순";
    };
    const sortLabel = useMemo(() => getSortLabel(sortType), [sortType]);

    const sorted = useMemo(() => {
      const sort: RoutineWithContentsModel[] = [...favorites];

      return sort.sort((a, b) => {
        if (sortType === "category") {
          // 열거형을 직접 비교하지 않고 안전하게 문자열로 처리
          const aCategory = a?.category ? String(a.category) : "";
          const bCategory = b?.category ? String(b.category) : "";

          return aCategory.localeCompare(bCategory);
        } else {
          // 이름순 정렬도 null 체크 추가
          const aName = a?.name || "";
          const bName = b?.name || "";
          return aName.localeCompare(bName);
        }
      });
    }, [favorites, sortType]);

    const handleCheckboxClick = useCallback(
      (index: number) => {
        setSelectedIndexes((prev) => {
          if (prev.includes(index)) {
            return prev.filter((i) => i !== index);
          } else {
            return [...prev, index];
          }
        });
      },
      [setSelectedIndexes]
    );

    const isEmpty = useMemo(() => sorted.length === 0, [sorted]);

    useEffect(() => {
      if (!isSelectMode) {
        setSelectedIndexes([]); // 선택 모드일 때 선택된 인덱스 초기화
      }
    }, [isSelectMode]);

    const isSelected = useCallback(
      (index: number) => {
        return selectedIndexes.includes(index);
      },
      [selectedIndexes]
    );

    const handleShareClick = useCallback(() => {
      if (selectedIndexes.length === 0) {
        alert("공유할 루틴을 선택해주세요.");
        return;
      }
      console.log(selectedIndexes);
      const selectedItems = sorted.filter((_, index) => isSelected(index));
      onShareClick(selectedItems);
    }, [sorted, isSelected, onShareClick]);

    return (
      <Card py="20">
        <div className={styles.container}>
          {isEmpty ? (
            <EmptyFavorites onEmptyClick={onEmptyClick} activeTab="routine" />
          ) : (
            <>
              {/* Sort */}
              <div
                className={styles.sortBox}
                onClick={() => setIsSortOpen(!isSortOpen)}
              >
                <Text text={sortLabel} color={Colors.black} fontWeight="bold" />
                <SortSvg className={styles.sortSvg} />

                {isSortOpen && (
                  <div
                    className={styles.sortSelector}
                    ref={sortRef}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      className={styles.sortOption}
                      onClick={() => handleSortChange("category")}
                    >
                      <Text text={getSortLabel("category")} />
                    </div>
                    <div className={styles.sortSelectorDivider}></div>
                    <div
                      className={styles.sortOption}
                      onClick={() => handleSortChange("name")}
                    >
                      <Text text={getSortLabel("name")} />
                    </div>
                  </div>
                )}
              </div>
              {/* End of Sort */}

              {/* Content */}
              <div className={styles.contentBox}>
                {sorted.map((routine, index) => {
                  return (
                    <div
                      className={cn(styles.content, {
                        [styles.selected]: isSelected(index),
                      })}
                      key={index}
                    >
                      <div className={styles.contentPrefix}>
                        <div className={styles.contentPrefixTitle}>
                          <div className={styles.contentPrefixTitleImg}>
                            <Image
                              src={`/images/routine/${routine.category}.png`}
                              alt="루틴 카테고리 이미지"
                              fill
                              sizes="100%"
                            />
                          </div>
                          <div
                            className={styles.contentPrefixTitleDivider}
                          ></div>
                          <Text
                            text={routine.name}
                            fontWeight="bold"
                            color={Colors.black}
                          />
                        </div>
                      </div>

                      <div className={styles.contentSuffix}>
                        <Text text={routine.category} color={Colors.darkGrey} />
                        {isSelectMode && (
                          <input
                            type="checkbox"
                            className={chkbox.chkbox}
                            checked={selectedIndexes.includes(index)}
                            onChange={() => handleCheckboxClick(index)}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}

                {isSelectMode && (
                  <div
                    className={styles.shareButton}
                    onClick={handleShareClick}
                  >
                    <Text
                      text="일정 공유하기"
                      color={Colors.white}
                      fontWeight="bold"
                    />
                  </div>
                )}
              </div>
              {/* End of Content */}
            </>
          )}
        </div>
      </Card>
    );
  }
);

FavoriteRoutineCard.displayName = "FavoriteRoutineCard";
export default FavoriteRoutineCard;
