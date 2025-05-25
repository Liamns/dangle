"use client";
import React from "react";
import Picker from "react-mobile-picker";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import styles from "@/shared/styles/TimePicker.module.scss";

export interface TimePickerOptions {
  hour: string[];
  minute: string[];
}

export interface TimePickerProps {
  /** 현재 선택된 날짜(시간 포함) */
  value: Date;
  /** 시간 선택 시 변경된 Date 반환 */
  onChange: (next: Date) => void;
  /** 선택기 레이블 (기본: '시작시간') */
  label?: string;
}

const TimePicker: React.FC<TimePickerProps> = ({ value, onChange, label = "시작시간" }) => {
  // 시/분 문자열 배열 생성
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
  // 내부 선택 값 관리 (외부 value 동기화)
  const [pickerValue, setPickerValue] = React.useState({
    hour: String(value.getHours()).padStart(2, '0'),
    minute: String(value.getMinutes()).padStart(2, '0'),
  });
  React.useEffect(() => {
    setPickerValue({
      hour: String(value.getHours()).padStart(2, '0'),
      minute: String(value.getMinutes()).padStart(2, '0'),
    });
  }, [value]);
  // Picker 변경 시 외부 콜백 호출
  const handleChange = (next: { hour: string; minute: string }) => {
    setPickerValue(next);
    const nextDate = new Date(value);
    nextDate.setHours(parseInt(next.hour, 10));
    nextDate.setMinutes(parseInt(next.minute, 10));
    onChange(nextDate);
  };
  return (
    <div className={styles.timePickerWrapper}>
      <div className={styles.timeSelected} />
      <div className={styles.timePickerLabel}>
        <Text text={label} color={Colors.black} fontWeight="bold" fontSize="md" />
      </div>
      <div className={styles.timePickerContainer}>
        <Picker value={pickerValue} onChange={handleChange} height={90} itemHeight={30} wheelMode="natural">
          {[
            { name: 'hour', options: hours },
            { name: 'minute', options: minutes },
          ].map(({ name, options }) => (
            <Picker.Column key={name} name={name as 'hour' | 'minute'}>
              {options.map((opt) => (
                <Picker.Item key={opt} value={opt}>
                  {({ selected }) => (
                    <Text
                      text={opt}
                      color={selected ? Colors.black : Colors.invalid}
                      fontWeight={selected ? 'bold' : 'normal'}
                      fontSize="md"
                    />
                  )}
                </Picker.Item>
              ))}
            </Picker.Column>
          ))}
        </Picker>
      </div>
    </div>
  );
};

TimePicker.displayName = "TimePicker";
export default TimePicker;
