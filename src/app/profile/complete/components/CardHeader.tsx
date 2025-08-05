"use client";
import { InnerBox, Spacer } from "../../../../shared/components/layout";
import { Text } from "../../../../shared/components/texts";
import { Colors } from "../../../../shared/consts/colors";
import Dog from "@/shared/svgs/dog.svg";
import Cat from "@/shared/svgs/cat.svg";

export interface CardHeaderProps {
  title: string;
  petSpec: number;
}

export default function CardHeader({ title, petSpec }: CardHeaderProps) {
  return (
    <InnerBox
      direction="row"
      style={{
        width:
          "clamp(calc(320px / 360 * 300), calc(100dvw / 360 * 300), calc(500px / 360 * 300))",
        paddingBottom: "calc(100dvh / 740 * 28)",
        boxShadow: "0px 9px 17.4545px -9.54545px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Text
        text={title}
        color={Colors.brown}
        fontWeight="bold"
        fontSize="title"
      />
      <Spacer width="6" />
      {petSpec === 0 ? (
        <Dog style={{ color: Colors.brown }} />
      ) : (
        <Cat style={{ color: Colors.brown }} />
      )}
    </InnerBox>
  );
}
