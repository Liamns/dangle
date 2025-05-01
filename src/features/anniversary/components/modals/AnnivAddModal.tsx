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
import {
  AnniversaryFormData,
  AnniversaryModel,
} from "@/entities/anniversary/schema";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { anniversaryFormSchema } from "@/entities/anniversary/schema";
import classNames from "classnames";
import DatePickerModal from "@/shared/components/DatePickerModal";

interface AnnivAddModalProps {
  isOpen: boolean;
  editMode?: boolean;
  initialData?: AnniversaryModel | null;
  onClose: () => void;
  onBackToList: () => void;
  // include optional id for edit mode
  onSubmit: (data: AnniversaryFormData & { id?: number }) => void;
}

const AnnivAddModal: React.FC<AnnivAddModalProps> = ({
  isOpen,
  editMode = false,
  initialData = null,
  onClose,
  onBackToList,
  onSubmit,
}) => {
  const [showIconSelector, setShowIconSelector] = useState<boolean>(false);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const iconTypes = ["cake", "gift", "conical"];
  const iconBasePath = "/images/home/anniversary";

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
      isDday: true,
    },
  });

  // 모달이 열릴 때마다 폼 초기화 (추가/수정 모드 구분)
  useEffect(() => {
    if (isOpen) {
      if (editMode && initialData) {
        reset({
          content: initialData.content,
          icon: initialData.icon,
          date: new Date(initialData.date),
          isDday: initialData.isDday,
        });
      } else {
        reset({
          content: "",
          icon: undefined,
          date: new Date(),
          isDday: true,
        });
      }
    }
  }, [isOpen, editMode, initialData, reset]);

  const content = watch("content") || "";
  const selectedIcon = watch("icon");
  const selectedDate = watch("date");
  const isDday = watch("isDday");

  const handleIconSelect = (iconIndex: number) => {
    setValue("icon", iconIndex, { shouldValidate: true });
  };

  // 날짜 선택 핸들러
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const currentValues = getValues();
      setValue("date", date, { shouldValidate: true });
      if (currentValues.isDday !== undefined) {
        setValue("isDday", currentValues.isDday, { shouldValidate: true });
      } else {
        setValue("isDday", true, { shouldValidate: true });
      }
      setShowDatePicker(false);
    }
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

  const isIconSelected = selectedIcon !== undefined && selectedIcon !== null;

  return (
    <>
      <Modal
        isOpen={isOpen && !showDatePicker}
        onClose={onClose}
        style={{ backgroundColor: Colors.transparnet }}
      >
        <div className={modalStyles.modalContainer}>
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
            <Close onClick={onBackToList} />
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
                        src={`${iconBasePath}/${iconTypes[selectedIcon]}.png`}
                        alt={`selected-icon-${selectedIcon}`}
                        width={32}
                        height={32}
                        style={{ objectFit: "contain" }}
                      />
                    )}
                  </div>
                  {showIconSelector && (
                    <div className={styles.iconSelector}>
                      {iconTypes.map((type, index) => (
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
                            src={`${iconBasePath}/${type}.png`}
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
                  onClick={() => setShowDatePicker(true)}
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
            </form>
          </div>
        </div>
      </Modal>

      {/* 날짜 선택 모달 - AnnivAddModal 내부에서 직접 관리 */}
      <DatePickerModal
        isOpen={isOpen && showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onBack={() => setShowDatePicker(false)}
        title="날짜 선택"
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
      />
    </>
  );
};

export default AnnivAddModal;
