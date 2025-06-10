"use client";
import BottomNavBar from "../../shared/components/bottom-nav-bar";
import { InnerWrapper, Spacer } from "../../shared/components/layout";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";
import { memo, useCallback, useMemo, useState } from "react";
import MainTitle from "@/features/routine/components/MainTitle";
import UpperBtn from "@/features/routine/components/UpperBtn";
import EmptyRoutineCard from "@/features/routine/components/EmptyRoutineCard";
import { useProfileStore } from "@/entities/profile/store";
import { useRoutines } from "@/features/routine/hooks/useRoutines";
import LoadingOverlay from "@/shared/components/LoadingOverlay";
import RoutineCard from "@/features/routine/components/RoutineCard";
import WriteRoutineModal from "@/features/routine/components/WriteRoutineModal";
import {
  NewRoutineDto,
  UpdateRoutineDto,
  RoutineModel,
  RoutineWithContentsModel,
} from "@/entities/routine/schema";
import RoutineViewModal from "@/features/routine/components/RoutineViewerModal";

export default function Routine() {
  const router = useRouter();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isViewerModalOpen, setIsViewerModalOpen] = useState(false);
  const [selectedRoutineId, setSelectedRoutineId] = useState<
    number | undefined
  >(undefined);
  const currentProfile = useProfileStore((s) => s.currentProfile);
  const profileId = currentProfile?.id ?? "";
  // 현재 프로필 ID로 루틴 불러오기
  const {
    routines,
    isLoading,
    error,
    mutate,
    isToggling,
    getUpdatedRoutine,
    toggleFavorite,
  } = useRoutines(profileId);
  // 선택된 루틴을 상태로 관리
  const selectedRoutine = useMemo(
    () => getUpdatedRoutine(selectedRoutineId),
    [getUpdatedRoutine, selectedRoutineId]
  );

  const handleBackBtn = useCallback(() => {
    router.back();
  }, [router]);

  const handleAddClick = useCallback(() => {
    setSelectedRoutineId(undefined); // 선택된 루틴 초기화
    setIsWriteModalOpen(true);
  }, []);

  const handleUtilBtn = useCallback(() => {
    if (isEditMode) {
    } else {
    }
    setIsEditMode(!isEditMode);
  }, [isEditMode]);

  const handleFavoriteToggle = useCallback(
    async (id: number) => {
      try {
        await toggleFavorite(id);
      } catch (error) {
        alert("즐겨찾기를 변경할 수 없습니다.");
      }
    },
    [toggleFavorite]
  );

  const handleCardClick = useCallback(
    (routine: RoutineWithContentsModel) => {
      // 이제 routine은 이미 contents 배열을 포함하고 있으므로 직접 사용
      setSelectedRoutineId(routine.id);
      if (isEditMode) {
        setIsWriteModalOpen(true);
      } else {
        setIsViewerModalOpen(true);
      }
    },
    [isEditMode]
  );

  const handleAddRoutine = useCallback(async (data: NewRoutineDto) => {
    console.log("새 루틴 추가:", data);
  }, []);
  const handleEditRoutine = useCallback(async (data: UpdateRoutineDto) => {
    console.log("루틴 수정:", data);
  }, []);

  return (
    <InnerWrapper>
      {isLoading && <LoadingOverlay isLoading={isLoading} />}
      <div className={styles.container}>
        <UpperBtn
          isEditMode={isEditMode}
          onBackClick={handleBackBtn}
          onUtilClick={handleUtilBtn}
        />
        <MainTitle isEditMode={isEditMode} />
      </div>

      <div className={styles.content}>
        {/* 기존 루틴 렌더링 (추후 RoutineCard로 교체 가능) */}
        {routines.map((routine) => (
          // TODO: RoutineCard 컴포넌트로 교체
          <RoutineCard
            key={routine.id}
            routine={routine}
            isEditMode={isEditMode}
            onClick={() => handleCardClick(routine)}
            onFavoriteToggle={() => handleFavoriteToggle(routine.id)}
          />
        ))}
        {/* 전체 6개 슬롯 또는 6개 이상일 때는 끝에 하나 더 빈 카드 추가 */}
        {Array.from({
          length: routines.length < 6 ? 6 - routines.length : 1,
        }).map((_, idx) => (
          <EmptyRoutineCard key={`empty-${idx}`} onAddClick={handleAddClick} />
        ))}
      </div>
      <BottomNavBar />

      <WriteRoutineModal
        isOpen={isWriteModalOpen}
        onClose={() => {
          setIsWriteModalOpen(false);
          setSelectedRoutineId(undefined); // 모달 닫을 때 선택된 루틴도 초기화
        }}
        routine={selectedRoutine} // 여기서 선택된 루틴 전달
        onSave={handleAddRoutine}
        onEdit={handleEditRoutine}
      />

      <RoutineViewModal
        routine={selectedRoutine}
        isOpen={isViewerModalOpen}
        onClose={() => {
          setIsViewerModalOpen(false);
          setSelectedRoutineId(undefined); // 모달 닫을 때 선택된 루틴도 초기화
        }}
        toggleFavorite={handleFavoriteToggle}
        isFavorite={selectedRoutine?.isFavorite ?? false}
        isToggling={selectedRoutineId ? isToggling(selectedRoutineId) : false}
      />
    </InnerWrapper>
  );
}
