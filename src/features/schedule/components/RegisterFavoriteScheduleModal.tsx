"use client";
import { memo, useEffect, useRef, useState } from "react";
import styles from "./RegisterFavoriteScheduleModal.module.scss";
import Modal from "@/shared/components/modals";
import CloseSvg from "@/shared/svgs/close.svg";
import FavoriteSvg from "@/shared/svgs/favorites.svg";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import { z } from "zod";
import { favoriteScheduleSchema } from "@/entities/schedule/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import cn from "classnames";
import EmptyFavoriteIcon from "@/shared/svgs/empty-favorite.svg";
import { favoriteIcon } from "@/shared/types/icon";
import ScheduleSvg from "@/shared/svgs/schedule.svg";
import Image from "next/image";
import { ScheduleModel } from "@/entities/schedule/model";
import { getFavoriteScheduleIconByType } from "@/entities/schedule/utils";

interface RegisterFavoriteScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (alias: string, icon: number) => void;
  onEdit?: (id: number, alias: string, icon: number) => void;
  favorite?: ScheduleModel;
}

const aliasSchema = z.object({
  alias: favoriteScheduleSchema.shape.alias,
  icon: favoriteScheduleSchema.shape.icon,
});

type AliasFormData = z.infer<typeof aliasSchema>;

const RegisterFavoriteScheduleModal = memo(
  ({
    isOpen,
    onClose,
    onRegister,
    onEdit,
    favorite,
  }: RegisterFavoriteScheduleModalProps) => {
    const [isSelectMode, setIsSelectMode] = useState(false);
    const iconSelectorRef = useRef<HTMLDivElement>(null);

    // 모달 타이틀 동적 설정
    const isEditMode = !!favorite;
    const modalTitle = isEditMode ? "즐겨찾기 수정" : "즐겨찾기 등록";
    const buttonText = isEditMode ? "수정" : "등록";
    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting, isValid },
      watch,
      reset,
      getValues,
      setValue,
    } = useForm<AliasFormData>({
      resolver: zodResolver(aliasSchema),
      defaultValues: {
        alias: "",
        icon: undefined,
      },
      mode: "onChange",
    });

    const onSubmit = (data: AliasFormData) => {
      if (!isValid) {
        console.warn("Form is not valid", getValues());
        alert("별칭은 2자 이상, 8자 이하로 입력해주세요.");
        return;
      }

      if (isEditMode && favorite && onEdit) {
        // 수정 모드일 경우
        onEdit(favorite.id, data.alias, data.icon);
      } else {
        // 생성 모드일 경우
        onRegister(data.alias, data.icon);
      }

      reset();
      onClose();
    };

    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (
          isSelectMode &&
          iconSelectorRef.current &&
          !iconSelectorRef.current.contains(event.target as Node)
        ) {
          setIsSelectMode(false);
        }
      }

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isSelectMode]);

    useEffect(() => {
      if (isOpen) {
        if (isEditMode && favorite) {
          // 수정 모드일 경우 기존 데이터로 폼 초기화
          reset({
            alias: favorite.alias,
            icon: favorite.icon,
          });
        } else {
          // 생성 모드일 경우 빈 값으로 초기화
          reset({
            alias: "",
            icon: undefined,
          });
        }
        setIsSelectMode(false);
      }
    }, [isOpen, favorite, isEditMode, reset]);

    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className={styles.container}>
          <CloseSvg className={styles.closeBtn} onClick={onClose} />

          <div className={styles.title}>
            {isEditMode ? (
              <ScheduleSvg className={styles.scheduleSvg} />
            ) : (
              <FavoriteSvg className={styles.favoriteSvg} />
            )}
            <Text text={modalTitle} color={Colors.brown} fontWeight="bold" />
          </div>

          <div className={styles.divider}></div>

          <form className={styles.form}>
            <div className={styles.inputWrapper}>
              <div className={styles.inputBox}>
                <input
                  type="text"
                  {...register("alias")}
                  minLength={2}
                  maxLength={8}
                  className={styles.alias}
                  placeholder="별칭을 입력하세요."
                />
                <span className={styles.suffix}>
                  {`${watch("alias")?.length || 0}/8`}
                </span>
              </div>

              <div className={styles.iconWrapper}>
                {getValues("icon") === undefined ? (
                  <EmptyFavoriteIcon
                    onClick={() => setIsSelectMode(!isSelectMode)}
                    className={styles.emptyIcon}
                  />
                ) : (
                  <div
                    className={styles.selectedIconBox}
                    onClick={() => setIsSelectMode(!isSelectMode)}
                  >
                    <div className={styles.selectedIcon}>
                      <Image
                        src={getFavoriteScheduleIconByType(getValues("icon"))}
                        alt="selected-icon"
                        fill
                      />
                    </div>
                  </div>
                )}

                {isSelectMode && (
                  <div className={styles.iconSelector} ref={iconSelectorRef}>
                    {favoriteIcon.map((type, index) => (
                      <div
                        key={index}
                        className={cn(styles.iconOption, {
                          [styles.selected]: getValues("icon") === index,
                        })}
                        onClick={() => {
                          setValue("icon", index, { shouldValidate: true });
                          setIsSelectMode(false);
                        }}
                      >
                        <div className={styles.icon}>
                          <Image
                            src={getFavoriteScheduleIconByType(index)}
                            alt={`icon-${index}`}
                            fill
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div
              className={cn(styles.button, { [styles.valid]: isValid })}
              onClick={handleSubmit(onSubmit)}
            >
              <Text text={buttonText} color={Colors.white} fontWeight="bold" />
            </div>
          </form>
        </div>
      </Modal>
    );
  }
);
RegisterFavoriteScheduleModal.displayName = "RegisterFavoriteScheduleModal";
export default RegisterFavoriteScheduleModal;
