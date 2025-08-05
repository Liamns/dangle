"use client";
import { MainCategory, mainCategories } from "@/entities/schedule/types";
import styles from "./ScheduleMainCategoryRow.module.scss";
import cn from "classnames";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import { memo, useRef, useState, MouseEvent, useEffect } from "react"; // useEffect 추가

interface ScheduleMainCategoryRowProps {
  selected: MainCategory;
  onSelect: (category: MainCategory) => void;
}

const ScheduleMainCategoryRow = memo(
  ({ selected, onSelect }: ScheduleMainCategoryRowProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // --- 드래그 시작 (컨테이너에서만 발생) ---
    const onMouseDown = (e: MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      e.preventDefault(); // 드래그 시 텍스트 선택 등 기본 동작 방지
      setIsDragging(true);
      setStartX(e.pageX - containerRef.current.offsetLeft);
      setScrollLeft(containerRef.current.scrollLeft);
      containerRef.current.style.cursor = "grabbing";
    };

    // --- useEffect를 사용하여 window에 이벤트 리스너 관리 ---
    useEffect(() => {
      const container = containerRef.current;

      // --- 드래그 중 이동 (window 전역에서 발생) ---
      const onMouseMove = (e: globalThis.MouseEvent) => {
        if (!isDragging || !container) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 1.5;
        container.scrollLeft = scrollLeft - walk;
      };

      // --- 드래그 종료 (window 전역에서 발생) ---
      const onMouseUp = () => {
        if (!isDragging || !container) return;
        setIsDragging(false);
        container.style.cursor = "grab";
      };

      if (isDragging) {
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
      }

      // 클린업 함수: isDragging 상태가 바뀌거나 컴포넌트가 언마운트될 때 리스너 제거
      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };
    }, [isDragging, startX, scrollLeft]); // 의존성 배열에 상태 추가

    return (
      <div
        ref={containerRef}
        className={styles.container}
        onMouseDown={onMouseDown}
        style={{ cursor: "grab" }}
      >
        {mainCategories.map((category) => {
          const isActive = selected === category;
          // 클릭 이벤트가 드래그 종료 시 발생하지 않도록 수정
          const handleClick = (e: MouseEvent) => {
            if (Math.abs(containerRef.current!.scrollLeft - scrollLeft) > 5) {
              e.preventDefault();
              return;
            }
            onSelect(category);
          };

          return (
            <div
              key={category}
              className={cn(styles.chip, { [styles.active]: isActive })}
              onClick={handleClick}
            >
              <Text
                text={category}
                fontWeight="bold"
                color={isActive ? Colors.brown : Colors.white}
              />
            </div>
          );
        })}
      </div>
    );
  }
);

ScheduleMainCategoryRow.displayName = "ScheduleMainCategoryRow";
export default ScheduleMainCategoryRow;
