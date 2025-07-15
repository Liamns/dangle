"use client";
import React, { useState } from "react";
import Modal from "@/shared/components/modals";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import Close from "@/shared/svgs/close.svg";
import EditIcon from "@/shared/svgs/edit.svg";
import Plus from "@/shared/svgs/plus.svg";
import { Button } from "@/shared/components/buttons";
import Image from "next/image";
import imgStyles from "@/shared/styles/images.module.scss";
import modalStyles from "@/shared/styles/modal.module.scss";
import styles from "../anniv-widget.module.scss";
import { InnerBox, Spacer } from "@/shared/components/layout";
import { useAnniversaryStore } from "@/entities/anniversary/store";
import {
  AnniversaryModel,
  getAnniversaryDday,
  getAnniversaryIconByType,
} from "@/entities/anniversary/model";
import LoadingOverlay from "@/shared/components/LoadingOverlay";

interface AnnivListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClick: () => void;
  onEditClick: (anniv: AnniversaryModel) => void;
  data?: AnniversaryModel[];
  error?: Error;
  isLoading: boolean;
}

const AnnivListModal: React.FC<AnnivListModalProps> = ({
  isOpen,
  onClose,
  onAddClick,
  onEditClick,
  data,
  error,
  isLoading,
}) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { setCurrentAnniv } = useAnniversaryStore();
  const isActionDisabled =
    isLoading || (!error && data && data.length > 0 && selectedId === null);

  // 홈 위젯에 표시할 현재 기념일 등록 함수
  const handleRegister = () => {
    if (selectedId !== null && data) {
      const anniv = data.find((a) => a.id === selectedId);
      if (anniv) setCurrentAnniv(anniv);
    }
    onClose();
  };

  const handleAnnivClick = (id: number) => {
    setSelectedId((prevId) => (prevId === id ? null : id));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      style={{ backgroundColor: Colors.transparnet }}
    >
      <div
        className={modalStyles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={modalStyles.modalTitle}>
          <Close style={{ opacity: 0 }} width={8} height={8} />
          <Text
            text="기념일 목록"
            color={Colors.white}
            fontSize="lg"
            fontWeight="bold"
          />
          <Close onClick={onClose} color={Colors.white} width={8} height={8} />
        </div>

        <div className={modalStyles.modalContent}>
          {isLoading ? (
            <LoadingOverlay isLoading={isLoading} />
          ) : error || !data || data.length === 0 ? (
            <div className={imgStyles.square}>
              <Image
                src={`/images/shared/${
                  isLoading ? "loading" : error ? "error" : "empty"
                }.png`}
                alt="빈 기념일 목록"
                fill
                sizes="100%"
                objectFit="contain"
              />
            </div>
          ) : (
            <div className={styles.annivListContainer}>
              {data.map((anniversary) => (
                <div
                  key={anniversary.id}
                  className={`${styles.annivItem} ${
                    selectedId === anniversary.id ? styles.selected : ""
                  }`}
                  onClick={() => handleAnnivClick(anniversary.id)}
                >
                  <div className={styles.annivTitle}>
                    <div className={styles.annivIconContainer}>
                      <Image
                        src={getAnniversaryIconByType(anniversary.icon)}
                        alt="기념일 아이콘"
                        width={40}
                        height={40}
                      />
                    </div>
                    <Text
                      text={getAnniversaryDday(anniversary.date)}
                      color={Colors.brown}
                      fontSize="lg"
                      fontWeight="bold"
                    />
                  </div>
                  <div className={styles.annivDetails}>
                    <Text text={anniversary.content} color={Colors.brown} />
                    <Text
                      text={new Date(anniversary.date)
                        .toLocaleString()
                        .split("오")[0]
                        .replace(/-/g, ".")}
                      color={Colors.brown}
                    />
                  </div>
                  {selectedId === anniversary.id && (
                    <div
                      className={styles.editButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditClick(anniversary);
                      }}
                    >
                      <EditIcon color={Colors.brown} width={12} height={12} />
                    </div>
                  )}
                </div>
              ))}
              <div
                onClick={(e) => {
                  e.stopPropagation(); // 이벤트 전파 방지
                  console.log("AnnivListModal ▶ onAddClick fired");
                  onAddClick();
                }}
              >
                <InnerBox
                  direction="row"
                  align="center"
                  justify="center"
                  py="10"
                  style={{
                    borderRadius: "10px",
                    border: "1px solid var(--invalid)",
                  }}
                >
                  <Text text="기념일 추가" color={Colors.invalid} />
                  <Spacer width="6" />
                  <Plus color={Colors.invalid} />
                </InnerBox>
              </div>
            </div>
          )}

          <Button
            width="260"
            height="37"
            fontSize="sm"
            fontWeight="bold"
            color={isActionDisabled ? Colors.invalid : Colors.primary}
            mt="12"
            disabled={isActionDisabled}
            onClick={() =>
              error
                ? location.reload()
                : !data || data.length === 0
                  ? onAddClick()
                  : handleRegister()
            }
          >
            <Text
              text={
                isLoading
                  ? "불러오는 중"
                  : error
                    ? "다시 시도하기"
                    : data?.length === 0
                      ? `기념일 추가하기`
                      : `등록하기`
              }
              color={isActionDisabled ? Colors.white : Colors.brown}
              fontWeight="bold"
            />
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AnnivListModal;
