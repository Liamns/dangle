import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import styles from "@/shared/styles/wrapper.module.css";
import classNames from "classnames";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
  const className = classNames(
    styles.wrapper,
    inter.variable,
    geistSans.variable,
    geistMono.variable,
    jalnan.variable
  );

  return (
    <html lang="en">
      <body className={className}>{children}</body>
    </html>
  );
}
