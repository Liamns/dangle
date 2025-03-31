import Image from "next/image";
import styles from "./page.module.css";
import { BottomModal } from "@/shared/components/modals";
import { Button } from "@/shared/components/buttons";
import { Colors } from "@/shared/consts/colors";
import { InnerWrapper, Spacer } from "@/shared/components/layout";
import Link from "next/link";
import { Text } from "@/shared/components/texts";

export default function Home() {
  return (
    <InnerWrapper>
      <div className={styles.titleImg}>
        <Image
          src="/images/onboarding/title.gif"
          alt="댕글온보딩타이틀"
          fill
          style={{ objectFit: "contain" }}
          unoptimized
          priority
        />
        <div className={styles.belowTitle}>
          <Image
            src="/images/onboarding/below-title.png"
            alt="댕글온보딩이미지"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>
      <div className={styles.welcome}>
        <Text
          text="댕글"
          fontSize="title"
          fontFamily="jalnan"
          fontWeight="bold"
          color={Colors.brown}
        />
        <span>에 오신걸 환영해요!</span>
      </div>
      <BottomModal>
        <Link href="/login" style={{ width: "100%" }}>
          <Button fontWeight="bold">로그인 하기</Button>
        </Link>
        <Spacer height="20" />
        <Button fontWeight="bold" color="white" textColor={Colors.black}>
          <Text
            text="댕글"
            color={Colors.brown}
            fontFamily="jalnan"
            fontWeight="bold"
            fontSize="md"
          />
          <Text text={`\u00a0둘러보기`} fontWeight="bold" fontSize="md" />
          <div className={styles.bracket}>
            <Image
              src="/images/bracket.png"
              alt="둘러보기버튼"
              fill
              sizes="100%"
              style={{ objectFit: "cover" }}
            />
          </div>
        </Button>
      </BottomModal>
    </InnerWrapper>
  );
}
