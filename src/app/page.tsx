import Image from "next/image";
import wrappers from "@/shared/styles/wrapper.module.css";
import styles from "./page.module.css";
import gradients from "@/shared/styles/gradients.module.css";
import classNames from "classnames";

export default function Home() {
  const outer = classNames(wrappers.innerWrapper, gradients.mainGradient);

  return (
    <div className={outer}>
      <h1>name</h1>
    </div>
  );
}
