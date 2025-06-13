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
import { getAnniversaryIconByType } from "@/entities/anniversary/model";
import Image from "next/image";
import { getFavoriteIconByType } from "@/entities/routine/model";

interface RegisterFavoriteScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (alias: string, icon: number) => void;
}

const aliasSchema = z.object({
  alias: favoriteScheduleSchema.shape.alias,
  icon: favoriteScheduleSchema.shape.icon,
});

type AliasFormData = z.infer<typeof aliasSchema>;

const RegisterFavoriteScheduleModal = memo(
  ({ isOpen, onClose, onRegister }: RegisterFavoriteScheduleModalProps) => {
    const [isSelectMode, setIsSelectMode] = useState(false);
    const iconSelectorRef = useRef<HTMLDivElement>(null);
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
      },
      mode: "onChange",
    });

    const onSubmit = (data: AliasFormData) => {
      if (!isValid) {
        console.warn("Form is not valid", getValues());
        alert("별칭은 2자 이상, 8자 이하로 입력해주세요.");
        return;
      }
      onRegister(data.alias, data.icon);
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
        // 모달이 열릴 때 입력값 초기화
        reset({
          alias: "",
          icon: undefined,
        });
        setIsSelectMode(false);
      }
    }, [isOpen]);

    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className={styles.container}>
          <CloseSvg className={styles.closeBtn} onClick={onClose} />

          <div className={styles.title}>
            <FavoriteSvg className={styles.favoriteSvg} />
            <Text text="즐겨찾기 등록" color={Colors.brown} fontWeight="bold" />
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
                  {`${watch("alias")?.length}/8`}
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
                        src={getFavoriteIconByType(getValues("icon"))}
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
                            src={getFavoriteIconByType(index)}
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
              <Text text="등록" color={Colors.white} fontWeight="bold" />
            </div>
          </form>
        </div>
      </Modal>
    );
  }
);
RegisterFavoriteScheduleModal.displayName = "RegisterFavoriteScheduleModal";
export default RegisterFavoriteScheduleModal;
