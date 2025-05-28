"use client";
import BottomNavBar from "../../shared/components/bottom-nav-bar";
import { InnerWrapper, Spacer } from "../../shared/components/layout";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";
import { memo, useCallback, useState } from "react";
import MainTitle from "@/features/routine/components/MainTitle";
import UpperBtn from "@/features/routine/components/UpperBtn";
import EmptyRoutineCard from "@/features/routine/components/EmptyRoutineCard";
import { useProfileStore } from "@/entities/profile/store";
import { useRoutines } from "@/features/routine/hooks/useRoutines";
import LoadingOverlay from "@/shared/components/LoadingOverlay";
import RoutineCard from "@/features/routine/components/RoutineCard";
import WriteRoutineModal from "@/features/routine/components/WriteRoutineModal";
import { NewRoutineDto, UpdateRoutineDto } from "@/entities/routine/schema";

export default function Routine() {
  const router = useRouter();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  // 현재 프로필 ID로 루틴 불러오기
  const currentProfile = useProfileStore((s) => s.currentProfile);
  const profileId = currentProfile?.id ?? "";
  const { routines, isLoading, error } = useRoutines(profileId);

  const handleBackBtn = useCallback(() => {
    router.back();
  }, [router]);

  const handleAddClick = useCallback(() => {
    setIsWriteModalOpen(true);
  }, []);

  const handleUtilBtn = useCallback(() => {
    if (isEditMode) {
    } else {
    }
    setIsEditMode(!isEditMode);
  }, [isEditMode]);

  const handleFavoriteToggle = useCallback(
    (id: number) => {
      if (!profileId) return;
      alert("즐겨찾기 토글");
      console.log("Toggle favorite for routine ID:", id);
      console.log("Current profile ID:", profileId);
    },
    [profileId]
  );

  const handleAddRoutine = useCallback(async (data: NewRoutineDto) => {}, []);
  const handleEditRoutine = useCallback(async (data: UpdateRoutineDto) => {},
  []);

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
            onClick={() => {}}
            onFavoriteToggle={handleFavoriteToggle}
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
        onClose={() => setIsWriteModalOpen(false)}
        onSave={handleAddRoutine}
        onEdit={handleEditRoutine}
      />
    </InnerWrapper>
  );
}
