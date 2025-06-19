"use client";

import styles from "./FavoriteScheduleCard.module.scss";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/shared/components/layout";
import { FavoriteItem } from "../hooks/useFavorites";
import { ScheduleModel } from "@/entities/schedule/model";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import SortSvg from "@/shared/svgs/sort.svg";
import EmptyFavorites from "./EmptyFavorites";
import Image from "next/image";
import EditSvg from "@/shared/svgs/edit.svg";
import DeleteSvg from "@/shared/svgs/delete.svg"; // 삭제 아이콘 추가
import { transformToDateFormat } from "@/shared/lib/date";
import { format } from "date-fns";
import RegisterFavoriteScheduleModal from "@/features/schedule/components/RegisterFavoriteScheduleModal";
import chkbox from "@/shared/styles/buttons.module.scss";
import cn from "classnames";
import { getFavoriteScheduleIconByType } from "@/entities/schedule/utils";

interface FavoriteScheduleCardProps {
  favorites: ScheduleModel[];
  onEmptyClick: () => void;
  isSelectMode: boolean;
  onShareClick: (data: FavoriteItem[]) => void;
}

const FavoriteScheduleCard = memo(
  ({
    favorites,
    onEmptyClick,
    isSelectMode,
    onShareClick,
  }: FavoriteScheduleCardProps) => {
    const [isSortOpen, setIsSortOpen] = useState(false);
    const sortRef = useRef<HTMLDivElement>(null);

    // 활성화된 아이템 관리를 위한 상태 (index 기반으로 변경)
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null); // 편집 중인 아이템 인덱스
    const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
    const [animationClasses, setAnimationClasses] = useState<{
      [key: number]: string;
    }>({});
    const isMountedRef = useRef<{ [key: number]: boolean }>({});
    const wasActiveRef = useRef<{ [key: number]: boolean }>({});

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
    const [sortType, setSortType] = useState<"date" | "alias">("date");
    const handleSortChange = (type: "date" | "alias") => {
      setSortType(type);
      setIsSortOpen(false);
    };
    const getSortLabel = (type: "date" | "alias") => {
      return type === "date" ? "최근 등록순" : "별칭순";
    };
    const sortLabel = useMemo(() => getSortLabel(sortType), [sortType]);

    const sorted = useMemo(() => {
      const sort: ScheduleModel[] = [...favorites];

      return sort.sort((a, b) => {
        if (sortType === "date") {
          return (
            (b.addedAt ? new Date(b.addedAt).getTime() : 0) -
            (a.addedAt ? new Date(a.addedAt).getTime() : 0)
          );
        } else {
          return (a.alias ?? "").localeCompare(b.alias ?? "");
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

    // 애니메이션 클래스 관리를 위한 useEffect
    useEffect(() => {
      sorted.forEach((item, idx) => {
        const isActive = activeIndex === idx;

        // 초기 마운트 시 설정
        if (!isMountedRef.current[idx]) {
          isMountedRef.current[idx] = true;
          if (isActive) {
            setAnimationClasses((prev) => ({
              ...prev,
              [idx]: "active",
            }));
          }
        }
        // 활성 상태 변경 시 애니메이션 설정
        else {
          if (isActive) {
            setAnimationClasses((prev) => ({
              ...prev,
              [idx]: "active",
            }));
          } else if (wasActiveRef.current[idx]) {
            setAnimationClasses((prev) => ({
              ...prev,
              [idx]: "inactive",
            }));
          }
        }

        wasActiveRef.current[idx] = isActive;
      });
    }, [activeIndex, sorted]);

    // 아이템 활성화 토글 함수
    const handleActivateItem = (idx: number) => {
      setActiveIndex((prev) => (prev === idx ? null : idx));
    };

    // 애니메이션 종료 핸들러
    const handleAnimationEnd = (
      e: React.AnimationEvent<HTMLDivElement>,
      index: number
    ) => {
      if (
        e.animationName.includes("hide-buttons") &&
        animationClasses[index] === "inactive"
      ) {
        setAnimationClasses((prev) => ({
          ...prev,
          [index]: "",
        }));
      }
    };

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const handleEditModalSave = useCallback(
      (id: number, alias: string, icon: number) => {
        if (editingIndex !== null) {
          const itemToUpdate = sorted[editingIndex];
          // API 호출 등 업데이트 로직
          console.log(`Updating item: ${itemToUpdate}`, alias, icon, id);
          setIsEditModalOpen(false);
          setEditingIndex(null);
        }
      },
      [editingIndex, sorted]
    );

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
        alert("공유할 일정을 선택해주세요.");
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
            <EmptyFavorites
              activeTab={"schedule"}
              onEmptyClick={onEmptyClick}
            />
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
                      onClick={() => handleSortChange("date")}
                    >
                      <Text text={getSortLabel("date")} />
                    </div>
                    <div className={styles.sortSelectorDivider}></div>
                    <div
                      className={styles.sortOption}
                      onClick={() => handleSortChange("alias")}
                    >
                      <Text text={getSortLabel("alias")} />
                    </div>
                  </div>
                )}
              </div>
              {/* End of Sort */}

              {/* Content */}
              <div className={styles.contentBox}>
                {sorted.map((item, index) => {
                  const isActive = activeIndex === index;
                  const animationClass = animationClasses[index] || "";

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
                              src={getFavoriteScheduleIconByType(
                                item.icon ?? 0
                              )}
                              alt="일정 즐겨찾기 아이콘"
                              fill
                              sizes="100%"
                            />
                          </div>
                          <div
                            className={styles.contentPrefixTitleDivider}
                          ></div>
                          <Text
                            text={item.alias ?? ""}
                            color={Colors.black}
                            fontWeight="bold"
                          />
                        </div>
                        <Text
                          text={
                            transformToDateFormat(
                              format(item.addedAt ?? new Date(), "yyyyMMdd"),
                              "."
                            ) || ""
                          }
                          color={Colors.darkGrey}
                        />
                      </div>

                      <div className={styles.contentSuffix}>
                        {isSelectMode ? (
                          <input
                            type="checkbox"
                            className={chkbox.chkbox}
                            checked={selectedIndexes.includes(index)}
                            onChange={() => handleCheckboxClick(index)}
                          />
                        ) : (
                          <EditSvg
                            className={styles.contentSuffixSvg}
                            onClick={() => handleActivateItem(index)}
                          />
                        )}
                      </div>

                      {/* 버튼 컨테이너 */}
                      <div
                        className={`${styles.buttonContainer} ${
                          animationClass ? styles[animationClass] : ""
                        }`}
                        onAnimationEnd={(e) => handleAnimationEnd(e, index)}
                      >
                        <div
                          className={styles.deleteButton}
                          onClick={() => {
                            alert(`${item.alias} 삭제`);
                            setActiveIndex(null);
                          }}
                        >
                          <DeleteSvg
                            width={14}
                            height={14}
                            color={Colors.brown}
                          />
                        </div>
                        <div
                          className={styles.editButton}
                          onClick={() => {
                            setEditingIndex(index); // 현재 아이템 인덱스 저장
                            setIsEditModalOpen(true);
                            setActiveIndex(null);
                          }}
                        >
                          <EditSvg
                            width={14}
                            height={14}
                            color={Colors.white}
                          />
                        </div>
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

              {/* Edit Modal */}
              {sorted.length > 0 && (
                <RegisterFavoriteScheduleModal
                  isOpen={isEditModalOpen}
                  onClose={() => {
                    setIsEditModalOpen(false);
                    setEditingIndex(null); // 모달 닫을 때 편집 인덱스도 초기화
                  }}
                  onEdit={handleEditModalSave}
                  favorite={
                    editingIndex !== null && editingIndex < sorted.length
                      ? sorted[editingIndex]
                      : undefined
                  }
                  onRegister={() => {}}
                />
              )}
              {/* End of Edit Modal */}
            </>
          )}
        </div>
      </Card>
    );
  }
);

FavoriteScheduleCard.displayName = "FavoriteScheduleCard";
export default FavoriteScheduleCard;
