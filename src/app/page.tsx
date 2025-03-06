import Image from "next/image";
import wrappers from "@/shared/styles/wrapper.module.css";
import styles from "./page.module.css";
import gradients from "@/shared/styles/gradients.module.css";
import classNames from "classnames";
import { InnerWrapper } from "@/shared/components/wrapper";

export default function Home() {
  return (
    <InnerWrapper>
      <div className="flex flex-row items-center justify-center h-screen">
        main
      </div>
    </InnerWrapper>
  );
}
