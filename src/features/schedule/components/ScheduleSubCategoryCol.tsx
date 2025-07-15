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
import { memo, useState } from "react";
import ScheduleItemInEdit from "./ScheduleItemInEdit";
import ScheduleTimeEditModal from "./ScheduleTimeEditModal";

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
}

const ScheduleSubCategoryCol = memo(
  ({
    mainCategory,
    modifications,
    onModify,
    schedule,
  }: ScheduleSubCategoryColProps) => {
    const items = schedule?.items ?? [];
    // 선택된 서브 카테고리 및 편집 중인 스케줄(일정 아이템)
    const [modalState, setModalState] = useState<{
      sub: SubCategory;
      schedule: ScheduleItemWithSubCategoryModel | NewScheduleItem;
    } | null>(null);

    const subs = getSubCategoriesByMain(mainCategory);
    // TODO : 즐겨찾기 여부 찾아서 있으면 맨 위로

    // 1) sub ↔ scheduleItem 매핑
    const matchedMap = items.reduce<
      Record<SubCategory, ScheduleItemWithSubCategoryModel>
    >(
      (map, item) => {
        map[item.subCategory.name as SubCategory] = item;
        return map;
      },
      {} as Record<SubCategory, ScheduleItemWithSubCategoryModel>
    );

    // 1-1) dynamic map: 수정된 시간 overlay
    const dynamicMatchedMap: Record<
      SubCategory,
      ScheduleItemWithSubCategoryModel | NewScheduleItem
    > = { ...matchedMap };
    // modification overlay: replace with full updated schedule object from props
    Object.entries(modifications).forEach(([sub, updated]) => {
      dynamicMatchedMap[sub as SubCategory] = updated!;
    });

    // 2) matched vs unmatched 분리 & 정렬
    const matchedSubs = subs
      .filter((sub) => Boolean(dynamicMatchedMap[sub]?.startAt))
      .sort((a, b) => {
        // nullable-safe sort: unset dates go to end
        const ta = dynamicMatchedMap[a].startAt?.getTime() ?? Infinity;
        const tb = dynamicMatchedMap[b].startAt?.getTime() ?? Infinity;
        return ta - tb;
      });
    const unmatchedSubs = subs.filter(
      (sub) => !dynamicMatchedMap[sub]?.startAt
    );

    // 3) 순서 합치기 (matched 먼저)
    const orderedSubs = [...matchedSubs, ...unmatchedSubs];

    // 렌더링
    return (
      <div className={styles.container}>
        {orderedSubs.map((sub) => {
          const sched = dynamicMatchedMap[sub];
          const isActive = Boolean(sched?.startAt);
          const displayDate: Date | undefined = sched?.startAt ?? undefined;
          return (
            <ScheduleItemInEdit
              key={sub}
              sub={sub}
              startAt={displayDate}
              isActive={isActive}
              onClick={() => {
                // 모달 오픈: 기존 일정이 없으면 NewScheduleItem 생성
                const existing = dynamicMatchedMap[sub];
                if (existing) {
                  setModalState({ sub, schedule: existing });
                } else {
                  const mainId = mainCategoryIds[mainCategory];
                  const subId = getSubCategoryId(mainCategory, sub);
                  const newItem: NewScheduleItem = {
                    startAt: undefined,
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
