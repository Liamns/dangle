import React, { useEffect, useState } from "react";
import Modal from "@/shared/components/modals";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import Close from "@/shared/svgs/close.svg";
import Check from "@/shared/svgs/check.svg";
import EmptyAnnivIcon from "@/shared/svgs/empty-anniv-icon.svg";
import EmptySchedule from "@/shared/svgs/empty-schedule.svg";
import { InnerBox, Spacer, TextInput } from "@/shared/components/layout";
import { Button } from "@/shared/components/buttons";
import Image from "next/image";
import modalStyles from "@/shared/styles/modal.module.scss";
import styles from "../anniv-widget.module.scss";
import { AnniversaryFormData } from "@/entities/anniversary/schema";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { anniversaryFormSchema } from "@/entities/anniversary/schema";
import classNames from "classnames";
import {
  AnniversaryModel,
  getAnniversaryIconByType,
} from "@/entities/anniversary/model";
import { annivIcon } from "@/shared/types/icon";
import { COMMON_MESSAGE } from "@/shared/consts/messages";

interface AnnivAddModalProps {
  isOpen: boolean;
  editMode?: boolean;
  initialData?: AnniversaryModel | null;
  onClose: () => void;
  onBackToList: () => void;
  onDatePickerOpen: (formData: {
    content?: string;
    icon?: number;
    isDday?: boolean;
  }) => void; // 폼 데이터를 전달하는 함수로 수정
  selectedDate: Date; // 선택된 날짜 추가
  // include optional id for edit mode
  onSubmit: (data: AnniversaryFormData & { id?: number }) => void;
  onDelete?: (id: number) => void;
  tempFormData?: {
    content?: string;
    icon?: number;
    isDday?: boolean;
  } | null; // 임시 저장된 폼 데이터 추가
  isHidden?: boolean; // DatePicker 표시 시 숨김 상태
}

