"use client";
import {
  mainCategories,
  MainCategory,
  SubCategory,
  getSubCategoriesByMain,
  mainCategoryIds,
  getSubCategoryId,
} from "@/entities/schedule/types";
import { memo, useCallback, useState } from "react";
import styles from "./ScheduleAddBox.module.scss";
import cn from "classnames";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import ScheduleMainCategoryRow from "./ScheduleMainCategoryRow";
import ScheduleSubCategoryCol from "./ScheduleSubCategoryCol";
import ScheduleEditConfirmBtns from "./ScheduleEditConfirmBtns";
import {
  NewScheduleItem,
  ScheduleItemWithContentModel,
} from "@/entities/schedule/model";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/entities/profile/store";
import { useScheduleByDate } from "../hooks/useScheduleByDate";
import LoadingOverlay from "@/shared/components/LoadingOverlay";

interface ScheduleAddBoxProps {
  selectedDate: Date;
}

const ScheduleAddBox = memo(({ selectedDate }: ScheduleAddBoxProps) => {
  const currentProfile = useProfileStore((s) => s.currentProfile);
  const profileId = currentProfile?.id ?? "";
  const {
    data: schedule,
    error,
    isLoading,
  } = useScheduleByDate(profileId, selectedDate);
  const router = useRouter();
  const [selectedMain, setSelectedMain] = useState<MainCategory>(
    mainCategories[0]
  );
  const [modifications, setModifications] = useState<
    Partial<
      Record<
        SubCategory,
        (ScheduleItemWithContentModel | NewScheduleItem) & {
          isFavorite?: boolean;
        }
      >
    >
  >({});

  const handleMainSelect = useCallback((category: MainCategory) => {
    setSelectedMain(category);
  }, []);

  const handleModify = useCallback(
    (
      sub: SubCategory,
      updated: (ScheduleItemWithContentModel | NewScheduleItem) & {
        isFavorite?: boolean;
      }
    ) => {
      setModifications((prev) => ({ ...prev, [sub]: updated }));
    },
    []
  );

  const handleConfirm = useCallback(() => {
    // TODO: integrate persistence API
    alert("수정사항 서버에 반영 후 mutate 호출");
    console.log("Confirm modifications:", modifications);
    router.back(); // navigate back to the previous page
  }, [modifications]);

  const handleDelete = useCallback(() => {
    // 현재 선택된 메인 카테고리의 서브카테고리들에 대해 "삭제" 마킹
    const subs = getSubCategoriesByMain(selectedMain);

    const deletedModifications = subs.reduce((acc, subCategory) => {
      // 필수 필드를 포함한 최소한의 객체를 생성하고 startAt을 null로 설정
      const mainId = mainCategoryIds[selectedMain];
      const subId = getSubCategoryId(selectedMain, subCategory);

      acc[subCategory] = {
        startAt: null,
        content: {
          mainId,
          subId,
          description: null,
          main: { id: mainId, name: selectedMain },
          sub: { id: subId, name: subCategory, mainId },
        },
      } as NewScheduleItem;

      return acc;
    }, {} as Record<SubCategory, (ScheduleItemWithContentModel | NewScheduleItem) & { isFavorite?: boolean }>);

    setModifications((prev) => ({
      ...prev,
      ...deletedModifications,
    }));
  }, [selectedMain]);

  if (isLoading) return <LoadingOverlay isLoading={isLoading} />;

  return (
    <div className={styles.container}>
      <ScheduleMainCategoryRow
        selected={selectedMain}
        onSelect={handleMainSelect}
      />

      <ScheduleSubCategoryCol
        mainCategory={selectedMain}
        modifications={modifications}
        onModify={handleModify}
        schedule={schedule}
      />

      <ScheduleEditConfirmBtns
        onConfirm={handleConfirm}
        onDelete={handleDelete}
      />
    </div>
  );
});

ScheduleAddBox.displayName = "ScheduleAddBox";
export default ScheduleAddBox;
