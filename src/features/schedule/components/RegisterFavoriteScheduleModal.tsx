"use client";
import { memo } from "react";
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

interface RegisterFavoriteScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (alias: string) => void;
  scheduleId: number;
}

const aliasSchema = z.object({
  alias: favoriteScheduleSchema.shape.alias,
});

type AliasFormData = z.infer<typeof aliasSchema>;

const RegisterFavoriteScheduleModal = memo(
  ({
    isOpen,
    onClose,
    onRegister,
    scheduleId,
  }: RegisterFavoriteScheduleModalProps) => {
    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting, isValid },
      watch,
      reset,
    } = useForm<AliasFormData>({
      resolver: zodResolver(aliasSchema),
      defaultValues: {
        alias: "",
      },
    });

    const onSubmit = (data: AliasFormData) => {
      if (!isValid) {
        alert("별칭은 2자 이상, 8자 이하로 입력해주세요.");
        return;
      }
      onRegister(data.alias || "");
      reset();
      onClose();
    };

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
