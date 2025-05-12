"use client";
import { Card, InnerBox, Spacer } from "../../../../shared/components/layout";
import Image from "next/image";
import styles from "../page.module.scss";
import { motion } from "framer-motion";
import CardHeader from "./CardHeader";
import PersonalityLabel from "./PersonalityLabel";
import RadarChartComponent from "./RadarChartComponent";

export interface ProfileCompletionCardProps {
  front: boolean;
  name: string;
  petSpec: number;
  personality: string | null;
  imageUrl: string;
  radarData: any[];
  resetKey: boolean;
}

export default function ProfileCompletionCard({
  front,
  name,
  petSpec,
  personality,
  imageUrl,
  radarData,
  resetKey,
}: ProfileCompletionCardProps) {
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
              <CardHeader title={`${name} 프로필`} petSpec={petSpec} />
              <Spacer height="66" />
              <div className={styles.imgContainerWrapper}>
                <div className={styles.imgContainer}>
                  <Image src={imageUrl} fill alt="반려동물 성격유형별 GIF" />
                </div>
              </div>
              <PersonalityLabel personality={personality} />
            </InnerBox>
          </Card>
        </div>

        {/* 뒷면 카드 */}
        <div className={`${styles.cardFace} ${styles.cardBack}`}>
          <Card mx="0">
            <InnerBox>
              <CardHeader
                title={`${petSpec === 0 ? "댕댕이" : "야옹이"} 프로필`}
                petSpec={petSpec}
              />
              <Spacer height="28" />
              <RadarChartComponent data={radarData} resetKey={resetKey} />
              <PersonalityLabel personality={personality} />
            </InnerBox>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
