"use client";
import styles from "./anniv-widget.module.scss";
import Plus from "@/shared/svgs/plus.svg";
import Cake from "@/shared/svgs/cake.svg";
import { InnerBox, Spacer } from "@/shared/components/layout";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import React from "react";
import useSWR from "swr";
import { getAnniversaryList } from "../apis";
import { AnniversaryFormData } from "@/entities/anniversary/schema";
import { useAnniversaryStore } from "@/entities/anniversary/store";

// 모달 컴포넌트 임포트
import AnnivListModal from "./modals/AnnivListModal";
import AnnivAddModal from "./modals/AnnivAddModal";
import Image from "next/image";
import {
  AnniversaryModel,
  getAnniversaryDday,
  getAnniversaryIconByType,
} from "@/entities/anniversary/model";

export default function AnnivWidget() {
  const [activeModal, setActiveModal] = React.useState<string | null>(null);
  const [editMode, setEditMode] = React.useState<boolean>(false);
  const storedCurrent = useAnniversaryStore((s) => s.currentAnniv);
  // local selection for editing
  const [selectedAnniv, setSelectedAnniv] =
    React.useState<AnniversaryModel | null>(null);

  const { data, error, isLoading, mutate } = useSWR<AnniversaryModel[]>(
    activeModal === "list" ? "/api/anniversary" : null,
    getAnniversaryList
  );

  // 신규 모드로 모달 열기
  const handleAddClick = () => {
    setEditMode(false);
    setSelectedAnniv(null);
    setActiveModal("add");
  };

  // 수정 모드로 모달 열기
  const handleEditClick = (anniv: AnniversaryModel) => {
    setEditMode(true);
    setSelectedAnniv(anniv);
    setActiveModal("add");
  };

  // 추가 제출 (id는 사용되지 않음)
  const handleAddSubmit = (data: AnniversaryFormData & { id?: number }) => {
    setActiveModal("list");
    console.log("기념일 추가", data);
    alert("기념일 추가 API 구현 필요");
    mutate();
  };

  // 수정 제출 (id 활용)
  const handleEditSubmit = (data: AnniversaryFormData & { id?: number }) => {
    setActiveModal("list");
    console.log("기념일 수정", data);
    alert(`기념일 수정 API 구현 필요`);
    mutate();
  };

  return (
    <>
      {storedCurrent ? (
        <div
          className={styles.annivContainer}
          style={
            { "--anniv-container-direction": "row" } as React.CSSProperties
          }
          onClick={() => {
            setActiveModal("list");
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
                  .toISOString()
                  .split("T")[0]
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
            setActiveModal("list");
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
        isOpen={activeModal === "list"}
        onClose={() => setActiveModal(null)}
        onAddClick={handleAddClick}
        onEditClick={handleEditClick}
        data={data}
        error={error}
        isLoading={isLoading}
      />

      {/* 기념일 추가/수정 모달 */}
      <AnnivAddModal
        isOpen={activeModal === "add"}
        editMode={editMode}
        initialData={selectedAnniv}
        onClose={() => setActiveModal(null)}
        onBackToList={() => setActiveModal("list")}
        onSubmit={editMode ? handleEditSubmit : handleAddSubmit}
      />
    </>
  );
}
