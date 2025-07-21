"use client";
import {
  mainCategories,
  MainCategory,
  SubCategory,
  getSubCategoriesByMain,
} from "@/entities/schedule/types";
import { memo, useCallback, useEffect, useState } from "react";
import styles from "./ScheduleAddBox.module.scss";
import ScheduleMainCategoryRow from "./ScheduleMainCategoryRow";
import ScheduleSubCategoryCol from "./ScheduleSubCategoryCol";
import ScheduleEditConfirmBtns from "./ScheduleEditConfirmBtns";
import {
  NewScheduleItem,
  ScheduleItemWithSubCategoryModel,
} from "@/entities/schedule/model";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/entities/profile/store";
import LoadingOverlay from "@/shared/components/LoadingOverlay";
import { useSchedules } from "../hooks/useSchedules";
import { useScheduleStore } from "@/entities/schedule/store";
import { COMMON_MESSAGE } from "@/shared/consts/messages";

interface ScheduleAddBoxProps {
  selectedDate: Date;
}

const ScheduleAddBox = memo(({ selectedDate }: ScheduleAddBoxProps) => {
  const { currentProfile, _hasHydrated } = useProfileStore();
  const router = useRouter();
  const [selectedMain, setSelectedMain] = useState<MainCategory>(
    mainCategories[0]
  );
  const [modifications, setModifications] = useState<
    Partial<
      Record<
        SubCategory,
        (ScheduleItemWithSubCategoryModel | NewScheduleItem) & {
          isFavorite?: boolean;
        }
      >
    >
  >({});

  useEffect(() => {
    if (_hasHydrated && currentProfile === null) {
      alert(COMMON_MESSAGE.WRONG_ACCESS);
      router.replace("/home");
    }
  }, [currentProfile, _hasHydrated]);

  const {
    addSchedule,
    addError,
    schedule,
    revalidateSchedule,
    isProcessing: isLoading,
    fetchError: error,
  } = useSchedules(selectedDate.toLocaleDateString("en-CA"));

  useEffect(() => {
    revalidateSchedule();
  }, [selectedDate]);

  const handleMainSelect = useCallback((category: MainCategory) => {
    setSelectedMain(category);
  }, []);

  const handleModify = useCallback(
    (
      sub: SubCategory,
      updated: (ScheduleItemWithSubCategoryModel | NewScheduleItem) & {
        isFavorite?: boolean;
      }
    ) => {
      setModifications((prev) => ({
        ...prev,
        [sub]: { ...updated },
      }));
    },
    []
  );

  const handleConfirm = useCallback(async () => {
    // TODO: integrate persistence API
    await addSchedule({
      inputData: modifications,
      date: selectedDate,
      profileId: currentProfile!.id,
    });
    revalidateSchedule();
    router.replace("/schedule");
  }, [modifications]);

  const handleDelete = useCallback(() => {
    // 현재 선택된 메인 카테고리의 서브카테고리들에 대해 "삭제" 마킹
    const subs = getSubCategoriesByMain(selectedMain);

    const deletedModifications = subs.reduce(
      (acc, subCategory) => {
        acc[subCategory] = {
          startAt: null,
          subCategory: {},
        } as NewScheduleItem & { isFavorite?: boolean };

        return acc;
      },
      {} as Record<
        SubCategory,
        (ScheduleItemWithSubCategoryModel | NewScheduleItem) & {
          isFavorite?: boolean;
        }
      >
    );

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
        selectedDate={selectedDate}
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