const AnnivAddModal: React.FC<AnnivAddModalProps> = ({
  isOpen,
  editMode = false,
  initialData = null,
  onClose,
  onBackToList,
  onDatePickerOpen, // 폼 데이터 전달 함수로 수정됨
  selectedDate, // 새로 추가된 props
  onSubmit,
  onDelete,
  tempFormData = null, // 임시 저장된 폼 데이터
  isHidden = false, // 숨김 상태 (DatePicker 표시 시)
}) => {
  const [showIconSelector, setShowIconSelector] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    reset,
    getValues,
  } = useForm<AnniversaryFormData>({
    resolver: zodResolver(anniversaryFormSchema),
    mode: "onChange",
    defaultValues: {
      content: "",
      icon: undefined,
      date: new Date(),
    },
  });

  // 모달이 열릴 때마다 폼 초기화 (추가/수정 모드 구분)
  useEffect(() => {
    if (isOpen) {
      // 날짜 선택 모달에서 돌아온 경우에는 tempFormData를 우선 사용
      if (tempFormData) {
        // 날짜 선택 모달에서 돌아온 경우: 임시 저장된 데이터 복원
        const formValues = {
          content: tempFormData.content || "",
          icon: tempFormData.icon,
          date: selectedDate,
          isDday:
            tempFormData.isDday !== undefined ? tempFormData.isDday : true,
        };
        reset(formValues);
      } else if (editMode && initialData) {
        // 수정 모드이고 임시 데이터가 없는 경우: 초기 데이터로 초기화
        reset({
          content: initialData.content,
          icon: initialData.icon,
          date: new Date(initialData.date),
        });
      } else {
        // 신규 추가 모드: 빈 상태로 초기화
        reset({
          content: "",
          icon: undefined,
          date: new Date(),
        });
      }
    }
  }, [
    isOpen,
    editMode,
    initialData,
    reset,
    tempFormData,
    selectedDate,
    isHidden,
  ]);

  // selectedDate가 변경될 때 폼 값도 업데이트 (임시 데이터나 수정 모드가 아닐 때만)
  useEffect(() => {
    // tempFormData가 있으면 실행하지 않음 (날짜 선택기에서 왔을 경우)
    if (tempFormData) {
      return;
    }

    // 수정 모드에서도 initialData가 없으면 selectedDate 사용
    if (!editMode || !initialData) {
      setValue("date", selectedDate, { shouldValidate: true });
    }
  }, [selectedDate, setValue, editMode, initialData, tempFormData]);

  const content = watch("content") || "";
  const selectedIcon = watch("icon");

  const handleIconSelect = (iconIndex: number) => {
    setValue("icon", iconIndex, { shouldValidate: true });
  };

  const formattedDate = format(selectedDate, "yyyy년 MM월 dd일", {
    locale: ko,
  });

  const handleFormSubmit = (data: AnniversaryFormData) => {
    // attach id when editing
    const payload =
      editMode && initialData ? { ...data, id: initialData.id } : data;

    onSubmit(payload);
    reset();
  };

  const isIconSelected =
    selectedIcon !== undefined && selectedIcon !== null && selectedIcon >= 0;

  const handleDelete = () => {
    if (initialData && onDelete) {
      const id = initialData.id;
      onDelete!(id);
      reset();
    } else {
      alert(COMMON_MESSAGE.WRONG_ACCESS);
      return;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}
      style={{
        backgroundColor: Colors.transparnet,
        // DatePicker가 열려있을 때는 모달을 숨김
        visibility: isHidden ? "hidden" : "visible",
      }}
    >
      <div
        className={modalStyles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={modalStyles.modalTitle}
          style={
            { "--modal-title-color": Colors.primary } as React.CSSProperties
          }
        >
          <Check />
          <Text
            text={editMode ? "기념일 수정" : "기념일 추가"}
            color={Colors.white}
            fontSize="lg"
            fontWeight="bold"
          />
          <Close
            onClick={onBackToList}
            width={10}
            height={10}
            color={Colors.background}
          />
        </div>

        <div
          className={modalStyles.modalContent}
          style={{ "--modal-content-px": "0" } as React.CSSProperties}
        >
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className={styles.annivForm}
          >
            <div className={styles.addModalSection}>
              <TextInput
                {...register("content")}
                placeholder="기념일을 입력하세요."
                maxLength={8}
                minLength={2}
                borderColor="transparent"
                borderFocusColor="transparent"
                pl="0"
                width="190"
                fontSize="md"
                suffix={`${content.length}/8`}
                suffixColor={Colors.invalid}
              />
              <div style={{ position: "relative" }}>
                <div
                  onClick={() => setShowIconSelector(!showIconSelector)}
                  className={styles.iconSelectButton}
                >
                  {!isIconSelected ? (
                    <EmptyAnnivIcon />
                  ) : (
                    <Image
                      src={getAnniversaryIconByType(selectedIcon)}
                      alt={`selected-icon-${selectedIcon}`}
                      width={32}
                      height={32}
                      style={{ objectFit: "contain" }}
                    />
                  )}
                </div>
                {showIconSelector && (
                  <div className={styles.iconSelector}>
                    {annivIcon.map((type, index) => (
                      <div
                        key={index}
                        className={classNames(styles.iconOption, {
                          [styles.selected]: selectedIcon === index,
                        })}
                        onClick={() => {
                          handleIconSelect(index);
                          setShowIconSelector(false);
                        }}
                      >
                        <Image
                          src={getAnniversaryIconByType(index)}
                          alt={`icon-${index}`}
                          width={24}
                          height={24}
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.addModalSection}>
              <div className={styles.selectedDate}>
                <Text text="날짜" color={Colors.brown} />
                <Text
                  text={formattedDate}
                  color={Colors.brown}
                  fontWeight="bold"
                  fontSize="lg"
                />
              </div>
              <div
                onClick={() => {
                  const currentData = {
                    content: content,
                    icon: selectedIcon,
                  };
                  onDatePickerOpen(currentData);
                }}
                style={{ cursor: "pointer" }}
              >
                <EmptySchedule />
              </div>
            </div>

            {/* <InnerBox px="28" direction="column" align="start">
                <Text text="날짜 계산 방식" color={Colors.brown} />
                <Spacer height="16" />
                <InnerBox
                  direction="row"
                  align="center"
                  justify="space-between"
                  px="0"
                >
                  <InnerBox direction="row" align="center" justify="start">
                    <input
                      type="radio"
                      id="isDday-true"
                      value="true"
                      onChange={() =>
                        setValue("isDday", true, { shouldValidate: true })
                      }
                      checked={isDday === true}
                    />
                    <Spacer width="8" />
                    <label htmlFor="isDday-true">
                      <Text
                        text="남은 일수 세기"
                        color={Colors.brown}
                        fontSize="md"
                        fontWeight="bold"
                      />
                    </label>
                  </InnerBox>
                  <InnerBox direction="row" align="center" justify="end">
                    <input
                      type="radio"
                      id="isDday-false"
                      value="false"
                      onChange={() =>
                        setValue("isDday", false, { shouldValidate: true })
                      }
                      checked={isDday === false}
                    />
                    <Spacer width="8" />
                    <label htmlFor="isDday-false">
                      <Text
                        text="지난 일수 세기"
                        color={Colors.brown}
                        fontSize="md"
                        fontWeight="bold"
                      />
                    </label>
                  </InnerBox>
                </InnerBox>
              </InnerBox> */}

            <Button
              width="260"
              height="37"
              fontSize="sm"
              fontWeight="bold"
              color={isValid ? Colors.primary : Colors.invalid}
              type="submit"
              disabled={!isValid}
            >
              <Text
                text={editMode ? "수정하기" : "추가하기"}
                color={isValid ? Colors.brown : Colors.white}
                fontWeight="bold"
                fontSize="md"
              />
            </Button>
            {editMode && onDelete && (
              <div className={styles.deleteBtn} onClick={handleDelete}>
                <Text
                  text="삭제하기"
                  color={Colors.grey}
                  fontWeight="bold"
                  fontSize="md"
                />
              </div>
            )}
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default AnnivAddModal;
