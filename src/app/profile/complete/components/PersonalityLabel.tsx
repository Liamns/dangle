"use client";
import { COMMON_MESSAGE } from "@/shared/consts/messages";
import { InnerBox, Spacer } from "../../../../shared/components/layout";
import { Text } from "../../../../shared/components/texts";
import { Colors } from "../../../../shared/consts/colors";
import layoutStyles from "../../input/layout.module.scss";

export interface PersonalityLabelProps {
  personality: string | null;
}

export default function PersonalityLabel({
  personality,
}: PersonalityLabelProps) {
  return (
    <InnerBox justify="start" direction="column" align="start">
      <Text text="Personality" fontWeight="bold" color={Colors.primary} />
      <Spacer height="6" />
      <div
        className={layoutStyles.labelContainer}
        style={
          {
            "--label-bg-color": Colors.primary,
          } as React.CSSProperties
        }
      >
        <Text
          text={
            personality === null ? COMMON_MESSAGE.WRONG_ACCESS : personality
          }
          fontSize="lg"
          fontWeight="bold"
          color={Colors.white}
        />
      </div>
    </InnerBox>
  );
}
