"use client";
import styles from "./Onboarding.module.scss";
import ChevronSvg from "@/shared/svgs/chevron.svg";
import cn from "classnames";

/**
 * AnimatedChevron 컴포넌트 - 온보딩 과정에서 스크롤 또는 다음 단계를 표시하는 애니메이션 쉐브론
 *
 * 두 개의 화살표가 순차적으로 3단계(흰색 -> 회색 -> 투명)의 색상 변화, fadeIn/fadeOut 효과 및
 * 미세한 크기 변화를 통해 아래로 내려가는 듯한 시각적 효과를 표현합니다. 실제로 위치 이동 없이
 * 색상(흰색 -> 회색), 투명도(나타남 -> 사라짐), 크기 변화만으로 다음 페이지로 이동하라는
 * 안내 효과를 제공합니다. 두 화살표는 시간차(0.75초)를 두고 애니메이션이 적용되어 연속적인 흐름을 표현합니다.
 */
interface AnimatedChevronProps {
  /** 화살표 색상 (CSS 색상값) - 기본값: 흰색(CSS 변수 사용) */
  color?: string;
  /** 화살표 너비 (픽셀) - 기본값: 32px (CSS에서 설정) */
  size?: number;
  reverse?: boolean; // 애니메이션 방향 반전 여부
}

const AnimatedChevron = ({ color, size, reverse }: AnimatedChevronProps) => {
  // 색상 스타일을 동적으로 적용
  const style = color ? { color } : {};

  return (
    <div className={cn(styles.chevronContainer, { [styles.reverse]: reverse })}>
      <ChevronSvg
        className={styles.upperChevron}
        style={style}
        width={size}
        height={size && size * 0.625} // 가로세로 비율 유지
        aria-hidden="true" // 화면 낭독기에서 불필요한 음성 안내 방지
      />
      <ChevronSvg
        className={styles.lowerChevron}
        style={style}
        width={size}
        height={size && size * 0.625} // 가로세로 비율 유지
        aria-hidden="true" // 화면 낭독기에서 불필요한 음성 안내 방지
      />
    </div>
  );
};

AnimatedChevron.displayName = "AnimatedChevron";
export default AnimatedChevron;
