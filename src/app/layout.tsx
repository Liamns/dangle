import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import classNames from "classnames";
import { Wrapper } from "../shared/components/layout";

const inter = Inter({
  variable: "--inter",
  subsets: ["latin"],
});

const jalnan = localFont({
  src: "./fonts/JalnanOTF.otf",
  variable: "--jalnan",
});

export const metadata: Metadata = {
  title: "댕글",
  description:
    "보호자들이 반려동물의 일상과 건강 관리를 한 곳에서 효율적으로 관리하고, 타인과 정보나 팁을 나눌 수 있는 어플리케이션",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const className = classNames(inter.variable, jalnan.variable);

  return (
    <html lang="en">
      <body className={className}>
        <Wrapper>{children}</Wrapper>
      </body>
    </html>
  );
}
