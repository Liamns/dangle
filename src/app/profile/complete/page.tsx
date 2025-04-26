"use client";
import { ArrowButton, Button } from "../../../shared/components/buttons";
import {
  Card,
  Center,
  InnerBox,
  InnerWrapper,
  Spacer,
} from "../../../shared/components/layout";
import { BottomModal } from "../../../shared/components/modals";
import { Text } from "../../../shared/components/texts";
import { Colors } from "../../../shared/consts/colors";
import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "./page.module.scss";
import layoutStyles from "../input/layout.module.scss";
import Dog from "@/shared/svgs/dog.svg";
import Cat from "@/shared/svgs/cat.svg";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/entities/profile/store";
import { getPublicImageUrl } from "../../../shared/lib/supabase";
import {
  determinePersonalityType,
  transformPersonalityToRadarData,
} from "@/entities/profile/model";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { personalityTypeMap, petType } from "../../../shared/types/pet";

export default function CompleteInputProfile() {
  const router = useRouter();
  const [front, setFront] = useState(true);
  const [resetRadar, setResetRadar] = useState(false);
  const currentProfile = useProfileStore((s) => s.currentProfile);
  const name = useProfileStore((state) => state.currentProfile?.petname ?? "");

  // Guard: ensure all registration steps completed, else redirect to the first missing step
  useEffect(() => {
    if (!currentProfile) return router.replace("/profile/select-sp");
    if (currentProfile.petSpec == null)
      return router.replace("/profile/select-sp");
    if (!currentProfile.username)
      return router.replace("/profile/input/username");
    if (!currentProfile.petname)
      return router.replace("/profile/input/pet-name");
    if (!currentProfile.petAge || !currentProfile.petAge.age)
      return router.replace("/profile/input/pet-age");
    if (!currentProfile.petWeight)
      return router.replace("/profile/input/pet-weight");
    if (!currentProfile.petGender)
      return router.replace("/profile/input/pet-gender");
    if (
      !currentProfile.vaccinations ||
      Object.keys(currentProfile.vaccinations).length === 0
    )
      return router.replace("/profile/input/pet-vaccines");
    if (determinePersonalityType(currentProfile) === null)
      return router.replace("/profile/input/pet-personality");
  }, [currentProfile, router]);

  // Restart radar chart animation when flipping to the back side
  useEffect(() => {
    if (!front) {
      setResetRadar((prev) => !prev);
    }
  }, [front]);

  const petSpec = currentProfile?.petSpec ?? 0;

  const personality = determinePersonalityType(currentProfile);
  if (personality === null) {
    alert("성격 유형을 찾을 수 없습니다.");
    router.push("/profile/input/pet-personality");
    return null;
  }
  const tag = personalityTypeMap[personality].tag;
  const url = getPublicImageUrl(
    `profile/personality/${petType[petSpec]}/${tag}.gif`
  );
  const data = transformPersonalityToRadarData(
    currentProfile?.personalityScores
  );

  // Card 전체 뒤집기를 위한 애니메이션 variants
  const flipCardVariants = {
    front: {
      rotateY: 0,
      transition: { duration: 0.8, ease: "easeInOut" },
    },
    back: {
      rotateY: 180,
      transition: { duration: 0.8, ease: "easeInOut" },
    },
  };

  return (
    <InnerWrapper className={styles.scrollable}>
      <div className={styles.cardFlipContainer}>
        <motion.div
          initial="front"
          animate={front ? "front" : "back"}
          variants={flipCardVariants}
          className={styles.flipCard}
        >
          {/* 앞면 카드 */}
          <div className={`${styles.cardFace} ${styles.cardFront}`}>
            <Card mx="0">
              <InnerBox>
                <InnerBox
                  direction="row"
                  style={{
                    width: "calc(100dvw / 360 * 300)",
                    maxWidth: "calc(1200px - (100dvw / 360 * 60))",
                    paddingBottom: "calc(100dvh / 740 * 28)",
                    boxShadow:
                      "0px 9px 17.4545px -9.54545px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Text
                    text={`${name} 프로필`}
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

                <Spacer height="66" />

                <div className={styles.imgContainerWrapper}>
                  <div className={styles.imgContainer}>
                    <Image src={url} fill alt="반려동물 성격유형별 GIF" />
                  </div>
                </div>

                <InnerBox justify="start" direction="column" align="start">
                  <Text
                    text="Personality"
                    fontWeight="bold"
                    color={Colors.primary}
                  />
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
                        personality === null
                          ? "잘못된 접근입니다."
                          : personality
                      }
                      fontSize="lg"
                      fontWeight="bold"
                      color={Colors.white}
                    />
                  </div>
                </InnerBox>
              </InnerBox>
            </Card>
          </div>

          {/* 뒷면 카드 */}
          <div className={`${styles.cardFace} ${styles.cardBack}`}>
            <Card mx="0">
              <InnerBox>
                <InnerBox
                  direction="row"
                  style={{
                    width: "calc(100dvw / 360 * 300)",
                    maxWidth: "calc(1200px - (100dvw / 360 * 60))",
                    paddingBottom: "calc(100dvh / 740 * 28)",
                    boxShadow:
                      "0px 9px 17.4545px -9.54545px rgba(0, 0, 0, 0.1)",
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

                <Spacer height="28" />

                <div className={styles.radarContainerWrapper}>
                  <div className={styles.radarContainer}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart
                        cx="50%"
                        cy="50%"
                        outerRadius="80%"
                        data={data}
                        key={`radar-chart-${resetRadar}`}
                      >
                        <PolarGrid gridType="polygon" />
                        <PolarAngleAxis
                          dataKey="subject"
                          tick={(props) => {
                            const { x, y, textAnchor, payload } = props;

                            // Map colors to traits
                            const colorMap: Record<string, string> = {
                              영리: "#7f4c2f",
                              사교: "#FF8BC1",
                              활발: "#FFDB6D",
                              독립: "#F29F70",
                              차분: "#8CC8DA",
                            };

                            const value = String(payload.value);
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
                          animationDuration={400}
                          animationEasing="ease-out"
                          animationBegin={800}
                          isAnimationActive={true}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <InnerBox justify="start" direction="column" align="start">
                  <Text
                    text="Personality"
                    fontWeight="bold"
                    color={Colors.primary}
                  />
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
                        personality === null
                          ? "잘못된 접근입니다."
                          : personality
                      }
                      fontSize="lg"
                      fontWeight="bold"
                      color={Colors.white}
                    />
                  </div>
                </InnerBox>
              </InnerBox>
            </Card>
          </div>
        </motion.div>
      </div>

      <Spacer height="24" />

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
              router.replace("/home");
            }
          }}
        >
          {front ? "다음" : "댕글 시작하기"}
        </Button>
      </BottomModal>
    </InnerWrapper>
  );
}
