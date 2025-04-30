import React from "react";
import Modal from "@/shared/components/modals";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import Close from "@/shared/svgs/close.svg";
import Check from "@/shared/svgs/check.svg";
import styles from "@/shared/styles/modal.module.scss";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void; // 뒤로가기 버튼 처리 함수 (선택적)
  title?: string; // 모달 제목을 커스터마이징할 수 있도록 추가
  selectedDate?: Date;
  onDateSelect: (date: Date | undefined) => void;
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({
  isOpen,
  onClose,
  onBack,
  title = "날짜 선택", // 기본값 설정
  selectedDate,
  onDateSelect,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
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
            text={title}
            color={Colors.white}
            fontSize="lg"
            fontWeight="bold"
          />
          {onBack ? <Close onClick={onBack} /> : null}
        </div>

        <div className={styles.modalContent}>
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={onDateSelect}
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
        </div>
      </div>
    </Modal>
  );
};

export default DatePickerModal;
