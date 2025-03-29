import Image from "next/image";
import styles from "./page.module.css";
import { BottomModal } from "@/shared/components/modals";
import { Button } from "@/shared/components/buttons";
import { Colors } from "@/shared/consts/colors";
import { InnerWrapper, Spacer } from "@/shared/components/layout";
import { DangleText } from "@/shared/components/texts";
import Link from "next/link";

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
        <DangleText text="댕글" fontSize="20px" />
        <span>에 오신걸 환영해요!</span>
      </div>
      <BottomModal>
        <Link href="/login" style={{ width: "100%" }}>
          <Button fontWeight="700">로그인 하기</Button>
        </Link>
        <Spacer height="20" />
        <Button fontWeight="700" color="white" textColor={Colors.black}>
          <DangleText text="댕글" color={Colors.brown} />
          <span>&nbsp;둘러보기</span>
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
