"use client";

import { ArrowButton } from "@/shared/components/buttons";
import { InnerWrapper, Spacer } from "@/shared/components/layout";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Footer from "./footer";
import styles from "./layout.module.scss";

export default function LoginLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();

  return (
    <InnerWrapper>
      <Spacer height="40" />
      <ArrowButton ml="30" onClick={() => router.back()}>
        <Image
          src="/images/white-bracket.png"
          alt="뒤로가기"
          width={5}
          height={8}
          style={{ objectFit: "cover" }}
          sizes="100%"
        />
      </ArrowButton>
      <Spacer height="40" />
      <div className={styles.layout}>{children}</div>
      <Spacer height="18" />
      <Footer />
      <Spacer height="18" />
    </InnerWrapper>
  );
}
