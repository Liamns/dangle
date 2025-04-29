"use client";
import styles from "./anniv-widget.module.scss";
import imgStyles from "@/shared/styles/images.module.scss";
import layoutStyles from "@/shared/styles/layout.module.scss";
import Plus from "@/shared/svgs/plus.svg";
import Cake from "@/shared/svgs/cake.svg";
import Close from "@/shared/svgs/close.svg";
import Check from "@/shared/svgs/check.svg";
import EmptyAnnivIcon from "@/shared/svgs/empty-anniv-icon.svg";
import EmptySchedule from "@/shared/svgs/empty-schedule.svg";
import {
  InnerBox,
  Spacer,
  TextField,
  TextInput,
} from "@/shared/components/layout";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import Modal from "@/shared/components/modals";
import React, { useEffect, useState } from "react";
import { Button } from "@/shared/components/buttons";
import { SWRProvider } from "@/app/swr-provider";
import Image from "next/image";
import useSWR from "swr";
import { getAnniversaryList } from "../apis";
import {
  AnniversaryFormData,
  AnniversaryModel,
  anniversaryFormSchema,
} from "@/entities/anniversary/schema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format, isValid as isValidDate } from "date-fns";
import { ko } from "date-fns/locale";

export default function AnnivWidget() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [showIconSelector, setShowIconSelector] = useState<boolean>(false);

  const { data, error, isLoading, mutate } = useSWR<AnniversaryModel[]>(
    activeModal === "list" ? "/api/anniversary" : null,
    getAnniversaryList
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
  } = useForm<AnniversaryFormData>({
    resolver: zodResolver(anniversaryFormSchema),
    mode: "onChange",
    defaultValues: {
      content: "",
      date: new Date(),
    },
  });

  const content = watch("content") || "";
  const selectedIcon = watch("icon");
  const selectedDate = watch("date");
  const isDday = watch("isDday");

  const iconTypes = ["cake", "gift", "conical"];
  const iconBasePath = "/images/home/anniversary";

  useEffect(() => {
    if (activeModal === null) {
      reset();
      setShowIconSelector(false);
    }
  }, [activeModal, reset]);

  const handleIconSelect = (iconIndex: number) => {
    setValue("icon", iconIndex, { shouldValidate: true });
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date && isValidDate(date)) {
      setValue("date", date, { shouldValidate: true });
      setActiveModal("add");
    }
  };

  const toggleIsDday = () => {
    setValue("isDday", !isDday, { shouldValidate: true });
  };

  const formattedDate = format(selectedDate, "yyyy년 MM월 dd일", {
    locale: ko,
  });

  const onSubmit = (data: AnniversaryFormData) => {
    console.log(data);
    setActiveModal("list");
    mutate();
  };

  return (
    <>
      <div
        className={styles.emptyContainer}
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

      <Modal
        isOpen={activeModal === "list"}
        onClose={() => setActiveModal(null)}
        style={{ backgroundColor: Colors.transparnet }}
      >
        <div className={styles.modalContainer}>
          <div className={styles.modalTitle}>
            <Close style={{ opacity: 0 }} />
            <Text
              text="기념일 목록"
              color={Colors.white}
              fontSize="lg"
              fontWeight="bold"
            />
            <Close onClick={() => setActiveModal(null)} />
          </div>

          <div className={styles.modalContent}>
            <div className={imgStyles.square}>
              <Image
                src={`/images/shared/${
                  isLoading ? "loading" : error ? "error" : "empty"
                }/schedule.png`}
                alt="빈 기념일 목록"
                fill
                sizes="100%"
              />
            </div>
            <Button
              width="260"
              height="37"
              fontSize="sm"
              fontWeight="bold"
              color={Colors.primary}
              textColor={Colors.brown}
              mt="12"
              onClick={() => setActiveModal("add")}
            >
              <Text
                text={data?.length === 0 ? `기념일 추가하기` : `등록하기`}
                color={Colors.brown}
                fontWeight="bold"
              />
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={activeModal === "add"}
        onClose={() => setActiveModal(null)}
        style={{ backgroundColor: Colors.transparnet }}
      >
        <div className={styles.modalContainer}>
          <div
            className={styles.modalTitle}
            style={
              { "--modal-title-color": Colors.primary } as React.CSSProperties
            }
          >
            <Check />
            <Text
              text="기념일 추가"
              color={Colors.white}
              fontSize="lg"
              fontWeight="bold"
            />
            <Close onClick={() => setActiveModal("list")} />
          </div>

          <div
            className={styles.modalContent}
            style={{ "--modal-content-px": "0" } as React.CSSProperties}
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
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
                    className={styles.iconSelectorButton}
                  >
                    {selectedIcon === undefined || selectedIcon === null ? (
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
                  onClick={() => setActiveModal("datePicker")}
                  style={{ cursor: "pointer" }}
                >
                  <EmptySchedule />
                </div>
              </div>

              <Button
                width="260"
                height="37"
                fontSize="sm"
                fontWeight="bold"
                color={Colors.primary}
                textColor={Colors.brown}
                mt="12"
                type="submit"
                disabled={!isValid}
              >
                <Text
                  text="추가하기"
                  color={Colors.brown}
                  fontWeight="bold"
                  fontSize="md"
                />
              </Button>
            </form>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={activeModal === "datePicker"}
        onClose={() => setActiveModal(null)}
        style={{ backgroundColor: Colors.transparnet }}
      >
        <div className={styles.modalContainer}>
          <div
            className={styles.modalTitle}
            style={
              { "--modal-title-color": Colors.primary } as React.CSSProperties
            }
          >
            <Check />
            <Text
              text="날짜 선택"
              color={Colors.white}
              fontSize="lg"
              fontWeight="bold"
            />
            <Close onClick={() => setActiveModal("add")} />
          </div>

          <div className={styles.modalContent}>
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              locale={ko}
              captionLayout="label"
              animate
              formatters={{
                formatCaption: (date) =>
                  format(date, "yyyy년 MM월", { locale: ko }),
              }}
              style={
                {
                  "--rdp-accent-color": Colors.brown,
                  "--rdp-accent-backgroun-color": Colors.invalid,
                  "--rdp-day_button-width": "calc(100dvw / 360 * 32)",
                  "--rdp-day_button-height": "var(--rdp-day_button-width)",
                } as React.CSSProperties
              }
            />
            {/* <Button
              width="260"
              height="37"
              fontSize="sm"
              fontWeight="bold"
              color={Colors.primary}
              textColor={Colors.brown}
              mt="12"
              onClick={() => setActiveModal("add")}
            >
              <Text
                text="선택 완료"
                color={Colors.brown}
                fontWeight="bold"
                fontSize="md"
              />
            </Button> */}
          </div>
        </div>
      </Modal>
    </>
  );
}
