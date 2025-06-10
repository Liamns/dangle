"use client";
import {
  RoutineCategory,
  RoutineCategoryColors,
} from "@/entities/routine/types";
import styles from "./WriteRoutineContent.module.scss";
import { memo, useEffect, useRef, useState } from "react";
import { InnerBox, Spacer } from "@/shared/components/layout";
import { Text } from "@/shared/components/texts";
import { useFormContext } from "react-hook-form";
import cn from "classnames";
import { NewRoutineContentDto } from "@/entities/routine/schema";
import { Colors } from "@/shared/consts/colors";
import PlusSvg from "@/shared/svgs/plus.svg";
import DeleteSvg from "@/shared/svgs/delete.svg";

interface WriteRoutineContentProps {
  index: number;
  length: number;
  currentIndex: number;
  selectedCategory: RoutineCategory;
  onRemove: () => void;
  onAdd: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export const DEFAULT_ROUTINE_IMAGE_URL = "/images/empty-image.png";

const WriteRoutineContent = memo(
  ({
    index,
    length,
    currentIndex,
    selectedCategory,
    onRemove,
    onAdd,
    onNext,
    onPrev,
  }: WriteRoutineContentProps) => {
    const isLast = currentIndex === length - 1;
    const isFirst = currentIndex === 0;
    const isMiddle = currentIndex > 0 && currentIndex < length - 1;

    const {
      register,
      watch,
      setValue,
      getValues,
      formState: { errors },
    } = useFormContext<{
      contents: Array<NewRoutineContentDto>;
    }>();

    const field = (prop: "title" | "memo" | "image") =>
      `contents.${index}.${prop}` as const;

    const imageRef = useRef<HTMLInputElement>(null);
    const imageUrl = watch(field("image"));
    const [preview, setPreview] = useState<string>(
      imageUrl || DEFAULT_ROUTINE_IMAGE_URL
    );

    useEffect(() => {
      setPreview(imageUrl || DEFAULT_ROUTINE_IMAGE_URL);
    }, [imageUrl]);

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      setPreview(url);
      setValue(field("image"), url, {
        shouldDirty: true,
      });
    };

    return (
      <div
        className={styles.content}
        style={
          {
            "--write-routine-modal-content-border":
              RoutineCategoryColors[selectedCategory],
          } as React.CSSProperties
        }
      >
        <div className={styles.titleBox}>
          <InnerBox direction="row" justify="space-between" align="center">
            <Text
              text={selectedCategory}
              fontSize="lg"
              color={RoutineCategoryColors[selectedCategory]}
            />
            {length > 1 && (
              <DeleteSvg
                color={RoutineCategoryColors[selectedCategory]}
                width={16}
                height={16}
                onClick={onRemove}
              />
            )}
          </InnerBox>
          <input
            {...register(field("title"))}
            type="text"
            placeholder="제목을 입력해주세요"
            className={styles.title}
            minLength={2}
            maxLength={16}
            style={
              {
                "--write-routine-content-focus-border":
                  RoutineCategoryColors[selectedCategory],
              } as React.CSSProperties
            }
          />
        </div>
        {/* End of Title */}

        <div
          className={cn(styles.imageBox, {
            [styles.input]: preview !== DEFAULT_ROUTINE_IMAGE_URL,
          })}
          onClick={() => imageRef.current?.click()}
        >
          <img src={preview} alt="루틴 이미지" className={styles.image} />
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            ref={imageRef}
            onChange={onFileChange}
          />
        </div>
        {/* End of ImageBox */}

        <div className={styles.memoBox}>
          <Text text="Memo" color={RoutineCategoryColors[selectedCategory]} />
          <textarea
            {...register(field("memo"))}
            placeholder="사진의 대한 내용 및 주의사항, 꿀팁 등을 입력해 주세요!"
            className={styles.memo}
            minLength={2}
            style={
              {
                "--write-routine-content-focus-border":
                  RoutineCategoryColors[selectedCategory],
              } as React.CSSProperties
            }
          />
        </div>
        {/* End of MemoBox */}

        <div className={styles.buttonBox}>
          {!isFirst && (
            <div
              className={cn(
                styles.moveBtn,
                { [styles.double]: isLast },
                { [styles.triple]: isMiddle }
              )}
              onClick={onPrev}
            >
              <Text text="이전으로" color={Colors.darkGrey} fontWeight="bold" />
            </div>
          )}
          {/* 추가하기 버튼은 마지막 페이지에서만 노출 (또는 아이템이 없는 첫 페이지) */}
          {(isLast || (length === 1 && currentIndex === 0)) && (
            <div
              className={cn(
                styles.addBtn,
                { [styles.double]: !isMiddle },
                { [styles.triple]: isMiddle }
              )}
              onClick={onAdd}
            >
              <Text text="추가하기" color={Colors.darkGrey} fontWeight="bold" />
              <PlusSvg width={12} height={12} color={Colors.darkGrey} />
            </div>
          )}
          {!isLast && (
            <div
              className={cn(
                styles.moveBtn,
                { [styles.double]: isFirst },
                { [styles.triple]: isMiddle }
              )}
              onClick={onNext}
            >
              <Text text="다음으로" color={Colors.darkGrey} fontWeight="bold" />
            </div>
          )}
        </div>
        {/* End of ButtonBox */}
      </div>
    );
  }
);

WriteRoutineContent.displayName = "WriteRoutineContent";
export default WriteRoutineContent;
