"use client";
import styles from "./anniv-widget.module.scss";
import Plus from "@/shared/svgs/plus.svg";
import Cake from "@/shared/svgs/cake.svg";
import { InnerBox, Spacer } from "@/shared/components/layout";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import React, { useEffect } from "react";
import useSWR from "swr";
import { getAnniversaryList } from "../apis";
import { AnniversaryFormData } from "@/entities/anniversary/schema";
import { useAnniversaryStore } from "@/entities/anniversary/store";

// 모달 컴포넌트 임포트
import AnnivListModal from "./modals/AnnivListModal";
import AnnivAddModal from "./modals/AnnivAddModal";
import DatePickerModal from "@/shared/components/DatePickerModal";
import Image from "next/image";
import {
  AnniversaryModel,
  getAnniversaryDday,
  getAnniversaryIconByType,
} from "@/entities/anniversary/model";
import { useAnniversaries } from "../hooks/useAnniversaries";
import { useUserStore } from "@/entities/user/store";
import { COMMON_MESSAGE } from "@/shared/consts/messages";
import { ANNIV_ERROR_MESSAGE } from "../consts";

export default function AnnivWidget() {
  const [showListModal, setShowListModal] = React.useState<boolean>(false);
  const [showAddModal, setShowAddModal] = React.useState<boolean>(false);
  const [showDatePickerModal, setShowDatePickerModal] =
    React.useState<boolean>(false);
  const [editMode, setEditMode] = React.useState<boolean>(false);
  const storedCurrent = useAnniversaryStore((s) => s.currentAnniv);
  // local selection for editing
  const [selectedAnniv, setSelectedAnniv] =
    React.useState<AnniversaryModel | null>(null);
  // 날짜 선택기를 위한 상태
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  // DatePickerModal 열기 전 폼 데이터 임시 저장
  const [tempFormData, setTempFormData] = React.useState<{
    content?: string;
    icon?: number;
    isDday?: boolean;
  } | null>(null);

  // 새로운 상태: AnnivAddModal이 "숨겨진" 상태인지 표시
  // (실제로 닫히지 않고 DatePicker 뒤에 남아있음)
  const [isAddModalHidden, setIsAddModalHidden] =
    React.useState<boolean>(false);

  const userId = useUserStore((state) => state.currentUser?.id);

  const { annivs: data } = useAnniversaryStore();

  const {
    fetchError: error,
    isProcessing: isLoading,
    revalidateAnniv: mutate,
    registerAnniv,
    registerError,
    updateAnniv,
    updateError,
  } = useAnniversaries();

  // 신규 모드로 모달 열기
  const handleAddClick = () => {
    setEditMode(false);
    setSelectedAnniv(null);
    setShowListModal(false); // 목록 모달 닫기

    // 약간의 지연 후 추가 모달 열기
    setTimeout(() => {
      setShowAddModal(true);
    }, 100);
  };

  // 수정 모드로 모달 열기
  const handleEditClick = (anniv: AnniversaryModel) => {
    setEditMode(true);
    setSelectedAnniv(anniv);
    // 수정할 기념일의 날짜로 selectedDate를 업데이트
    setSelectedDate(new Date(anniv.date));
    setShowListModal(false); // 목록 모달 닫기

    // 약간의 지연 후 추가 모달 열기
    setTimeout(() => {
      setShowAddModal(true);
    }, 100);
  };

  const handleSubmit = async (
    data: AnniversaryFormData & { id?: number; userId?: string }
  ) => {
    if (!userId) {
      alert(COMMON_MESSAGE.WRONG_ACCESS);
      return;
    }
    try {
      data = { ...data, userId: userId };
      if (editMode) {
        if (!data.id) {
          alert(COMMON_MESSAGE.WRONG_ACCESS);
          return;
        }
        await updateAnniv({ inputData: { ...data, id: data.id } });
      } else {
        await registerAnniv({ inputData: data });
      }

      setShowAddModal(false);
      // 폼 제출 시 임시 데이터 초기화
      setTempFormData(null);
      mutate();

      setTimeout(() => {
        setShowListModal(true);
      }, 100);
    } catch (e: any) {
      console.warn(e);
      console.log(updateError);
    }
  };

  // 날짜 선택 핸들러
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      // DatePicker 닫기
      setShowDatePickerModal(false);
      // AddModal 다시 표시 (숨김 상태 해제)
      setIsAddModalHidden(false);
    }
  };

  // 임시 폼 데이터 관리 (DatePickerModal 사용 시)
  useEffect(() => {
    // tempFormData 관리 로직
  }, [tempFormData]);

  return (
    <>
      {storedCurrent ? (
        <div
          className={styles.annivContainer}
          style={
            { "--anniv-container-direction": "row" } as React.CSSProperties
          }
          onClick={() => {
            setShowListModal(true);
            mutate();
          }}
        >
          <InnerBox
            direction="row"
            align="center"
            justify="space-between"
            px="20"
          >
            <div className={styles.annivTitle}>
              <div className={styles.annivIconContainer}>
                <Image
                  src={getAnniversaryIconByType(storedCurrent.icon)}
                  alt="기념일 아이콘"
                  width={40}
                  height={40}
                />
              </div>
              <Text
                text={getAnniversaryDday(storedCurrent.date)}
                color={Colors.brown}
                fontSize="lg"
                fontWeight="bold"
              />
            </div>
            <div className={styles.annivDetails}>
              <Text text={storedCurrent.content} color={Colors.brown} />
              <Text
                text={new Date(storedCurrent.date)
                  .toLocaleString()
                  .split("오")[0]
                  .replace(/-/g, ".")}
                color={Colors.brown}
              />
            </div>
          </InnerBox>
        </div>
      ) : (
        <div
          className={styles.annivContainer}
          onClick={() => {
            setShowListModal(true);
            mutate();
          }}
        >
          <Plus />
          <Spacer height="8" />
          <InnerBox direction="row" align="start">
            <Cake />
            <Spacer width="4" />
            <Text text="기념일 추가" color={Colors.brown} />
          </InnerBox>
        </div>
      )}

      {/* 기념일 목록 모달 */}
      <AnnivListModal
        isOpen={showListModal}
        onClose={() => setShowListModal(false)}
        onAddClick={handleAddClick}
        onEditClick={handleEditClick}
        data={data}
        error={error}
        isLoading={isLoading}
      />

      {/* 기념일 추가/수정 모달 */}
      <AnnivAddModal
        isOpen={showAddModal}
        editMode={editMode}
        initialData={selectedAnniv}
        onClose={() => setShowAddModal(false)}
        onBackToList={() => {
          setShowAddModal(false);
          setTimeout(() => setShowListModal(true), 100);
        }}
        onSubmit={handleSubmit}
        onDatePickerOpen={(formData) => {
          // 현재 폼 데이터 임시 저장
          setTempFormData(formData);
          // AnnivAddModal을 실제로 닫지 않고, 숨김 상태로 변경
          setIsAddModalHidden(true);
          // DatePickerModal 열기
          setShowDatePickerModal(true);
        }}
        selectedDate={selectedDate}
        tempFormData={tempFormData}
        // 숨김 상태 전달
        isHidden={isAddModalHidden}
      />

      {/* 날짜 선택 모달 - AnnivWidget에서 관리 */}
      <DatePickerModal
        isOpen={showDatePickerModal}
        onClose={() => {
          // DatePicker 닫기
          setShowDatePickerModal(false);
          // 기존 AddModal을 다시 표시
          setIsAddModalHidden(false);
        }}
        onBack={() => {
          // DatePicker 닫기
          setShowDatePickerModal(false);
          // 기존 AddModal을 다시 표시
          setIsAddModalHidden(false);
        }}
        title="날짜 선택"
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
      />
    </>
  );
}
