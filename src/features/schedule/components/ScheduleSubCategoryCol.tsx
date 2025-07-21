"use client";
import {
  getSubCategoriesByMain,
  MainCategory,
  SubCategory,
  mainCategoryIds,
  getSubCategoryId,
} from "@/entities/schedule/types";
import {
  NewScheduleItem,
  ScheduleWithItemsModel,
  ScheduleItemWithSubCategoryModel,
  // 생성 전용 타입
} from "@/entities/schedule/model";

import styles from "./ScheduleSubCategoryCol.module.scss";
import { memo, useMemo, useState, useEffect } from "react";
import ScheduleItemInEdit from "./ScheduleItemInEdit";
import ScheduleTimeEditModal from "./ScheduleTimeEditModal";
import { useSchedules } from "../hooks/useSchedules";
import { useProfileStore } from "@/entities/profile/store";

interface ScheduleSubCategoryColProps {
  mainCategory: MainCategory;
  modifications: Partial<
    Record<
      SubCategory,
      (ScheduleItemWithSubCategoryModel | NewScheduleItem) & {
        isFavorite?: boolean;
      }
    >
  >;
  onModify: (
    sub: SubCategory,
    updated: (ScheduleItemWithSubCategoryModel | NewScheduleItem) & {
      isFavorite?: boolean;
    }
  ) => void;
  schedule?: ScheduleWithItemsModel;
  selectedDate: Date;
}

const ScheduleSubCategoryCol = memo(
  ({
    mainCategory,
    modifications,
    onModify,
    schedule,
    selectedDate,
  }: ScheduleSubCategoryColProps) => {
    const { currentProfile } = useProfileStore();
    const { checkFavoriteSub, favoriteSub } = useSchedules();

    const items = schedule?.items ?? [];
    // 선택된 서브 카테고리 및 편집 중인 스케줄(일정 아이템)
    const [modalState, setModalState] = useState<{
      sub: SubCategory;
      schedule: ScheduleItemWithSubCategoryModel | NewScheduleItem;
    } | null>(null);

    const subs = getSubCategoriesByMain(mainCategory);

    useEffect(() => {
      if (currentProfile?.id && subs.length > 0) {
        const subIds = subs.map((sub) => getSubCategoryId(mainCategory, sub));
        checkFavoriteSub({ profileId: currentProfile.id, subIds });
      }
    }, [mainCategory, currentProfile, subs, checkFavoriteSub]);

    const dynamicMatchedMap = useMemo(() => {
      const matchedMap = items.reduce<
        Record<SubCategory, ScheduleItemWithSubCategoryModel>
      >(
        (map, item) => {
          map[item.subCategory.name as SubCategory] = item;
          return map;
        },
        {} as Record<SubCategory, ScheduleItemWithSubCategoryModel>
      );

      const dynamicMap: Record<
        SubCategory,
        ScheduleItemWithSubCategoryModel | NewScheduleItem
      > = { ...matchedMap };
      Object.entries(modifications).forEach(([sub, updated]) => {
        dynamicMap[sub as SubCategory] = updated!;
      });
      return dynamicMap;
    }, [items, modifications]);

    const orderedSubs = useMemo(() => {
      // 2) matched vs unmatched 분리 & 정렬
      const matchedSubs = subs
        .filter((sub) => Boolean(dynamicMatchedMap[sub]?.startAt))
        .sort((a, b) => {
          // nullable-safe sort: unset dates go to end
          const ta = dynamicMatchedMap[a]?.startAt
            ? new Date(dynamicMatchedMap[a].startAt).getTime()
            : Infinity;
          const tb = dynamicMatchedMap[b]?.startAt
            ? new Date(dynamicMatchedMap[b].startAt).getTime()
            : Infinity;
          return ta - tb;
        });
      const unmatchedSubs = subs
        .filter((sub) => !dynamicMatchedMap[sub]?.startAt)
        .sort((a, b) => {
          const aId = getSubCategoryId(mainCategory, a);
          const bId = getSubCategoryId(mainCategory, b);
          const isAFavorite = favoriteSub?.includes(aId) ?? false;
          const isBFavorite = favoriteSub?.includes(bId) ?? false;

          if (isAFavorite && !isBFavorite) return -1; // a가 즐겨찾기면 앞으로
          if (!isAFavorite && isBFavorite) return 1; // b가 즐겨찾기면 앞으로
          return 0; // 둘 다 같으면 순서 유지
        });

      // 3) 순서 합치기 (matched 먼저)
      return [...matchedSubs, ...unmatchedSubs];
    }, [subs, dynamicMatchedMap, favoriteSub, mainCategory]);

    // 렌더링
    return (
      <div className={styles.container}>
        {orderedSubs.map((sub) => {
          const sched = dynamicMatchedMap[sub];
          const isActive = Boolean(sched?.startAt);
          const displayDate: Date | undefined =
            sched?.startAt && typeof sched.startAt === "string"
              ? new Date(sched.startAt)
              : (sched?.startAt as Date | undefined);
          return (
            <ScheduleItemInEdit
              key={sub}
              sub={sub}
              startAt={displayDate}
              isActive={isActive}
              onClick={() => {
                // 모달 오픈: 기존 일정이 없으면 NewScheduleItem 생성
                const existing = dynamicMatchedMap[sub];
                if (existing?.startAt) {
                  // 기존 항목 수정: startAt이 문자열이면 Date 객체로 변환
                  const scheduleForModal = {
                    ...existing,
                    startAt: new Date(existing.startAt),
                  };
                  setModalState({ sub, schedule: scheduleForModal });
                } else {
                  const mainId = mainCategoryIds[mainCategory];
                  const subId = getSubCategoryId(mainCategory, sub);
                  const newItem: NewScheduleItem = {
                    startAt: selectedDate,
                    subCategory: {
                      id: subId,
                      mainId: mainId,
                      name: sub,
                      main: {
                        id: mainId,
                        name: mainCategory,
                      },
                    },
                  };
                  setModalState({ sub, schedule: newItem });
                }
              }}
            />
          );
        })}

        <ScheduleTimeEditModal
          schedule={modalState?.schedule}
          isOpen={Boolean(modalState)}
          onClose={() => setModalState(null)}
          onChangeStartAt={(next, updated) => {
            if (modalState) {
              // notify parent of modifications
              onModify(modalState.sub, updated);
            }
            setModalState(null);
          }}
        />
      </div>
    );
  }
);

ScheduleSubCategoryCol.displayName = "ScheduleSubCategoryCol";
export default ScheduleSubCategoryCol;
