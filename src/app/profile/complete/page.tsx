"use client";
import { ArrowButton, Button } from "@/shared/components/buttons";
import {
  Card,
  Center,
  InnerBox,
  InnerWrapper,
  Spacer,
} from "@/shared/components/layout";
import { BottomModal } from "@/shared/components/modals";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import Image from "next/image";
import { useState } from "react";
import styles from "./page.module.scss";
import layoutStyles from "../input/layout.module.scss";
import Dog from "@/shared/svgs/dog.svg";
import Cat from "@/shared/svgs/cat.svg";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/entities/profile/store";
import { getPublicImageUrl } from "@/shared/lib/supabase";
import {
  determinePersonalityType,
  transformPersonalityToRadarData,
} from "@/entities/profile/model";
import { div } from "framer-motion/client";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

export default function SelectSpecies() {
  const router = useRouter();
  const [front, setFront] = useState(true);
  const currentProfile = useProfileStore((s) => s.currentProfile);
  const petSpec = currentProfile?.petSpec ?? 0;

  const url = getPublicImageUrl("profile/personality/dog/excited.gif");

  const personality = determinePersonalityType(currentProfile);
  const data = transformPersonalityToRadarData(
    currentProfile?.personalityScores
  );

  return (
    <InnerWrapper>
      <div className={styles.scrollable}>
        <Spacer height="48" />

        <Card>
          <InnerBox>
            <InnerBox
              direction="row"
              style={{
                width: "calc(100dvw / 360 * 300)",
                maxWidth: "calc(1200px - (100dvw / 360 * 60))",
                paddingBottom: "calc(100dvh / 740 * 28)",
                boxShadow: "0px 9px 17.4545px -9.54545px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Text
                text={`${petSpec === 0 ? "댕댕이" : "야옹이"} 프로필`}
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

            <Spacer height="18" />

            {front ? (
              <div className={styles.imgContainer}>
                <Image src={url} fill alt="반려동물 성격유형별 GIF" />
              </div>
            ) : (
              <div className={styles.radarContainer}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid gridType="polygon" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={(props) => {
                        const { x, y, textAnchor, payload } = props;

                        // 특성에 따른 색상 매핑
                        const colorMap: Record<string, string> = {
                          영리: "#7f4c2f",
                          사교: "#FF8BC1",
                          활발: "#FFDB6D",
                          독립: "#F29F70",
                          차분: "#8CC8DA",
                        };

                        // 문자열인지 확인하고 키가 있는지 안전하게 확인
                        const value = String(payload.value); // 문자열로 변환
                        const fillColor =
                          value in colorMap ? colorMap[value] : "#FDC94A";

                        return (
                          <g transform={`translate(${x},${y})`}>
                            <text
                              x={0}
                              y={0}
                              textAnchor={textAnchor}
                              fill={fillColor}
                              fontSize="12px"
                              fontWeight="bold"
                            >
                              {payload.value}
                            </text>
                          </g>
                        );
                      }}
                    />
                    <PolarRadiusAxis
                      domain={[0, 12]}
                      angle={18}
                      tick={false}
                      tickCount={6}
                    />
                    <Radar
                      name="score"
                      dataKey="A"
                      stroke={Colors.secondary}
                      fill={Colors.secondary}
                      fillOpacity={0.6}
                      animationDuration={800}
                      animationEasing="ease-in-out"
                      animationBegin={200}
                      isAnimationActive={true}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}
          </InnerBox>

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
                text={personality === null ? "잘못된 접근입니다." : personality}
                fontSize="md"
                fontWeight="bold"
                color={Colors.white}
              />
            </div>
          </InnerBox>
        </Card>

        <Spacer height="24" />
      </div>

      <BottomModal>
        <InnerBox>
          <Text text="기본 프로필 완성!" fontSize="lg" fontWeight="bold" />
          <Spacer height="6" />
          <Text text={`더 많은 정보를 등록하고 공유해보세요`} />
        </InnerBox>

        <Spacer height="22" />

        <Button
          color={Colors.brown}
          fontWeight="bold"
          onClick={() => {
            if (front) {
              setFront(false);
            } else {
              setFront(true);
              alert("댕글 시작하기");
            }
          }}
        >
          {front ? "다음" : "댕글 시작하기"}
        </Button>
      </BottomModal>
    </InnerWrapper>
  );
}
