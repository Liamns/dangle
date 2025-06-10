"use client";
import {
  NewRoutineWithContents,
  NewRoutineWithContentsSchema,
  RoutineWithContentsModel,
  UpdateRoutineWithContents,
  UpdateRoutineWithContentsSchema,
} from "@/entities/routine/schema";
import styles from "./WriteRoutineModal.module.scss";
import { memo, useCallback, useEffect, useState } from "react";
import Modal from "@/shared/components/modals";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import {
  RoutineCategory,
  RoutineCategoryKor,
  RoutineType,
} from "@/entities/routine/types";
import cn from "classnames";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import WriteRoutine from "./WriteRoutine";
import WriteRoutineContent from "./WriteRoutineContent";

interface WriteRoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  routine?: RoutineWithContentsModel;
  onSave: (data: NewRoutineWithContents) => Promise<void>;
  onEdit: (data: UpdateRoutineWithContents) => Promise<void>;
}

const WriteRoutineModal = memo(
  ({ isOpen, onClose, routine, onSave, onEdit }: WriteRoutineModalProps) => {
    const isNew = !routine;
    const [selectedCategory, setSelectedCategory] = useState<RoutineCategory>(
      RoutineCategory.EXERCISE
    );
    const [isOpenTypeSelect, setIsOpenTypeSelect] = useState(false);
    const [selectedType, setSelectedType] = useState<RoutineType>(
      RoutineType.TIP
    );
    const [isFirst, setIsFirst] = useState(true);
    const categories = Object.values(RoutineCategory);
    const [currnetIndex, setCurrentIndex] = useState(0);

    // 신규 루틴 + 콘텐츠 폼 세팅
    const newMethods = useForm<NewRoutineWithContents>({
      resolver: zodResolver(NewRoutineWithContentsSchema),
      defaultValues: {
        profileId: "",
        category: RoutineCategory.EXERCISE,
        type: RoutineType.TIP,
        name: "",
        contents: [{ title: "", memo: "", image: "" }],
      },
    });
    // 수정 루틴 + 콘텐츠 폼 세팅
    const updateMethods = useForm<UpdateRoutineWithContents>({
      resolver: zodResolver(UpdateRoutineWithContentsSchema),
      defaultValues: !isNew
        ? {
            id: routine!.id,
            profileId: routine!.profileId,
            category: routine!.category,
            type: routine!.type,
            name: routine!.name,
            contents: routine!.contents.map((c) => ({
              id: c.id,
              routineId: c.routineId,
              title: c.title,
              memo: c.memo,
              image: c.image ?? "",
            })),
          }
        : undefined,
    });

    // 신규/수정 메서드를 하나의 변수로 결합 (any 캐스트로 TS 에러 회피)
    const methods: any = isNew ? newMethods : updateMethods;

    const { fields, append, remove, replace } = useFieldArray({
      name: "contents",
      control: methods.control,
    });

    useEffect(() => {
      if (isOpen) {
        setIsFirst(true);
        setIsOpenTypeSelect(false);
        setSelectedCategory(RoutineCategory.EXERCISE);
        setSelectedType(RoutineType.TIP);
        setCurrentIndex(0);

        if (isNew) {
          // 새 루틴인 경우 모든 폼 초기화
          methods.reset({
            profileId: "",
            category: RoutineCategory.EXERCISE,
            type: RoutineType.TIP,
            name: "", // 이름 초기화
            contents: [{ title: "", memo: "", image: "" }],
          });
          replace([{ title: "", memo: "", image: "" }]);
        } else {
          // 기존 루틴 편집인 경우 해당 루틴 데이터로 초기화
          setSelectedCategory(routine!.category);
          setSelectedType(routine!.type);
          methods.reset({
            id: routine!.id,
            profileId: routine!.profileId,
            category: routine!.category,
            type: routine!.type,
            name: routine!.name,
            contents: routine!.contents.map((c) => ({
              id: c.id,
              routineId: c.routineId,
              title: c.title,
              memo: c.memo,
              image: c.image ?? "",
            })),
          });
          replace(
            routine!.contents.map((c) => ({
              id: c.id,
              routineId: c.routineId,
              title: c.title,
              memo: c.memo,
              image: c.image ?? "",
            }))
          );
        }
      }
    }, [isOpen, isNew, routine, methods, replace]);

    const handleAdd = () => {
      if (fields.length >= 5) {
        alert("최대 5개의 슬라이드까지만 추가할 수 있습니다.");
        return;
      }
      const currentFields = methods.getValues(`contents.${currnetIndex}`);
      if (currentFields.title.length < 2) {
        alert("루틴 내용의 제목은 최소 2자 이상이어야 합니다.");
        return;
      }
      if (currentFields.memo.length < 2) {
        alert("루틴 내용의 메모는 최소 2자 이상이어야 합니다.");
        return;
      }
      append({
        id: undefined,
        routineId: isNew ? undefined : routine?.id,
        title: "",
        memo: "",
        image: "",
      });
      setCurrentIndex(fields.length);
    };
    const handlePrev = useCallback(() => {
      if (currnetIndex > 0) {
        setCurrentIndex(currnetIndex - 1);
      }
    }, [currnetIndex, fields.length]);
    const handleNext = useCallback(() => {
      if (currnetIndex < fields.length - 1) {
        setCurrentIndex(currnetIndex + 1);
      }
    }, [currnetIndex, fields.length]);
    const handleRemove = useCallback(
      (index: number) => {
        if (fields.length <= 1) return; // 최소 한 개는 남겨두기
        remove(index);
        if (currnetIndex === fields.length - 1) {
          setCurrentIndex(fields.length - 2); // 마지막 슬라이드 제거 시 이전 슬라이드로 이동
        }
      },
      [fields.length, currnetIndex, remove]
    );

    // submit handlers
    const onSubmitNew = newMethods.handleSubmit(async (data) => {
      await onSave(data);
      onClose();
    });
    const onSubmitUpdate = updateMethods.handleSubmit(
      async (data) => {
        await onEdit(data);
        onClose();
      },
      (errors) => {
        // 여기에 에러 처리 로직 추가
        console.error("검증 오류:", errors);
      }
    );

    const handleClickButton = () => {
      if (isFirst) {
        const name = methods.getValues("name");
        if (!name || name.length < 2) {
          alert("루틴 이름은 최소 2자 이상이어야 합니다.");
          return;
        }
        setIsFirst(false);
      } else {
        const allContents = methods.getValues("contents");

        // 빈 필드 확인
        const invalidContentIndex = allContents.findIndex(
          (
            content: { title: string; memo: string; image?: string },
            idx: number
          ) => {
            return (
              !content.title ||
              content.title.length < 2 ||
              !content.memo ||
              content.memo.length < 2
            );
          }
        );

        if (invalidContentIndex !== -1) {
          alert(
            `${
              invalidContentIndex + 1
            }번째 슬라이드의 제목과 내용을 확인해주세요.`
          );
          setCurrentIndex(invalidContentIndex);
          return;
        }
        isNew ? onSubmitNew() : onSubmitUpdate();
      }
    };

    const handleTypeSelect = useCallback(() => {
      setIsOpenTypeSelect(!isOpenTypeSelect);
    }, [isOpenTypeSelect]);

    const handleTypeChange = useCallback(
      (type: RoutineType) => {
        setSelectedType(type);
        methods.setValue("type", type);
        setIsOpenTypeSelect(false);
      },
      [methods, setIsOpenTypeSelect]
    );

    const handleClose = () => {
      onClose();
    };

    useEffect(() => {
      setIsFirst(true);
      setCurrentIndex(0);
    }, [selectedCategory]);

    return (
      <Modal isOpen={isOpen} onClose={handleClose}>
        <FormProvider {...methods}>
          <form className={styles.container}>
            {/* 루틴 카테고리 선택 */}
            <div className={styles.category}>
              <Text
                text="루틴 카테고리"
                fontSize="md"
                fontWeight="bold"
                color={Colors.brown}
              />
              <div className={styles.categoryRow}>
                {categories.map((category) => {
                  const isSelected = selectedCategory === category;
                  return (
                    <div
                      key={category}
                      className={cn(styles.categoryItem, {
                        [styles.active]: isSelected,
                      })}
                      onClick={() => {
                        setSelectedCategory(category);
                        methods.setValue("category", category);
                      }}
                    >
                      <Text
                        text={RoutineCategoryKor[category]}
                        fontSize="sm"
                        fontWeight="bold"
                        color={isSelected ? Colors.brown : Colors.white}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            {/* 루틴 기본 폼 필드 */}
            {isFirst ? (
              <WriteRoutine
                selectedCategory={selectedCategory}
                selectedType={selectedType}
                handleTypeChange={handleTypeChange}
                handleTypeSelect={handleTypeSelect}
                isOpenTypeSelect={isOpenTypeSelect}
              />
            ) : (
              <div className={styles.routineContentSliderWrapper}>
                <div
                  className={styles.routineContentSliderInner}
                  style={
                    {
                      "--slider-translate-x": `${-currnetIndex * 100}%`,
                    } as React.CSSProperties
                  }
                >
                  {fields.map((field, index) => {
                    return (
                      <div key={index} className={styles.routineContentSlide}>
                        <WriteRoutineContent
                          key={field.id}
                          index={index}
                          length={fields.length}
                          currentIndex={currnetIndex}
                          selectedCategory={selectedCategory}
                          onRemove={() => handleRemove(currnetIndex)}
                          onAdd={handleAdd}
                          onPrev={handlePrev}
                          onNext={handleNext}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className={styles.button} onClick={handleClickButton}>
              <Text
                text={isFirst ? "다음 단계로" : isNew ? "저장하기" : "수정하기"}
                fontSize="lg"
                color={Colors.white}
                fontWeight="bold"
              />
            </div>
          </form>
        </FormProvider>
      </Modal>
    );
  }
);

WriteRoutineModal.displayName = "WriteRoutineModal";
export default WriteRoutineModal;
