"use client";
import {
  NewRoutineDto,
  NewRoutineDtoSchema,
  RoutineModel,
  UpdateRoutineDto,
  UpdateRoutineDtoSchema,
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
import FirstWriteRoutineModalContent from "./FirstWriteRoutineModalContent";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface WriteRoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  routine?: RoutineModel;
  onSave: (data: NewRoutineDto) => Promise<void>;
  onEdit: (data: UpdateRoutineDto) => Promise<void>;
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

    useEffect(() => {
      if (isOpen) {
        setIsFirst(true);
        setIsOpenTypeSelect(false);
        setSelectedCategory(RoutineCategory.EXERCISE);
        setSelectedType(RoutineType.TIP);
      }
    }, [isOpen]);

    const formSchema = isNew
      ? NewRoutineDtoSchema
      : UpdateRoutineDtoSchema.omit({ id: true });
    const methods = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: isNew
        ? {
            profileId: "",
            category: RoutineCategory.EXERCISE,
            type: RoutineType.TIP,
            name: "",
            title: "",
            content: "",
            image: "",
          }
        : {
            profileId: routine!.profileId,
            category: routine!.category,
            type: routine!.type,
            name: routine!.name,
            title: routine!.title,
            content: routine!.content,
            image: routine!.image ?? "",
          },
    });

    const { handleSubmit, setValue, watch } = methods;

    const onSubmit = handleSubmit(async (data) => {
      if (isNew) {
        await onSave({
          ...data,
          category: selectedCategory,
          type: selectedType,
        });
      } else {
        await onEdit({
          ...data,
          id: routine!.id,
          category: selectedCategory,
          type: selectedType,
        });
      }
      onClose();
    });

    const handleClickButton = () => {
      if (isFirst) {
        setIsFirst(false);
      } else {
        onSubmit();
      }
    };

    const handleTypeSelect = useCallback(() => {
      setIsOpenTypeSelect(!isOpenTypeSelect);
    }, [isOpenTypeSelect]);

    const handleTypeChange = useCallback(
      (type: RoutineType) => {
        setSelectedType(type);
        setValue("type", type);
        setIsOpenTypeSelect(false);
      },
      [setSelectedType, setIsOpenTypeSelect]
    );

    const handleClose = () => {
      onClose();
    };

    return (
      <Modal isOpen={isOpen} onClose={handleClose}>
        <FormProvider {...methods}>
          <form className={styles.container}>
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
                      onClick={() => setSelectedCategory(category)}
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
            {/* End of Category */}

            <FirstWriteRoutineModalContent
              selectedCategory={selectedCategory}
              selectedType={selectedType}
              handleTypeChange={handleTypeChange}
              handleTypeSelect={handleTypeSelect}
              isOpenTypeSelect={isOpenTypeSelect}
            />

            <div className={styles.button} onClick={handleClickButton}>
              <Text
                text={isFirst ? "다음 단계로" : isNew ? "저장하기" : "수정하기"}
                fontSize="lg"
                color={Colors.white}
                fontWeight="bold"
              />
            </div>
          </form>
          {/* End of Container */}
        </FormProvider>
      </Modal>
    );
  }
);

WriteRoutineModal.displayName = "WriteRoutineModal";
export default WriteRoutineModal;
