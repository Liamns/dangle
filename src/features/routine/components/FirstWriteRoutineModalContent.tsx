import {
  RoutineCategory,
  RoutineCategoryColors,
  RoutineType,
  RoutineTypeKor,
} from "@/entities/routine/types";
import styles from "./FirstWriteRoutineModalContent.module.scss";
import { memo } from "react";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import Image from "next/image";
import TypeCheckSvg from "@/shared/svgs/type-check.svg";
import cn from "classnames";
import { useFormContext } from "react-hook-form";

interface FirstWriteRoutineModalContentProps {
  selectedCategory: RoutineCategory;
  isOpenTypeSelect: boolean;
  handleTypeSelect: () => void;
  selectedType: RoutineType;
  handleTypeChange: (type: RoutineType) => void;
}

const FirstWriteRoutineModalContent = memo(
  ({
    selectedCategory,
    isOpenTypeSelect,
    handleTypeSelect,
    selectedType,
    handleTypeChange,
  }: FirstWriteRoutineModalContentProps) => {
    const {
      register,
      formState: { errors },
    } = useFormContext();

    return (
      <div
        className={styles.content}
        style={
          {
            "--write-routine-modal-content-bg":
              RoutineCategoryColors[selectedCategory],
          } as React.CSSProperties
        }
      >
        <div className={styles.contentTitle}>
          <Text
            text={selectedCategory}
            color={Colors.white}
            fontSize="title"
            fontWeight="bold"
          />
          <input
            type="text"
            className={styles.nameInput}
            min={2}
            max={8}
            placeholder="루틴 이름을 입력해주세요"
            {...register("name")}
            maxLength={8}
          />
        </div>

        <Image
          src={`/images/routine/${selectedCategory}.png`}
          alt="루틴 카테고리별 이미지"
          width={226}
          height={226}
        />
        <div className={styles.type}>
          <div className={styles.typeLabel}>
            <Text text="루틴 구분" fontSize="md" color={Colors.white} />
            <TypeCheckSvg color={Colors.white} />
          </div>
          <div className={styles.typeSelect} onClick={handleTypeSelect}>
            <div className={styles.typeContent}>
              <Text
                text={RoutineTypeKor[selectedType]}
                color={Colors.brown}
                fontSize="title"
              />
              <Text text={selectedType} color={Colors.brown} fontSize="md" />
            </div>

            <div className={styles.typeSelectIcon}>
              <Image
                src={"/images/brown-triangle.png"}
                fill
                alt="루틴 타입선택"
              />
            </div>

            <div
              className={cn(styles.typeOptionBox, {
                [styles.active]: isOpenTypeSelect,
              })}
            >
              {Object.values(RoutineType).map((type) => (
                <div
                  key={type}
                  className={styles.typeOption}
                  onClick={() => {
                    handleTypeChange(type);
                  }}
                >
                  <Text
                    text={RoutineTypeKor[type]}
                    color={Colors.brown}
                    fontSize="md"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

FirstWriteRoutineModalContent.displayName = "FirstWriteRoutineModalContent";
export default FirstWriteRoutineModalContent;
